import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

const gameStatusSchema = z.enum([
  "PLANNING",
  "PLAYING",
  "COMPLETED",
  "DROPPED",
  "PAUSED",
  "REPLAYING",
]);

const addGameSchema = z.object({
  gameId: z.number().int().positive(),
  status: gameStatusSchema,
  rating: z.number().min(0.5).max(5).optional(),
  hoursPlayed: z.number().min(0).optional(),
  startedDate: z.string().datetime().optional(),
  completedDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  platform: z.string().optional(),
});

// GET /api/library - Get user's game library
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where: any = { userId: user.id };
    if (status && gameStatusSchema.safeParse(status).success) {
      where.status = status;
    }

    const [userGames, total] = await Promise.all([
      prisma.userGame.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.userGame.count({ where }),
    ]);

    return NextResponse.json({
      games: userGames,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get library error:", error);
    return NextResponse.json(
      { error: "Failed to fetch library" },
      { status: 500 }
    );
  }
}

// POST /api/library - Add game to library
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = addGameSchema.parse(body);

    // Check if game already exists in library
    const existingGame = await prisma.userGame.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: validatedData.gameId,
        },
      },
    });

    if (existingGame) {
      return NextResponse.json(
        { error: "Game already in library" },
        { status: 400 }
      );
    }

    const userGame = await prisma.userGame.create({
      data: {
        userId: user.id,
        gameId: validatedData.gameId,
        status: validatedData.status,
        rating: validatedData.rating,
        hoursPlayed: validatedData.hoursPlayed,
        startedDate: validatedData.startedDate
          ? new Date(validatedData.startedDate)
          : null,
        completedDate: validatedData.completedDate
          ? new Date(validatedData.completedDate)
          : null,
        notes: validatedData.notes,
        tags: validatedData.tags || [],
        platform: validatedData.platform,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: "added_to_library",
        gameId: validatedData.gameId,
        gameName: "", // Will be populated from RAWG API
        metadata: { status: validatedData.status },
      },
    });

    return NextResponse.json(userGame, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Add game error:", error);
    return NextResponse.json(
      { error: "Failed to add game to library" },
      { status: 500 }
    );
  }
}
