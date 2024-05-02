import { NextResponse } from "next/server";

/**
 * find the corresponding certification image from the certification id
 * @param req 
 * @returns 
 * if found, it responds with a blob 
 * containing the corresponding image to the client side app
 * 
 * if not found, it will default to a basic certification image and send as blob
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('company_name');
    const extensions : string[] = ['.jpg', '.jpeg', '.png'];
    console.log(id);
    // Iterate through the extensions and try to find a matching image
    for (let ext of extensions) {
        const url = `${process.env.NEXT_PUBLIC_COMPANY_LOGO_URL}${id.toLowerCase()}${ext}`;
        const res = await fetch(url);
        if (res.ok) {
            const contentType = res.headers.get('content-type');
            const blob = await res.arrayBuffer();
            return new NextResponse(blob, {
                headers: {
                    'Content-Type': contentType
                }
            });
        }
    }

    // If no matching image is found, return the default image
    const defaultRes = await fetch(process.env.NEXT_PUBLIC_DEFAULT_KEY);
    const defaultBlob = await defaultRes.arrayBuffer();
    return new NextResponse(defaultBlob, {
        headers: {
            'Content-Type': defaultRes.headers.get('content-type')
        }
    });
}