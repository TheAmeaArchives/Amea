import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Add a new header x-url which passes the path to downstream components
    const url = request.nextUrl.clone();
    const response = NextResponse.next();
    response.headers.set('x-url', url.pathname);

    return response;
}

export const config = {
    matcher: [
        // match all routes except static files and APIs
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
