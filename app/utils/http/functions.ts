'use server'

export const http_certImageUpload = async (formData: FormData) => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_CERT_IMAGE_UPLOAD, {
            method: 'POST',
            body: formData,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        });
        if (response.ok) {
            return true;
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return false;
}

export const http_logoUpload = async (formData : FormData) => {
    try{
        const res = await fetch(process.env.NEXT_PUBLIC_LOGO_UPLOAD, {
            method: 'POST',
            body: formData,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        })
        if(res.ok) return true
    } catch(error){
        console.error('Error:',error);
    }
    return false;
}

export const http_sendEmail = async (
    cert_name : string, 
    cert_company: string, 
    email: string,
    body: string,
    subject: string,
    ) => {
    
    try{
        const response = await fetch(process.env.NEXT_PUBLIC_EMAIL_LAMBDA_KEY, {
            method: 'POST',
            body: JSON.stringify({
                'email' : email,
                'body' : body,
                'subject': subject
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*' 
              }
        });
        if(response.ok){
            return true;
        }
    } catch (error) {
        console.error('Error:', error);
    }


}