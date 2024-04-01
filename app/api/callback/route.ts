
import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function GET(req: Request) {
    

    const requestUrl = new URL(req.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if(code){
        const supabase = createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }
    return NextResponse.redirect(`${origin}/`);
}

