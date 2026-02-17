import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in search params, use it as the redirection URL
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const origin = request.headers.get("x-forwarded-proto")
                ? `${request.headers.get("x-forwarded-proto")}://${request.headers.get("x-forwarded-host")}`
                : new URL(request.url).origin;

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
