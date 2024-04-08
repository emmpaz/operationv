import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";


/**
 * TODO: create middleware for limits
*/

export async function POST(req: NextRequest){
    const secretKey = process.env.NEXT_PUBLIC_SITE_SECRET;
    /**
     * need to convert the json string to json object 
     */
    const {token} = await req.json();
    
    let fetch_res: Response;

    const formData = `secret=${secretKey}&response=${token}`;
    try{
        fetch_res = await fetch('https://www.google.com/recaptcha/api/siteverify',
        {
            method: 'POST',
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
    }catch(e){
        return NextResponse.json({success: false}, {status: 500});
    }
    const data = await fetch_res.json();
    if(data && data.success && data.score > 0.5){
        return NextResponse.json({
            success: true,
            message: 'successful',
        })
    }
    return NextResponse.json({
        success: false,
        message: 'unsuccessful'
    }, {status: 500});
}