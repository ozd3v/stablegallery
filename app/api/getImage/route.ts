
import { NextResponse, NextRequest } from 'next/server';
import sharp from 'sharp';

export const config = {
    api: {
        responseLimit: false,
        bodyParser: {
            sizeLimit: '100mb',
        }
    },
}
// get all file from direcotry /mtn/shares/sdimages and return as json using nodejs fs module
export async function POST(req: NextRequest) {

    const json = await req.json();
    const ruta = json.path;
    let base64Thumbnail = '';
    try {
        const buffer = await sharp(ruta).toBuffer();
        base64Thumbnail = buffer.toString('base64');
    } catch (error) {

    }


    return NextResponse.json({
        sucess: true,
        data: base64Thumbnail,
    }, { status: 200 });
}

