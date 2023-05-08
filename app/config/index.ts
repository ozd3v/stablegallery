export const settings = {
    //destinationFolder: '/mnt/shares/thumbnails',
    //baseFolder: '/mnt/shares/sdimages/',
    img2imggrid: 'img2img-grids',
    txt2imggrid: 'txt2img-grids',
    extrasImages: 'extras-images',
    //getAllFiles: 'https://ozjedah.hopto.org/api/getAllFiles',
    //getImage: 'https://ozjedah.hopto.org/api/getImage',
    //deleteImage: 'https://ozjedah.hopto.org/api/deleteImage',

}
// http://localhost:3000/api/getAllFiles
// 'C:/Users/zanbato/Desktop/laragon-portable/www/sdv2/stable-diffusion-webui/thumbnails'
// 'C:/Users/zanbato/Desktop/laragon-portable/www/sdv2/stable-diffusion-webui/outputs/'





const securecookie: any = {
    1: false,
    2: true,
    3: true
}


const aboluteEnvUrlPath: any = {
    1: '',
    2: '/next',
    3: '/rtool'
}

const checkDevEnv = () => {
    if (process.env.REACT_APP_DEVENV === undefined || process.env.REACT_APP_DEVENV === null) {
        if (process.env.NEXT_PUBLIC_DEVENV === undefined || process.env.NEXT_PUBLIC_DEVENV === null) {
            return 1
        } else {
            return process.env.NEXT_PUBLIC_DEVENV
        }
    } else {
        return process.env.REACT_APP_DEVENV
    }
}

const DEVENV = checkDevEnv()

export const routes: any = [
    { route: process.env.NEXT_PUBLIC_ENV + '/', label: 'Galeria' },
    { route: process.env.NEXT_PUBLIC_ENV + '/tips', label: 'Tips' },
    /*
    {
        route: '#',
        label: 'Links',
        nested: true,
        children: [
            { route: aboluteEnvUrlPath[DEVENV] + '/protectedssr', label: 'Protected SSR' },
            { route: aboluteEnvUrlPath[DEVENV] + '/protectedCSR', label: 'Protected CSR' },
            { route: aboluteEnvUrlPath[DEVENV] + '/about', label: 'Acerca de...' }

        ]
    },
    */
    //{ route: aboluteEnvUrlPath[DEVENV] + '/socket', label: 'Socket' }
]
/*
export const config = {
    cookiesAttributes: {
        secure: securecookie[DEVENV],
        sameSite: 'None',
        expires: 1 / 24
    },
    absoluteURLPath: aboluteEnvUrlPath[DEVENV],
    redirectUri: envUrls[DEVENV],
    API_URL: apiEnvUrls[DEVENV],
    homeSession: aboluteEnvUrlPath[DEVENV] + '/bootstrap',
    homeNoSession: aboluteEnvUrlPath[DEVENV] + '/login',
    auth: '/auth/pltuser',
    SOCKET_URL: socketurl[DEVENV],
    socketOptions: socketOptions[DEVENV]

}
*/