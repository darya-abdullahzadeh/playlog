import { handlers } from "@/auth";

// Ensure this route uses Node.js runtime (not Edge)
export const runtime = "nodejs";

export const { GET, POST } = handlers;
