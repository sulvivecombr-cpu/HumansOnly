import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const passthroughMiddleware = (request: NextRequest) => {
    const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-request-id", requestId);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    response.headers.set("x-request-id", requestId);
    return response;
};

const clerkHandler = clerkMiddleware((_auth, request) => {
    const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-request-id", requestId);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    response.headers.set("x-request-id", requestId);
    return response;
});

// Same convention as CI builds: SKIP_CLERK_CI_BUILD=1 boots without Clerk keys.
export default process.env.SKIP_CLERK_CI_BUILD === "1" ? passthroughMiddleware : clerkHandler;

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
