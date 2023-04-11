import { NextResponse, NextRequest } from 'next/server';
import { unlink } from "fs";
export const config = {
    api: {
        responseLimit: false,
        bodyParser: {
            sizeLimit: '100mb',
        }
    },
}

export async function POST(req: NextRequest) {

    const json = await req.json();
    const imagen = json.imagen;
    const prompt = json.prompt;
    const thumb = json.thumb;
    const password = json.password;
    let borrado = false;
    if (process.env.SECRET !== password) {
        return NextResponse.json({
            sucess: false,
            message: 'Password incorrecto',
        }, { status: 200 });
    }

    unlink(imagen, (err) => {
        if (err) {
            console.error('Ocurrió un error al intentar eliminar el archivo:', err);
        } else {
            //console.log('Archivo eliminado con éxito');
            borrado = true;
        }
    });
    unlink(prompt, (err) => {
        if (err) {
            console.error('Ocurrió un error al intentar eliminar el archivo:', err);
        } else {
            //console.log('Archivo eliminado con éxito');
            borrado = true;
        }
    });
    unlink(thumb, (err) => {
        if (err) {
            console.error('Ocurrió un error al intentar eliminar el archivo:', err);
        } else {
            //console.log('Archivo eliminado con éxito');
            borrado = true;
        }
    });

    return NextResponse.json({
        sucess: true,
    }, { status: 200 });
}