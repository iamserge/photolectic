"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Send,
  Link2,
  Unlink,
  Camera,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

interface UserSettings {
  id: string;
  email: string;
  name: string | null;
  telegramUserId: string | null;
  telegramUsername: string | null;
  telegramLinkedAt: string | null;
  photographerProfile: {
    displayName: string;
    handle: string;
    bio: string | null;
    location: string | null;
    websiteUrl: string | null;
    socialInstagram: string | null;
    socialX: string | null;
    socialLinkedin: string | null;
  } | null;
}

interface TelegramLinkToken {
  token: string;
  expiresAt: string;
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [telegramToken, setTelegramToken] = useState<TelegramLinkToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/user/settings");
      const data = await res.json();
      setSettings(data.user);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
    setLoading(false);
  };

  const generateTelegramToken = async () => {
    try {
      const res = await fetch("/api/telegram/link", { method: "POST" });
      const data = await res.json();
      setTelegramToken(data);
    } catch (error) {
      console.error("Failed to generate token:", error);
    }
  };

  const unlinkTelegram = async () => {
    try {
      await fetch("/api/telegram/unlink", { method: "POST" });
      fetchSettings();
    } catch (error) {
      console.error("Failed to unlink Telegram:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-500 mt-2">Manage your account preferences and integrations</p>
      </div>

      {/* Profile Settings */}
      <SettingsSection title="Profile" description="Update your personal information">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
              <Mail className="w-5 h-5 text-zinc-500" />
              <span className="text-white">{settings?.email}</span>
              <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Display Name</label>
            <input
              type="text"
              defaultValue={settings?.name || ""}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              placeholder="Your name"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Telegram Integration */}
      <SettingsSection
        title="Telegram Integration"
        description="Connect your Telegram account for instant notifications"
      >
        {settings?.telegramUserId ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Send className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold">Connected to Telegram</p>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-sm text-zinc-400">
                  @{settings.telegramUsername || "User"}
                  <span className="text-zinc-600 ml-2">
                    since {new Date(settings.telegramLinkedAt!).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <button
                onClick={unlinkTelegram}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Unlink className="w-4 h-4" />
                Unlink
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700">
              <h4 className="text-white font-medium mb-2">Notification Preferences</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500" />
                  <span className="text-zinc-300">New license requests</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500" />
                  <span className="text-zinc-300">Photo verification updates</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-amber-500 focus:ring-amber-500" />
                  <span className="text-zinc-300">Payment notifications</span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Send className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Connect Telegram</h4>
                  <p className="text-sm text-zinc-400 mt-1">
                    Link your Telegram account to receive instant notifications about license requests, photo verifications, and more.
                  </p>
                </div>
              </div>
            </div>

            {telegramToken ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
              >
                <h4 className="text-amber-400 font-semibold mb-3">Link Your Account</h4>
                <ol className="space-y-3 text-sm text-zinc-300">
                  <li className="flex gap-2">
                    <span className="text-amber-500 font-bold">1.</span>
                    <span>Open Telegram and search for <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400">@PhotolecticBot</code></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 font-bold">2.</span>
                    <span>Start a chat with the bot</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500 font-bold">3.</span>
                    <span>Send this code:</span>
                  </li>
                </ol>
                <div className="mt-4 flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono text-lg tracking-wider">
                    /link {telegramToken.token}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`/link ${telegramToken.token}`)}
                    className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  This code expires at {new Date(telegramToken.expiresAt).toLocaleTimeString()}
                </p>
              </motion.div>
            ) : (
              <button
                onClick={generateTelegramToken}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-colors"
              >
                <Link2 className="w-5 h-5" />
                Generate Link Code
              </button>
            )}

            <a
              href="https://t.me/PhotolecticBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Open @PhotolecticBot in Telegram
            </a>
          </div>
        )}
      </SettingsSection>

      {/* Photographer Profile (if applicable) */}
      {settings?.photographerProfile && (
        <SettingsSection title="Photographer Profile" description="Customize your public profile">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Display Name</label>
                <input
                  type="text"
                  defaultValue={settings.photographerProfile.displayName}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Handle</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                  <span className="text-zinc-500">@</span>
                  <span className="text-white">{settings.photographerProfile.handle}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Bio</label>
              <textarea
                defaultValue={settings.photographerProfile.bio || ""}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                placeholder="Tell the world about your photography..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Location</label>
                <input
                  type="text"
                  defaultValue={settings.photographerProfile.location || ""}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Website</label>
                <input
                  type="url"
                  defaultValue={settings.photographerProfile.websiteUrl || ""}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="https://yoursite.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Social Links</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700">
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <input
                    type="text"
                    defaultValue={settings.photographerProfile.socialInstagram || ""}
                    className="flex-1 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
                    placeholder="username"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    defaultValue={settings.photographerProfile.socialX || ""}
                    className="flex-1 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
                    placeholder="username"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700">
                  <Linkedin className="w-5 h-5 text-blue-500" />
                  <input
                    type="text"
                    defaultValue={settings.photographerProfile.socialLinkedin || ""}
                    className="flex-1 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>
      )}

      {/* Security */}
      <SettingsSection title="Security" description="Manage your password and security settings">
        <div className="space-y-4">
          <button className="flex items-center gap-3 w-full p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 text-left transition-colors">
            <Lock className="w-5 h-5 text-zinc-400" />
            <div>
              <p className="text-white font-medium">Change Password</p>
              <p className="text-sm text-zinc-500">Update your password to keep your account secure</p>
            </div>
          </button>
          <button className="flex items-center gap-3 w-full p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 text-left transition-colors">
            <Shield className="w-5 h-5 text-zinc-400" />
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-zinc-500">Add an extra layer of security to your account</p>
            </div>
          </button>
        </div>
      </SettingsSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
