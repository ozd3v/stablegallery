This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started


Modify the settings file in `app/config/index.ts` to match your needs.
Replace the following field 
```ts
    destinationFolder: '************************',  // folder where the thumbnails will be stored
    baseFolder: '************************', // folder where the images generated by SD are stored like /outputs
    img2imggrid: 'img2img-grids', // image2image grid folder 
    txt2imggrid: 'txt2img-grids', // text2image grid folder
    extrasImages: 'extras-images', // extra images folder
    getAllFiles: 'http://localhost:3000/api/getAllFiles' // change domain to your domain and port if not running on local
    getImage: 'http://localhost:3000/api/getImage', // change domain to your domain and port if not running on local
```

For delete the images from the server you need to add the following line to the `.env.local` file
```ts
    SECRET=REPLACE_YOUR_PASS_HERE
```

so when you delete the images from the gallery you need to add the password to the input field.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
