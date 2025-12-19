import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's photos with counts
    const [
      totalPhotos,
      verifiedPhotos,
      pendingPhotos,
      licenseRequests,
      recentPhotos,
      recentRequests,
    ] = await Promise.all([
      // Total photos count
      db.photo.count({
        where: { photographerId: userId },
      }),
      // Verified photos count
      db.photo.count({
        where: { photographerId: userId, status: "VERIFIED" },
      }),
      // Pending photos count
      db.photo.count({
        where: { photographerId: userId, status: "PENDING_REVIEW" },
      }),
      // License requests count (for photographer's photos)
      db.licenseRequest.count({
        where: {
          photo: { photographerId: userId },
        },
      }),
      // Recent photos (last 4)
      db.photo.findMany({
        where: { photographerId: userId },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          fileUrl: true,
          status: true,
          _count: {
            select: { licenseRequests: true },
          },
        },
      }),
      // Recent license requests (last 3)
      db.licenseRequest.findMany({
        where: {
          photo: { photographerId: userId },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          photo: {
            select: { title: true },
          },
          buyer: {
            select: { name: true, email: true },
          },
          licenseOption: {
            select: { name: true, type: true },
          },
        },
      }),
    ]);

    // Calculate verification rate
    const verificationRate = totalPhotos > 0
      ? Math.round((verifiedPhotos / totalPhotos) * 100 * 10) / 10
      : 0;

    // Count new requests today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newRequestsToday = await db.licenseRequest.count({
      where: {
        photo: { photographerId: userId },
        createdAt: { gte: today },
      },
    });

    // Count photos added this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const photosThisWeek = await db.photo.count({
      where: {
        photographerId: userId,
        createdAt: { gte: weekAgo },
      },
    });

    // Format recent photos
    const formattedPhotos = recentPhotos.map((photo) => ({
      id: photo.id,
      title: photo.title,
      src: photo.thumbnailUrl || photo.fileUrl,
      status: photo.status,
      requests: photo._count.licenseRequests,
    }));

    // Format recent requests with relative time
    const formattedRequests = recentRequests.map((request) => {
      const now = new Date();
      const created = new Date(request.createdAt);
      const diffMs = now.getTime() - created.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      let createdAt;
      if (diffHours < 1) {
        createdAt = "Just now";
      } else if (diffHours < 24) {
        createdAt = `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
      } else {
        createdAt = `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
      }

      return {
        id: request.id,
        photo: request.photo.title,
        buyer: request.buyer.name || request.buyer.email,
        license: request.licenseOption?.name || "Custom",
        status: request.status,
        createdAt,
      };
    });

    return NextResponse.json({
      stats: {
        totalPhotos,
        verifiedPhotos,
        pendingPhotos,
        licenseRequests,
        verificationRate,
        newRequestsToday,
        photosThisWeek,
      },
      recentPhotos: formattedPhotos,
      recentRequests: formattedRequests,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
