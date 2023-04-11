
import { readdirSync, readFileSync, existsSync } from "fs";
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { settings } from '../../config';

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '100mb',
    }
  },
}
// get all file from direcotry /mtn/shares/sdimages and return as json using nodejs fs module
export async function GET(req: NextRequest) {
  const topTolders = readdirSync(settings.baseFolder);
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
  const files: any = [];
  // for each folder in the array, get the files in the folder and add to the array files
  topTolders.forEach((topTolder) => {
    const dateFolder = readdirSync(`${settings.baseFolder}${topTolder}`);
    dateFolder.forEach((folder) => {
      //files.push(folder);
      // for each folder get files 
      const filesInFolder = readdirSync(`${settings.baseFolder}${topTolder}/${folder}`);
      filesInFolder.forEach((file) => {
        files.push({
          file: file,
          folder: `${settings.baseFolder}${topTolder}/${folder}/`,
        });
      });
    });
  });

  const newArray = [];

  for (let i = 0; i < files.length; i += 2) {
    const imagen = files[i];
    const prompt = files[i + 1];
    newArray.push({
      imagen: imagen.file,
      prompt: prompt.file,
      folder: imagen.folder,
    });
  }

  //console.log(newArray);

  const destinationFolder = settings.destinationFolder;



  for (let i = 0; i < newArray.length; i++) {
    const item: any = newArray[i];
    const imagePath = path.join(item.folder, item.imagen);
    const thumbnailPath = path.join(destinationFolder, item.imagen);
    //load .txt file data from item.folder and item.prompt with nodejs fs module
    const prompt = readFileSync(path.join(item.folder, item.prompt), 'utf8');
    try {
      //check if file  exists with nodejs fs module
      const thumbnailExists = fileExists(thumbnailPath) //await sharp(thumbnailPath).metadata();
      if (thumbnailExists) {
        const thumbnailBuffer = await sharp(thumbnailPath).toBuffer();
        const base64Thumbnail = thumbnailBuffer.toString('base64');
        item['thumbnail'] = base64Thumbnail;
        item['text'] = prompt;
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
    } catch (error) {
      console.log(error);
    }
  }

  return NextResponse.json({
    sucess: true,
    data: newArray,
  }, { status: 200 });
}

const setDataFile = async (data: any) => {
  return new Promise(async (resolve, reject) => {

  });
}

function fileExists(filePath: any) {
  return existsSync(filePath);
}