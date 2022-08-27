import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, isUrlValid } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  const validRequestFormat = 'try GET /filteredimage?image_url=URL_TO_IMAGE_HERE';


  app.get('/filteredimage', async ( req: Request, res: Response ) => {

    const queryParamKeys: string[] = Object.keys(req.query);
    if (!req.query || queryParamKeys.length === 0 || !queryParamKeys.includes('image_url')) {
      // request query param does not include image_url
      res.status(400).send(`Image url not provided. Please include image_url. e.g. ${validRequestFormat}`);
      return;
    }

    const imageUrl = String(req.query.image_url);

    if (!isUrlValid(imageUrl)) {
      // request query param image_url does not contain a valid URL. 
      res.status(400).send('The provided Image url is not valid');
      return;
    }

    try {
      const firePath: string = await filterImageFromURL(imageUrl);

      res.sendFile(firePath, async () => {
        // clear file after request
        await deleteLocalFiles([firePath]);
      });
    } catch (error) {
      res.status(400).send(`Image could not be processed. ${error.toString()}`); 
    }

  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( '/', async ( req: Request, res: Response ) => {
    res.send(validRequestFormat);
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();