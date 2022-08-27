import fs from "fs";
import Jimp from 'jimp';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

/**
 * Check URL validity
 * Is this a valid URL or not.
 * @param {String} urlStringInput - URL input
 * @returns {Boolean} true or false
 */
export const isUrlValid = (urlStringInput: string) => {
  try { 
    return Boolean(new URL(urlStringInput)); 
  }
  catch(e){ 
    return false; 
  }
}

/**
 * Returns a new promise that is executed after the delay
 * @param {String} data - The data to return in the resolved promise
 * @param {Number} delay - The millseconds delay
 * @returns {Promise<string>} A new promise
 */
export const delayedPromise = (data: string, delay: number) => new Promise<string>((resolve) => {
  setTimeout((res) => resolve(res), delay, data);
});