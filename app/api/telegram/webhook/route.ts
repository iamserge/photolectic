import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";
import crypto from "crypto";
import OpenAI from "openai";

// Telegram types
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  photo?: TelegramPhotoSize[];
  caption?: string;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramChat {
  id: number;
  type: string;
}

interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

// OpenAI client
let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

// Send message via Telegram API
async function sendTelegramMessage(chatId: number, text: string, parseMode: "HTML" | "Markdown" = "HTML") {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
    }),
  });
}

// Get file from Telegram
async function getTelegramFile(fileId: string): Promise<Buffer | null> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return null;

  try {
    // Get file path
    const fileInfoRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
    const fileInfo = await fileInfoRes.json();

    if (!fileInfo.ok || !fileInfo.result?.file_path) {
      return null;
    }

    // Download file
    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;
    const fileRes = await fetch(fileUrl);
    const arrayBuffer = await fileRes.arrayBuffer();

    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error downloading Telegram file:", error);
    return null;
  }
}

// Analyze image with OpenAI Vision
async function analyzeImageWithVision(imageUrl: string): Promise<{
  title: string;
  description: string;
  tags: string[];
  category: string;
}> {
  try {
    const response = await getOpenAI().responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Analyze this photo for a stock photography marketplace. Provide:
1. A compelling title (2-5 words)
2. A brief description (1-2 sentences)
3. 5-10 search tags (lowercase)
4. Category from: landscape, portrait, street, architecture, food, wildlife, abstract, travel, urban, nature, fashion, sports, events, product, other

Respond ONLY with JSON: {"title": "...", "description": "...", "tags": [...], "category": "..."}`
            },
            {
              type: "input_image",
              image_url: imageUrl,
            },
          ],
        },
      ],
    });

    const content = response.output_text;
    const jsonMatch = content?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("Vision API error:", error);
  }

  return {
    title: "Untitled Photo",
    description: "Uploaded via Telegram",
    tags: ["photography"],
    category: "other"
  };
}

// Create or get tags
async function getOrCreateTags(tagNames: string[]): Promise<string[]> {
  const tagIds: string[] = [];

  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) continue;

    let tag = await db.tag.findUnique({ where: { slug } });
    if (!tag) {
      tag = await db.tag.create({ data: { name, slug } });
    }
    tagIds.push(tag.id);
  }

  return tagIds;
}

// Handle /link command
async function handleLinkCommand(message: TelegramMessage, token: string) {
  const telegramUserId = message.from.id.toString();
  const chatId = message.chat.id;

  // Find the link token
  const linkToken = await db.telegramLinkToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!linkToken || linkToken.used || linkToken.expiresAt < new Date()) {
    await sendTelegramMessage(chatId,
      "❌ <b>Invalid or expired link code</b>\n\nPlease generate a new code from your Photolectic dashboard."
    );
    return;
  }

  // Link the account
  await db.user.update({
    where: { id: linkToken.userId },
    data: {
      telegramUserId,
      telegramUsername: message.from.username || null,
      telegramLinkedAt: new Date(),
    },
  });

  // Mark token as used
  await db.telegramLinkToken.update({
    where: { id: linkToken.id },
    data: { used: true, usedAt: new Date() },
  });

  await sendTelegramMessage(chatId,
    `✅ <b>Account Linked Successfully!</b>\n\n` +
    `Welcome, <b>${linkToken.user.name || "Photographer"}</b>!\n\n` +
    `You can now:\n` +
    `📸 Send photos to upload them\n` +
    `📊 Use /stats to see your portfolio\n` +
    `📋 Use /photos to list recent uploads\n` +
    `❓ Use /help for all commands`
  );
}

// Handle /stats command
async function handleStatsCommand(userId: string, chatId: number) {
  const stats = await db.photo.groupBy({
    by: ["status"],
    where: { photographerId: userId },
    _count: true,
  });

  const requests = await db.licenseRequest.count({
    where: { photo: { photographerId: userId } },
  });

  const total = stats.reduce((acc, s) => acc + s._count, 0);
  const verified = stats.find(s => s.status === "VERIFIED")?._count || 0;
  const pending = stats.find(s => s.status === "PENDING_REVIEW")?._count || 0;

  await sendTelegramMessage(chatId,
    `📊 <b>Your Portfolio Stats</b>\n\n` +
    `📸 Total Photos: <b>${total}</b>\n` +
    `✅ Verified: <b>${verified}</b>\n` +
    `⏳ Pending: <b>${pending}</b>\n` +
    `📩 License Requests: <b>${requests}</b>\n\n` +
    `Keep uploading great photos! 🌟`
  );
}

// Handle /photos command
async function handlePhotosCommand(userId: string, chatId: number) {
  const photos = await db.photo.findMany({
    where: { photographerId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      title: true,
      status: true,
      createdAt: true,
      _count: { select: { licenseRequests: true } },
    },
  });

  if (photos.length === 0) {
    await sendTelegramMessage(chatId,
      `📸 <b>No Photos Yet</b>\n\nSend me a photo to get started!`
    );
    return;
  }

  const statusEmoji: Record<string, string> = {
    VERIFIED: "✅",
    PENDING_REVIEW: "⏳",
    REJECTED: "❌",
    UPLOADING: "📤",
  };

  const photoList = photos.map((p, i) => {
    const emoji = statusEmoji[p.status] || "📷";
    const requests = p._count.licenseRequests > 0 ? ` (${p._count.licenseRequests} requests)` : "";
    return `${i + 1}. ${emoji} <b>${p.title}</b>${requests}`;
  }).join("\n");

  await sendTelegramMessage(chatId,
    `📸 <b>Recent Photos</b>\n\n${photoList}\n\n` +
    `View all photos at photolectic.com/dashboard`
  );
}

// Handle /help command
async function handleHelpCommand(chatId: number) {
  await sendTelegramMessage(chatId,
    `🤖 <b>Photolectic Bot Commands</b>\n\n` +
    `📸 <b>Send a photo</b> - Upload to your portfolio\n` +
    `📊 /stats - View portfolio statistics\n` +
    `📋 /photos - List recent uploads\n` +
    `🔗 /link [code] - Link your account\n` +
    `🔓 /unlink - Unlink your account\n` +
    `❓ /help - Show this message\n\n` +
    `<b>Tips:</b>\n` +
    `• Photos are auto-tagged with AI\n` +
    `• Add a caption for custom title\n` +
    `• High-res photos get better visibility`
  );
}

// Handle photo upload
async function handlePhotoUpload(message: TelegramMessage, user: { id: string; name: string | null }) {
  const chatId = message.chat.id;
  const photo = message.photo;

  if (!photo || photo.length === 0) {
    return;
  }

  // Get the highest resolution version
  const bestPhoto = photo[photo.length - 1];

  await sendTelegramMessage(chatId, "📤 <b>Uploading your photo...</b>\n\nAnalyzing with AI...");

  try {
    // Download the photo
    const buffer = await getTelegramFile(bestPhoto.file_id);
    if (!buffer) {
      await sendTelegramMessage(chatId, "❌ Failed to download photo. Please try again.");
      return;
    }

    // Generate file hash
    const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Check for duplicate
    const existing = await db.photo.findUnique({ where: { fileHash } });
    if (existing) {
      await sendTelegramMessage(chatId,
        `⚠️ <b>Duplicate Photo</b>\n\nThis photo already exists in your portfolio as "<b>${existing.title}</b>".`
      );
      return;
    }

    // Upload to Vercel Blob
    const filename = `telegram_${Date.now()}.jpg`;
    const blob = await put(`photos/${fileHash}/${filename}`, buffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    // Analyze with OpenAI Vision
    const analysis = await analyzeImageWithVision(blob.url);

    // Use caption as title if provided
    if (message.caption) {
      analysis.title = message.caption;
    }

    // Create or get tags
    const tagIds = await getOrCreateTags(analysis.tags);

    // Create photo record
    const newPhoto = await db.photo.create({
      data: {
        photographerId: user.id,
        title: analysis.title,
        description: analysis.description,
        fileUrl: blob.url,
        thumbnailUrl: blob.url,
        storageKey: blob.pathname,
        status: "PENDING_REVIEW",
        fileSize: buffer.length,
        width: bestPhoto.width,
        height: bestPhoto.height,
        mimeType: "image/jpeg",
        fileHash,
        tags: {
          create: tagIds.map(tagId => ({ tagId }))
        }
      },
    });

    const tagsText = analysis.tags.slice(0, 5).map(t => `#${t}`).join(" ");

    await sendTelegramMessage(chatId,
      `✅ <b>Photo Uploaded!</b>\n\n` +
      `📷 <b>${analysis.title}</b>\n` +
      `📝 ${analysis.description}\n\n` +
      `🏷️ ${tagsText}\n` +
      `📂 Category: ${analysis.category}\n\n` +
      `Your photo is now pending review. We'll notify you when it's verified!`
    );

  } catch (error) {
    console.error("Photo upload error:", error);
    await sendTelegramMessage(chatId,
      "❌ <b>Upload Failed</b>\n\nSomething went wrong. Please try again later."
    );
  }
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const webhookSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (process.env.TELEGRAM_WEBHOOK_SECRET && webhookSecret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update: TelegramUpdate = await request.json();
    const message = update.message;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const telegramUserId = message.from.id.toString();
    const chatId = message.chat.id;

    // Find linked user
    const user = await db.user.findUnique({
      where: { telegramUserId },
      select: { id: true, name: true, roles: true },
    });

    // Handle text commands
    if (message.text) {
      const text = message.text.trim();

      // /start command
      if (text === "/start") {
        if (user) {
          await sendTelegramMessage(chatId,
            `👋 <b>Welcome back, ${user.name || "Photographer"}!</b>\n\n` +
            `Send me photos to upload them to your portfolio.\n` +
            `Use /help to see all commands.`
          );
        } else {
          await sendTelegramMessage(chatId,
            `📸 <b>Welcome to Photolectic!</b>\n\n` +
            `To get started, link your account:\n` +
            `1. Go to photolectic.com/onboarding\n` +
            `2. Complete the Telegram step\n` +
            `3. Send the /link code here\n\n` +
            `Already have a code? Send:\n<code>/link YOUR_CODE</code>`
          );
        }
        return NextResponse.json({ ok: true });
      }

      // /link command
      if (text.startsWith("/link ")) {
        const token = text.replace("/link ", "").trim();
        await handleLinkCommand(message, token);
        return NextResponse.json({ ok: true });
      }

      // Commands requiring linked account
      if (!user) {
        await sendTelegramMessage(chatId,
          `🔗 <b>Account Not Linked</b>\n\n` +
          `Please link your Photolectic account first.\n` +
          `Go to photolectic.com/onboarding to get started.`
        );
        return NextResponse.json({ ok: true });
      }

      // /stats command
      if (text === "/stats") {
        await handleStatsCommand(user.id, chatId);
        return NextResponse.json({ ok: true });
      }

      // /photos command
      if (text === "/photos") {
        await handlePhotosCommand(user.id, chatId);
        return NextResponse.json({ ok: true });
      }

      // /help command
      if (text === "/help") {
        await handleHelpCommand(chatId);
        return NextResponse.json({ ok: true });
      }

      // /unlink command
      if (text === "/unlink") {
        await db.user.update({
          where: { id: user.id },
          data: {
            telegramUserId: null,
            telegramUsername: null,
            telegramLinkedAt: null,
          },
        });
        await sendTelegramMessage(chatId,
          `✅ <b>Account Unlinked</b>\n\nYou can link again anytime from your dashboard.`
        );
        return NextResponse.json({ ok: true });
      }
    }

    // Handle photo uploads
    if (message.photo && message.photo.length > 0) {
      if (!user) {
        await sendTelegramMessage(chatId,
          `🔗 <b>Account Not Linked</b>\n\n` +
          `Please link your Photolectic account to upload photos.\n` +
          `Go to photolectic.com/onboarding to get started.`
        );
        return NextResponse.json({ ok: true });
      }

      if (!user.roles.includes("PHOTOGRAPHER")) {
        await sendTelegramMessage(chatId,
          `📸 <b>Not a Photographer</b>\n\n` +
          `Complete the photographer onboarding at photolectic.com/onboarding to upload photos.`
        );
        return NextResponse.json({ ok: true });
      }

      await handlePhotoUpload(message, user);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
