"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadResult {
  filename: string;
  status: "success" | "error" | "skipped" | "pending";
  photoId?: string;
  title?: string;
  tags?: string[];
  url?: string;
  reason?: string;
  existingId?: string;
}

export default function AdminUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/")
    );

    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/")
      );
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    // Filter out duplicates
    const existingNames = new Set(files.map((f) => f.name));
    const uniqueFiles = newFiles.filter((f) => !existingNames.has(f.name));

    // Generate previews
    uniqueFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({
          ...prev,
          [file.name]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    });

    setFiles((prev) => [...prev, ...uniqueFiles]);
  };

  const removeFile = (filename: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== filename));
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[filename];
      return newPreviews;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setResults(files.map((f) => ({ filename: f.name, status: "pending" })));

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("autoAnalyze", autoAnalyze.toString());

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setResults(data.results);
    } catch (error) {
      console.error("Upload error:", error);
      setResults(
        files.map((f) => ({
          filename: f.name,
          status: "error",
          reason: error instanceof Error ? error.message : "Upload failed",
        }))
      );
    } finally {
      setUploading(false);
    }
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const skippedCount = results.filter((r) => r.status === "skipped").length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Bulk Photo Upload</h1>
            <p className="text-zinc-400 mt-2">
              Upload multiple photos at once with AI-powered auto-tagging
            </p>
          </div>
        </div>

        {/* AI Toggle */}
        <div className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={autoAnalyze}
                onChange={(e) => setAutoAnalyze(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoAnalyze ? "bg-amber-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    autoAnalyze ? "translate-x-6" : "translate-x-0.5"
                  } mt-0.5`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="font-medium">AI Auto-Tagging</span>
            </div>
            <span className="text-sm text-zinc-500">
              Automatically generate titles, descriptions, and tags using OpenAI Vision
            </span>
          </label>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            dragActive
              ? "border-amber-500 bg-amber-500/10"
              : "border-zinc-700 hover:border-zinc-600"
          }`}
        >
          <input
            type="file"
            id="file-input"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="sr-only"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-zinc-800">
                <Upload className="w-8 h-8 text-zinc-400" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  Drop images here or{" "}
                  <span className="text-amber-500">browse</span>
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  Supports JPG, PNG, WebP up to 10MB each
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* File Preview Grid */}
        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Selected Files ({files.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFiles([]);
                  setPreviews({});
                  setResults([]);
                }}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {files.map((file) => {
                const result = results.find((r) => r.filename === file.name);
                return (
                  <div
                    key={file.name}
                    className="relative group aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800"
                  >
                    {previews[file.name] ? (
                      <img
                        src={previews[file.name]}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-zinc-600" />
                      </div>
                    )}

                    {/* Status Overlay */}
                    {result && (
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${
                          result.status === "success"
                            ? "bg-emerald-500/20"
                            : result.status === "error"
                            ? "bg-red-500/20"
                            : result.status === "skipped"
                            ? "bg-amber-500/20"
                            : "bg-zinc-900/80"
                        }`}
                      >
                        {result.status === "success" && (
                          <Check className="w-8 h-8 text-emerald-500" />
                        )}
                        {result.status === "error" && (
                          <AlertCircle className="w-8 h-8 text-red-500" />
                        )}
                        {result.status === "skipped" && (
                          <AlertCircle className="w-8 h-8 text-amber-500" />
                        )}
                        {result.status === "pending" && (
                          <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                        )}
                      </div>
                    )}

                    {/* Remove Button */}
                    {!uploading && !result && (
                      <button
                        onClick={() => removeFile(file.name)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-900/80 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Filename */}
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs truncate">{file.name}</p>
                      {result?.title && result.status === "success" && (
                        <p className="text-xs text-amber-500 truncate">
                          {result.title}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results.length > 0 && !uploading && (
          <div className="mt-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="font-semibold mb-2">Upload Results</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-emerald-500">
                {successCount} uploaded
              </span>
              {skippedCount > 0 && (
                <span className="text-amber-500">
                  {skippedCount} skipped (duplicates)
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-red-500">{errorCount} failed</span>
              )}
            </div>

            {/* Show tags generated */}
            {successCount > 0 && autoAnalyze && (
              <div className="mt-4">
                <p className="text-sm text-zinc-500 mb-2">Generated tags:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...new Set(
                      results
                        .filter((r) => r.status === "success" && r.tags)
                        .flatMap((r) => r.tags || [])
                    ),
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {files.length} {files.length === 1 ? "Photo" : "Photos"}
              </>
            )}
          </Button>

          {results.some((r) => r.status === "success") && (
            <Button
              variant="outline"
              onClick={() => router.push("/admin/photos")}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              View in Photo Manager
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
          <h3 className="font-semibold mb-4">Upload Guidelines</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
              Photos are uploaded to Vercel Blob storage for fast global delivery
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
              AI analysis generates titles, descriptions, and tags automatically
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
              Duplicate photos are detected by file hash and skipped
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
              All uploads start in "Pending Review" status for verification
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
