import { NextResponse } from "next/server";
import { arrayBuffer } from "stream/consumers";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const extensions : String[] = ['.jpg', '.jpeg', '.png'];


    for (let ext of extensions) {
        const url = `${process.env.NEXT_PUBLIC_URL_TEMPLATE_KEY}${id}${ext}`;
        const res = await fetch(url, {
        });
        if (res.status === 200) {
            const contentType = res.headers.get('content-type');
            const blob = await res.arrayBuffer();
            return new NextResponse(blob, {
                headers: {
                    'Content-Type': contentType
                }
            });
        }
    }
    const res = await fetch(process.env.NEXT_PUBLIC_DEFAULT_KEY);
    const blob = await res.arrayBuffer();
    return new NextResponse(blob, {
        headers: {
            'Content-Type': res.headers.get('content-type')
        }
    });
}