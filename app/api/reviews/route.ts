import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/authorization";
import { Permission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

const createReviewSchema = z.object({
  gameId: z.number().int().positive(),
  rating: z.number().min(0.5).max(5).step(0.5),
  content: z.string().min(10, "Review must be at least 10 characters").max(5000, "Review must be less than 5000 characters"),
});

/**
 * GET /api/reviews - Get reviews for a game
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt"; // createdAt, helpful, rating

    if (!gameId) {
      return NextResponse.json(
        { error: "gameId is required" },
        { status: 400 }
      );
    }

    const where = { gameId: parseInt(gameId) };
    
    let orderBy: any = {};
    switch (sortBy) {
      case "helpful":
        orderBy = { helpful: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "createdAt":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews - Create a new review
 */
export async function POST(request: NextRequest) {
  try {
    const context = await requirePermission(Permission.CREATE_REVIEW);
    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    // Check if user already has a review for this game
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_gameId: {
          userId: context.userId,
          gameId: validatedData.gameId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this game" },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: context.userId,
        gameId: validatedData.gameId,
        rating: validatedData.rating,
        content: validatedData.content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: context.userId,
        type: "reviewed",
        gameId: validatedData.gameId,
        gameName: "", // Will be populated from RAWG API if needed
        metadata: { rating: validatedData.rating, reviewId: review.id },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes("already reviewed")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
