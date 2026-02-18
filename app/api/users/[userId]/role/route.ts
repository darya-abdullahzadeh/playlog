import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/authorization";
import { Permission, UserRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

const updateRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

/**
 * GET /api/users/[userId]/role - Get user role (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requirePermission(Permission.MANAGE_ROLES);
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Get user role error:", error);
    return NextResponse.json(
      { error: "Failed to get user role" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[userId]/role - Update user role (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const context = await requirePermission(Permission.MANAGE_ROLES);
    const { userId } = await params;
    const body = await request.json();
    const { role } = updateRoleSchema.parse(body);

    // Prevent users from changing their own role
    if (context.userId === userId) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, username: true, role: true },
    });

    return NextResponse.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Update user role error:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
