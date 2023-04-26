
import { readdirSync, readFileSync, existsSync, stat, lstat } from "fs";
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

const putAndCheck: any = async (filePath: string, files: any, file: any) => {
  const split = file.split(".")
  split[split.length - 1] = "txt"
  const prompt = split.join(".")
  const thumbnailExists = fileExists(filePath + prompt) //await sharp(thumbnailPath).metadata();
  files.push({
    file: file,
    folder: filePath,
    hasTxT: thumbnailExists
  });

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
  const files: any = [];
  //console.log(topTolders);
  // for each folder in the array, get the files in the folder and add to the array files

  //topTolders.forEach((topTolder) => {
  for (let i = 0; i < topTolders.length; i++) {
    const topTolder = topTolders[i];
    const dateFolder = readdirSync(`${baseFolder}${topTolder}`);
    //console.log(`${topTolder}  - ${dateFolder}`);
    // dateFolder.forEach((folder) => {
    for (let j = 0; j < dateFolder.length; j++) {
      const folder = dateFolder[j];
      //files.push(folder);
      // for each folder get files 
      const stats = await getLStats(`${baseFolder}${topTolder}/${folder}`);
      //console.log(`Is file: ${stats.isFile()}`);
      if (stats.isFile()) {
        //putAndCheck(`${baseFolder}${topTolder}/`, files, folder)
        continue;
      }
      const filesInFolder = readdirSync(`${baseFolder}${topTolder}/${folder}`);
      //console.log(`--- ${topTolder}  - ${folder} - ${filesInFolder}`);
      //filesInFolder.forEach((file) => {
      for (let k = 0; k < filesInFolder.length; k++) {
        const file = filesInFolder[k];
        files.push({
          file: file,
          folder: `${baseFolder}${topTolder}/${folder}/`,
        });
      };
    };
  };
  const newArray = [];
  //console.log("files", files)

  for (let i = 0; i < files.length; i += 2) {
    const imagen = files[i];
    const prompt = files[i + 1];
    newArray.push({
      imagen: imagen.file,
      prompt: prompt.file,
      folder: imagen.folder,
      ctime: new Date(await getFileStats(`${imagen.folder}${imagen.file}`))
    });
  }


  //console.log(newArray);

  const destinationFolder = process.env.DESTINATIONFOLDER ? process.env.DESTINATIONFOLDER : '';

  //reverse newArray
  //newArray.reverse();
  //console.log(newArray[0]);


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
