import { NextRequest } from "next/server";
import { proxyUploadRoute } from "@/lib/backend/upload-route-proxy";

export async function POST(request: NextRequest) {
  return proxyUploadRoute(request, "/api/admin/uploads/image");
}
