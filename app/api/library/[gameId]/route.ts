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

const updateGameSchema = z.object({
  status: gameStatusSchema.optional(),
  rating: z.number().min(0.5).max(5).optional().nullable(),
  hoursPlayed: z.number().min(0).optional().nullable(),
  startedDate: z.string().datetime().optional().nullable(),
  completedDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  platform: z.string().optional().nullable(),
});

// GET /api/library/[gameId] - Get specific game from library
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const user = await requireAuth();
    const { gameId } = await params;
    const gameIdNum = parseInt(gameId);

    if (isNaN(gameIdNum)) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const userGame = await prisma.userGame.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: gameIdNum,
        },
      },
    });

    if (!userGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(userGame);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get game error:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}

// PATCH /api/library/[gameId] - Update game in library
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const user = await requireAuth();
    const { gameId } = await params;
    const gameIdNum = parseInt(gameId);
    const body = await request.json();
    const validatedData = updateGameSchema.parse(body);

    if (isNaN(gameIdNum)) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const existingGame = await prisma.userGame.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: gameIdNum,
        },
      },
    });

    if (!existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (validatedData.status !== undefined) updateData.status = validatedData.status;
    if (validatedData.rating !== undefined) updateData.rating = validatedData.rating;
    if (validatedData.hoursPlayed !== undefined) updateData.hoursPlayed = validatedData.hoursPlayed;
    if (validatedData.startedDate !== undefined) {
      updateData.startedDate = validatedData.startedDate ? new Date(validatedData.startedDate) : null;
    }
    if (validatedData.completedDate !== undefined) {
      updateData.completedDate = validatedData.completedDate ? new Date(validatedData.completedDate) : null;
    }
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags;
    if (validatedData.platform !== undefined) updateData.platform = validatedData.platform;

    const userGame = await prisma.userGame.update({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: gameIdNum,
        },
      },
      data: updateData,
    });

    // Create activity if status changed
    if (validatedData.status && validatedData.status !== existingGame.status) {
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: validatedData.status === "COMPLETED" ? "completed" : "started",
          gameId: gameIdNum,
          gameName: "",
          metadata: { status: validatedData.status },
        },
      });
    }

    return NextResponse.json(userGame);
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
    console.error("Update game error:", error);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

// DELETE /api/library/[gameId] - Remove game from library
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const user = await requireAuth();
    const { gameId } = await params;
    const gameIdNum = parseInt(gameId);

    if (isNaN(gameIdNum)) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    await prisma.userGame.delete({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: gameIdNum,
        },
      },
    });

    return NextResponse.json({ message: "Game removed from library" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete game error:", error);
    return NextResponse.json(
      { error: "Failed to remove game" },
      { status: 500 }
    );
  }
}
