
import { readdirSync, readFileSync, existsSync, stat, lstat, writeFileSync } from "fs";
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { settings } from '../../config';
import mime from 'mime';

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '100mb',
    }
  },
}

const getLStats: any = async (filePath: string) => {
  return new Promise(async (resolve, reject) => {
    lstat(filePath, function (err, stats) {
      //Checking for errors
      if (err) {
        //console.log(err)
        reject(err);
      }
      else {
        //Logging the stats Object
        resolve(stats);
      }
    })
  });
}

const getFileStats: any = async (filePath: string) => {
  return new Promise(async (resolve, reject) => {
    stat(filePath, function (err, stats) {
      //Checking for errors
      if (err) {
        //console.log(err)
        reject(err);
      }
      else {
        //Logging the stats Object
        resolve(stats.ctime);
      }
    })
  });
}

const putAndCheck: any = async (filePath: string, files: any) => {

  const mimeType = mime.getType(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, path.extname(filePath));
  const directoryPath = path.dirname(filePath)
  // Verificar si el tipo MIME es de una imagen
  if (mimeType && mimeType.startsWith('image/')) {
    //console.log(`es imagen ${filePath}`)
    const existePrompt = existsSync(`${directoryPath}/${fileName}.txt`);

    if (!existePrompt) {
      const data = 'NO PROMPT\nNegative prompt: NO NEGATIVE\nSteps: 20, Sampler: DPM++ SDE Karras, CFG scale: 7, Seed: 665764519, Face restoration: CodeFormer, Size: 512x512, Model hash: da5224a242, Model: aZovyaRPGArtistTools_v2, Clip skip: 2\n';
      writeFileSync(`${directoryPath}/${fileName}.txt`, data);
    }
    //console.log(`${directoryPath}/${fileName}`);
    files.push({
      file: fileName + extension,
      folder: `${directoryPath}/`,
    });
  }

}

// Función para obtener los archivos de imagen en una carpeta
async function getImagesInFolder(folderPath: any, fileList: any, excludedFolders: any = []) {
  const items = readdirSync(folderPath);
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    if (!excludedFolders.includes(itemPath)) {
      const stats = await getLStats(`${itemPath}`);
      if (stats.isFile()) {
        putAndCheck(`${itemPath}`, fileList);
      } else if (stats.isDirectory()) {
        await getImagesInFolder(itemPath, fileList, excludedFolders);
      }
    }
  }
}
// get all file from direcotry /mtn/shares/sdimages and return as json using nodejs fs module
export async function POST(req: NextRequest) {

  const json = await req.json();
  const start: any = json.start || 0;
  const limit: any = json.limit || 50;

  const baseFolder: string = process.env.BASEFOLDER ? process.env.BASEFOLDER : '';
  const topTolders = readdirSync(baseFolder);

  // exclude folder 'img2img-grids' from topTolders array
  let index = topTolders.indexOf(settings.img2imggrid);
  if (index > -1) {
    topTolders.splice(index, 1);
  }
  index = topTolders.indexOf(settings.txt2imggrid);
  if (index > -1) {
    topTolders.splice(index, 1);
  }
  index = topTolders.indexOf(settings.extrasImages);
  if (index > -1) {
    topTolders.splice(index, 1);
  }
  //const files: any = [];
  const recurFiles: any = [];

  const excludedFolders = [`${baseFolder}${settings.img2imggrid}`, `${baseFolder}${settings.txt2imggrid}`, `${baseFolder}${settings.extrasImages}`];
  await getImagesInFolder(`${baseFolder}`, recurFiles, excludedFolders);
  //console.log(recurFiles);
  //console.log(topTolders);
  // for each folder in the array, get the files in the folder and add to the array files

  //topTolders.forEach((topTolder) => {
  /*
for (let i = 0; i < topTolders.length; i++) {
  const topTolder = topTolders[i];
  const stats = await getLStats(`${baseFolder}${topTolder}`);

  if (stats.isFile()) {
    putAndCheck(`${baseFolder}${topTolder}`, files);
    continue;
  }
  const dateFolder = readdirSync(`${baseFolder}${topTolder}`);
  for (let j = 0; j < dateFolder.length; j++) {
    const folder = dateFolder[j];
    const stats = await getLStats(`${baseFolder}${topTolder}/${folder}`);

    if (stats.isFile()) {
      putAndCheck(`${baseFolder}${topTolder}/${folder}`, files);
      continue;
    }
    const filesInFolder = readdirSync(`${baseFolder}${topTolder}/${folder}`);
    for (let k = 0; k < filesInFolder.length; k++) {
      const file = filesInFolder[k];
      await putAndCheck(`${baseFolder}${topTolder}/${folder}/${file}`, files);
    };
  };
};
*/
  const newArray = [];


  for (let i = 0; i < recurFiles.length; i++) {
    const imagen = recurFiles[i];
    const fileName = path.basename(imagen.folder + imagen.file, path.extname(imagen.folder + imagen.file));
    newArray.push({
      imagen: imagen.file,
      prompt: fileName + ".txt",
      folder: imagen.folder,
      ctime: new Date(await getFileStats(`${imagen.folder}${imagen.file}`))
    });
  }

  const destinationFolder = process.env.DESTINATIONFOLDER ? process.env.DESTINATIONFOLDER : '';


  for (let i = 0; i < newArray.length; i++) {
    const item: any = newArray[i];
    const imagePath = path.join(item.folder, item.imagen);
    const thumbnailPath = path.join(destinationFolder, item.ctime.getTime() + "-" + item.imagen);
    //console.log(thumbnailPath);
    //load .txt file data from item.folder and item.prompt with nodejs fs module
    const prompt = readFileSync(path.join(item.folder, item.prompt), 'utf8');
    try {
      //check if file  exists with nodejs fs module
      const thumbnailExists = fileExists(thumbnailPath) //await sharp(thumbnailPath).metadata();
      if (thumbnailExists) {
        const thumbnailBuffer = await sharp(thumbnailPath).toBuffer();
        const base64Thumbnail = thumbnailBuffer.toString('base64');
        item['thumbnail'] = base64Thumbnail;
        item['thumbnailPath'] = thumbnailPath;
        item['text'] = prompt;
        //item['ctime'] = new Date(await getFileStats(`${item.folder}${item.imagen}`))
        //console.log('thumbnail exists');
        continue;
      }

      await sharp(imagePath)
        .resize({ width: 100 }) // Set the width of the thumbnail; height will be adjusted automatically to maintain aspect ratio
        .toFile(thumbnailPath);
      // Next, get the base64-encoded thumbnail data
      const thumbnailBuffer = await sharp(imagePath)
        .resize({ width: 100 })
        .toBuffer();

      const base64Thumbnail = thumbnailBuffer.toString('base64');
      item['thumbnail'] = base64Thumbnail;
      item['text'] = prompt;
      item['thumbnailPath'] = thumbnailPath;
      //item['ctime'] = new Date(await getFileStats(`${item.folder}${item.imagen}`));
    } catch (error) {
      console.log(error);
    }
  }
  //console.log(newArray[1]);
  return NextResponse.json({
    sucess: true,
    //data: newArray.sort((a: any, b: any) => b.ctime - a.ctime)
    data: newArray.sort((a: any, b: any) => b.ctime - a.ctime).slice(start, start + limit),
    hasMore: newArray.length > start + limit,
  }, { status: 200 });
}

const setDataFile = async (data: any) => {
  return new Promise(async (resolve, reject) => {

  });
}

function fileExists(filePath: any) {
  return existsSync(filePath);
}
