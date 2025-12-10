import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient, UserRole, PhotoStatus, LicenseType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check your .env file.");
}

// Use pg Pool for Node.js environment
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

// Seed photographers
const photographers = [
  {
    email: "alex@photolectic.com",
    name: "Alex Rivers",
    handle: "alexrivers",
    bio: "Landscape photographer capturing the beauty of nature. Based in Colorado, chasing light across mountains and valleys.",
    location: "Colorado, USA",
    socialInstagram: "alexrivers_photo",
    socialX: "alexrivers",
  },
  {
    email: "maya@photolectic.com",
    name: "Maya Chen",
    handle: "mayachen",
    bio: "Portrait and fashion photographer. I believe every face tells a story worth capturing.",
    location: "Los Angeles, USA",
    socialInstagram: "mayachen_portraits",
    socialX: "mayachenphoto",
  },
  {
    email: "kai@photolectic.com",
    name: "Kai Tanaka",
    handle: "kaitanaka",
    bio: "Street photographer exploring the intersection of light, shadow, and urban life in Tokyo.",
    location: "Tokyo, Japan",
    socialInstagram: "kai_street",
    socialX: "kaitanaka",
  },
  {
    email: "lena@photolectic.com",
    name: "Lena Schmidt",
    handle: "lenaschmidt",
    bio: "Architectural photographer with a passion for minimalism and geometric patterns.",
    location: "Berlin, Germany",
    socialInstagram: "lena_architecture",
    socialX: "lenaschmidtphoto",
  },
  {
    email: "marcus@photolectic.com",
    name: "Marcus Webb",
    handle: "marcuswebb",
    bio: "Wildlife and documentary photographer. Dedicated to conservation through imagery.",
    location: "Cape Town, South Africa",
    socialInstagram: "marcus_wildlife",
    socialX: "marcuswebb",
  },
  {
    email: "sofia@photolectic.com",
    name: "Sofia Reyes",
    handle: "sofiareyes",
    bio: "Travel photographer documenting cultures and landscapes around the world.",
    location: "Barcelona, Spain",
    socialInstagram: "sofia_travels",
    socialX: "sofiareyes",
  },
  {
    email: "james@photolectic.com",
    name: "James Liu",
    handle: "jamesliu",
    bio: "Urban photographer capturing the pulse of cities at night. Cityscapes and street photography.",
    location: "Hong Kong",
    socialInstagram: "james_urban",
    socialX: "jamesliuhk",
  },
  {
    email: "emma@photolectic.com",
    name: "Emma Blanc",
    handle: "emmablanc",
    bio: "Food and lifestyle photographer. Making delicious moments look even better.",
    location: "Melbourne, Australia",
    socialInstagram: "emma_food",
    socialX: "emmablanc",
  },
];

// Seed photos with their photographers
const photos = [
  {
    photographerHandle: "alexrivers",
    title: "Golden Hour Mountains",
    src: "/images/seed/seed-landscape-01.webp",
    category: "landscape",
    tags: ["mountains", "sunset", "nature", "golden hour"],
    location: "Colorado, USA",
    cameraMake: "Hasselblad",
    cameraModel: "X2D 100C",
    lens: "XCD 90mm f/2.5",
    aperture: "f/8",
    shutterSpeed: "1/250s",
    iso: 100,
    focalLength: "90mm",
  },
  {
    photographerHandle: "alexrivers",
    title: "Ocean Paradise",
    src: "/images/seed/seed-landscape-02.webp",
    category: "landscape",
    tags: ["ocean", "beach", "tropical", "paradise"],
    location: "Maldives",
    cameraMake: "Phase One",
    cameraModel: "IQ4 150MP",
    lens: "Schneider 55mm f/2.8",
    aperture: "f/11",
    shutterSpeed: "1/500s",
    iso: 64,
    focalLength: "55mm",
  },
  {
    photographerHandle: "sofiareyes",
    title: "Autumn Forest",
    src: "/images/seed/seed-landscape-03.webp",
    category: "landscape",
    tags: ["forest", "autumn", "fog", "trees"],
    location: "Vermont, USA",
    cameraMake: "Nikon",
    cameraModel: "D850",
    lens: "85mm f/1.4G",
    aperture: "f/4",
    shutterSpeed: "1/125s",
    iso: 400,
    focalLength: "85mm",
  },
  {
    photographerHandle: "mayachen",
    title: "Wisdom in Eyes",
    src: "/images/seed/seed-portrait-04.webp",
    category: "portrait",
    tags: ["portrait", "elder", "culture", "wisdom"],
    location: "Kyoto, Japan",
    cameraMake: "Canon",
    cameraModel: "EOS 5D Mark IV",
    lens: "85mm f/1.4L",
    aperture: "f/2",
    shutterSpeed: "1/200s",
    iso: 200,
    focalLength: "85mm",
  },
  {
    photographerHandle: "mayachen",
    title: "Golden Light Portrait",
    src: "/images/seed/seed-portrait-05.webp",
    category: "portrait",
    tags: ["portrait", "fashion", "golden hour", "beauty"],
    location: "Los Angeles, USA",
    cameraMake: "Sony",
    cameraModel: "A7R IV",
    lens: "Zeiss 85mm f/1.4",
    aperture: "f/1.8",
    shutterSpeed: "1/320s",
    iso: 100,
    focalLength: "85mm",
  },
  {
    photographerHandle: "marcuswebb",
    title: "Market Colors",
    src: "/images/seed/seed-portrait-06.webp",
    category: "portrait",
    tags: ["street", "culture", "market", "documentary"],
    location: "Mumbai, India",
    cameraMake: "Leica",
    cameraModel: "SL2",
    lens: "Summilux 50mm f/1.4",
    aperture: "f/2.8",
    shutterSpeed: "1/250s",
    iso: 800,
    focalLength: "50mm",
  },
  {
    photographerHandle: "kaitanaka",
    title: "Neon Nights Tokyo",
    src: "/images/seed/seed-street-07.webp",
    category: "street",
    tags: ["night", "neon", "urban", "tokyo"],
    location: "Tokyo, Japan",
    cameraMake: "Fujifilm",
    cameraModel: "X-T4",
    lens: "XF 23mm f/1.4",
    aperture: "f/1.4",
    shutterSpeed: "1/60s",
    iso: 3200,
    focalLength: "23mm",
  },
  {
    photographerHandle: "jamesliu",
    title: "NYC Morning Steam",
    src: "/images/seed/seed-street-08.webp",
    category: "street",
    tags: ["street", "city", "morning", "documentary"],
    location: "New York, USA",
    cameraMake: "Leica",
    cameraModel: "Q2",
    lens: "Summilux 28mm f/1.7",
    aperture: "f/4",
    shutterSpeed: "1/500s",
    iso: 400,
    focalLength: "28mm",
  },
  {
    photographerHandle: "lenaschmidt",
    title: "Geometric Shadows",
    src: "/images/seed/seed-architecture-09.webp",
    category: "architecture",
    tags: ["architecture", "minimal", "shadow", "geometric"],
    location: "Berlin, Germany",
    cameraMake: "Phase One",
    cameraModel: "IQ4 150MP",
    lens: "Schneider 35mm f/3.5",
    aperture: "f/11",
    shutterSpeed: "1/125s",
    iso: 100,
    focalLength: "35mm",
  },
  {
    photographerHandle: "lenaschmidt",
    title: "Luxury Interior",
    src: "/images/seed/seed-architecture-10.webp",
    category: "architecture",
    tags: ["interior", "luxury", "modern", "design"],
    location: "Dubai, UAE",
    cameraMake: "Sony",
    cameraModel: "A7R V",
    lens: "Tilt-Shift 24mm f/3.5",
    aperture: "f/8",
    shutterSpeed: "1/15s",
    iso: 100,
    focalLength: "24mm",
  },
  {
    photographerHandle: "marcuswebb",
    title: "King of the Savanna",
    src: "/images/seed/seed-wildlife-11.webp",
    category: "wildlife",
    tags: ["lion", "wildlife", "africa", "safari"],
    location: "Serengeti, Tanzania",
    cameraMake: "Canon",
    cameraModel: "EOS R5",
    lens: "600mm f/4L",
    aperture: "f/4",
    shutterSpeed: "1/1000s",
    iso: 400,
    focalLength: "600mm",
  },
  {
    photographerHandle: "sofiareyes",
    title: "Ocean Guardian",
    src: "/images/seed/seed-wildlife-12.webp",
    category: "wildlife",
    tags: ["turtle", "ocean", "underwater", "marine"],
    location: "Great Barrier Reef, Australia",
    cameraMake: "Nikon",
    cameraModel: "Z9",
    lens: "Nikkor 14-30mm f/4",
    aperture: "f/5.6",
    shutterSpeed: "1/250s",
    iso: 800,
    focalLength: "24mm",
  },
  {
    photographerHandle: "emmablanc",
    title: "Omakase Perfection",
    src: "/images/seed/seed-food-13.webp",
    category: "food",
    tags: ["sushi", "food", "japanese", "culinary"],
    location: "Tokyo, Japan",
    cameraMake: "Phase One",
    cameraModel: "IQ4 150MP",
    lens: "Schneider 80mm f/2.8 Macro",
    aperture: "f/5.6",
    shutterSpeed: "1/125s",
    iso: 200,
    focalLength: "80mm",
  },
  {
    photographerHandle: "emmablanc",
    title: "Morning Latte Art",
    src: "/images/seed/seed-food-14.webp",
    category: "food",
    tags: ["coffee", "latte", "cafe", "lifestyle"],
    location: "Melbourne, Australia",
    cameraMake: "Hasselblad",
    cameraModel: "X2D 100C",
    lens: "XCD 80mm f/1.9",
    aperture: "f/2.8",
    shutterSpeed: "1/200s",
    iso: 400,
    focalLength: "80mm",
  },
  {
    photographerHandle: "alexrivers",
    title: "Dewdrop Universe",
    src: "/images/seed/seed-abstract-15.webp",
    category: "abstract",
    tags: ["macro", "water", "abstract", "nature"],
    location: "Studio",
    cameraMake: "Canon",
    cameraModel: "EOS R5",
    lens: "MP-E 65mm f/2.8 Macro",
    aperture: "f/8",
    shutterSpeed: "1/200s",
    iso: 100,
    focalLength: "65mm",
  },
  {
    photographerHandle: "kaitanaka",
    title: "Light Trails",
    src: "/images/seed/seed-abstract-16.webp",
    category: "abstract",
    tags: ["long exposure", "light", "abstract", "night"],
    location: "Osaka, Japan",
    cameraMake: "Sony",
    cameraModel: "A7R IV",
    lens: "Zeiss 35mm f/1.4",
    aperture: "f/11",
    shutterSpeed: "30s",
    iso: 100,
    focalLength: "35mm",
  },
  {
    photographerHandle: "sofiareyes",
    title: "Ancient Temples at Dawn",
    src: "/images/seed/seed-travel-17.webp",
    category: "travel",
    tags: ["temple", "sunrise", "myanmar", "asia"],
    location: "Bagan, Myanmar",
    cameraMake: "Nikon",
    cameraModel: "Z9",
    lens: "Nikkor 24-70mm f/2.8",
    aperture: "f/8",
    shutterSpeed: "1/125s",
    iso: 200,
    focalLength: "35mm",
  },
  {
    photographerHandle: "marcuswebb",
    title: "Spice Market Colors",
    src: "/images/seed/seed-travel-18.webp",
    category: "travel",
    tags: ["market", "spices", "culture", "morocco"],
    location: "Marrakech, Morocco",
    cameraMake: "Leica",
    cameraModel: "SL2",
    lens: "Summilux 35mm f/1.4",
    aperture: "f/2.8",
    shutterSpeed: "1/250s",
    iso: 400,
    focalLength: "35mm",
  },
  {
    photographerHandle: "jamesliu",
    title: "Hong Kong Density",
    src: "/images/seed/seed-urban-19.webp",
    category: "urban",
    tags: ["cityscape", "night", "urban", "hongkong"],
    location: "Hong Kong",
    cameraMake: "Sony",
    cameraModel: "A7R V",
    lens: "Zeiss 24mm f/1.4",
    aperture: "f/8",
    shutterSpeed: "4s",
    iso: 100,
    focalLength: "24mm",
  },
  {
    photographerHandle: "lenaschmidt",
    title: "Industrial Beauty",
    src: "/images/seed/seed-urban-20.webp",
    category: "urban",
    tags: ["industrial", "decay", "urban exploration", "architecture"],
    location: "Detroit, USA",
    cameraMake: "Hasselblad",
    cameraModel: "X2D 100C",
    lens: "XCD 21mm f/4",
    aperture: "f/8",
    shutterSpeed: "1/60s",
    iso: 800,
    focalLength: "21mm",
  },
];

// License options templates
const licenseTemplates = [
  {
    type: LicenseType.PERSONAL,
    name: "Personal Use",
    priceCents: 2900,
    description: "For personal, non-commercial use only",
    usageTerms: "Single user, personal projects, no resale rights",
  },
  {
    type: LicenseType.EDITORIAL,
    name: "Editorial",
    priceCents: 9900,
    description: "For news, blog, and editorial content",
    usageTerms: "Online and print editorial use, photo credit required",
  },
  {
    type: LicenseType.COMMERCIAL,
    name: "Commercial",
    priceCents: 29900,
    description: "For commercial marketing and advertising",
    usageTerms: "Digital and print advertising, product packaging, unlimited impressions",
  },
  {
    type: LicenseType.EXTENDED,
    name: "Extended",
    priceCents: 99900,
    description: "Full commercial rights with extended usage",
    usageTerms: "All commercial uses, resale products, unlimited distribution",
  },
];

async function main() {
  console.log("\n🌱 Starting Photolectic seed...\n");

  // Create admin user
  console.log("Creating admin user...");
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@photolectic.com" },
    update: {},
    create: {
      email: "admin@photolectic.com",
      name: "Admin User",
      passwordHash: adminPassword,
      roles: [UserRole.ADMIN, UserRole.BUYER],
      emailVerified: new Date(),
    },
  });
  console.log(`  ✓ Admin created: ${admin.email}`);

  // Create photographers
  console.log("\nCreating photographers...");
  const photographerPassword = await bcrypt.hash("photo123456", 12);
  const photographerMap = new Map<string, string>();

  for (const photographer of photographers) {
    const user = await prisma.user.upsert({
      where: { email: photographer.email },
      update: {},
      create: {
        email: photographer.email,
        name: photographer.name,
        passwordHash: photographerPassword,
        roles: [UserRole.PHOTOGRAPHER, UserRole.BUYER],
        emailVerified: new Date(),
        photographerProfile: {
          create: {
            displayName: photographer.name,
            handle: photographer.handle,
            bio: photographer.bio,
            location: photographer.location,
            socialInstagram: photographer.socialInstagram,
            socialX: photographer.socialX,
            isVerified: true,
          },
        },
      },
    });
    photographerMap.set(photographer.handle, user.id);
    console.log(`  ✓ Photographer created: ${photographer.name}`);
  }

  // Create tags
  console.log("\nCreating tags...");
  const allTags = [...new Set(photos.flatMap((p) => p.tags))];
  const tagMap = new Map<string, string>();

  for (const tagName of allTags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, "-");
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: {
        name: tagName,
        slug,
      },
    });
    tagMap.set(tagName, tag.id);
  }
  console.log(`  ✓ Created ${allTags.length} tags`);

  // Create photos
  console.log("\nCreating photos...");
  for (const photo of photos) {
    const photographerId = photographerMap.get(photo.photographerHandle);
    if (!photographerId) continue;

    // Generate a unique hash for the photo
    const fileHash = createHash("sha256")
      .update(photo.src + photo.title + Date.now().toString())
      .digest("hex");

    const createdPhoto = await prisma.photo.upsert({
      where: { fileHash },
      update: {},
      create: {
        photographerId,
        title: photo.title,
        description: `A stunning ${photo.category} photograph captured in ${photo.location}.`,
        fileUrl: photo.src,
        thumbnailUrl: photo.src,
        mediumUrl: photo.src,
        storageKey: `seed/${photo.src.split("/").pop()}`,
        status: PhotoStatus.VERIFIED,
        verificationScore: 0.95 + Math.random() * 0.05,
        verificationNotes: "Verified: Complete EXIF data present, authentic camera metadata detected.",
        verifiedAt: new Date(),
        width: 2400,
        height: 1600,
        fileSize: 2500000 + Math.floor(Math.random() * 1500000),
        mimeType: "image/webp",
        shootDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        cameraMake: photo.cameraMake,
        cameraModel: photo.cameraModel,
        lens: photo.lens,
        aperture: photo.aperture,
        shutterSpeed: photo.shutterSpeed,
        iso: photo.iso,
        focalLength: photo.focalLength,
        fileHash,
        primaryColor: "#F59E0B",
        dominantColors: ["#0A0A0B", "#F59E0B", "#1E293B"],
      },
    });

    // Connect tags
    for (const tagName of photo.tags) {
      const tagId = tagMap.get(tagName);
      if (tagId) {
        await prisma.photoTag.upsert({
          where: {
            photoId_tagId: {
              photoId: createdPhoto.id,
              tagId,
            },
          },
          update: {},
          create: {
            photoId: createdPhoto.id,
            tagId,
          },
        });
      }
    }

    // Create license options
    for (const template of licenseTemplates) {
      await prisma.licenseOption.create({
        data: {
          photoId: createdPhoto.id,
          type: template.type,
          name: template.name,
          priceCents: template.priceCents,
          description: template.description,
          usageTerms: template.usageTerms,
        },
      });
    }

    console.log(`  ✓ Photo created: ${photo.title}`);
  }

  // Create demo buyer
  console.log("\nCreating demo buyer...");
  const buyerPassword = await bcrypt.hash("buyer123456", 12);
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@example.com" },
    update: {},
    create: {
      email: "buyer@example.com",
      name: "Demo Buyer",
      passwordHash: buyerPassword,
      roles: [UserRole.BUYER],
      emailVerified: new Date(),
    },
  });
  console.log(`  ✓ Buyer created: ${buyer.email}`);

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║  Seed Complete!                          ║");
  console.log("╚══════════════════════════════════════════╝\n");
  console.log("Demo accounts:");
  console.log("  Admin:        admin@photolectic.com / admin123456");
  console.log("  Photographer: alex@photolectic.com / photo123456");
  console.log("  Buyer:        buyer@example.com / buyer123456\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
