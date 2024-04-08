import { NextRequest, NextResponse, userAgent } from "next/server";
import { updateSession } from "./app/utils/supabase/middleware";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ONE_DAY_IN_SECONDS = 86400;

/**
 * this middleware has 2 purposes:
 * 1. for rate limiting users who are attempting to register a company (1 each day)
 * 2. supabase authentication (cookies)
 */
export async function middleware(request: NextRequest){
    if(request.nextUrl.pathname === '/api/recaptcha'){

        const ip = request.headers.get('x-forwarded-for') || request.ip;

        const ipExists = await redis.exists(`${ip}`);
    
        if(ipExists){

          const remainingTime = await redis.ttl(`${ip}`);
          
          if(remainingTime > 0){
            return NextResponse.json(
              {
                success: false,
                message: 'Can only make 1 request per day'
              },
              {status: 429}
            );
          }
        }
        
        await redis.set(`${ip}`, '1', {ex: ONE_DAY_IN_SECONDS });
    }
    return await updateSession(request);
}

export const config = {
    matcher: [
      /*
       * Match all request paths except:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
       * Feel free to modify this pattern to include more paths.
       */
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
  };
