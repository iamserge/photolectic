import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["PHOTOGRAPHER", "BUYER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile schemas
export const photographerProfileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(30, "Handle must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Handle can only contain letters, numbers, and underscores"
    ),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  location: z.string().max(100).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  socialInstagram: z.string().optional(),
  socialX: z.string().optional(),
});

// Photo schemas
export const photoUploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
  shootDate: z.string().datetime().optional(),
});

export const photoUpdateSchema = photoUploadSchema.partial();

// License schemas
export const licenseOptionSchema = z.object({
  type: z.enum(["PERSONAL", "EDITORIAL", "COMMERCIAL", "EXTENDED"]),
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  priceCents: z.number().min(0),
  currency: z.string().default("USD"),
  usageTerms: z.string().max(2000).optional(),
});

export const licenseRequestSchema = z.object({
  photoId: z.string().cuid(),
  licenseOptionId: z.string().cuid().optional(),
  message: z.string().max(1000).optional(),
  intendedUse: z.string().max(500).optional(),
});

// Admin schemas
export const adminReviewSchema = z.object({
  photoId: z.string().cuid(),
  decision: z.enum(["VERIFIED", "REJECTED", "NEEDS_INFO"]),
  notes: z.string().max(1000).optional(),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PhotographerProfileInput = z.infer<typeof photographerProfileSchema>;
export type PhotoUploadInput = z.infer<typeof photoUploadSchema>;
export type PhotoUpdateInput = z.infer<typeof photoUpdateSchema>;
export type LicenseOptionInput = z.infer<typeof licenseOptionSchema>;
export type LicenseRequestInput = z.infer<typeof licenseRequestSchema>;
export type AdminReviewInput = z.infer<typeof adminReviewSchema>;
