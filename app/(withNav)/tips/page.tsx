/* eslint-disable @next/next/no-img-element */
import React from 'react';

import styles from './TipsPage.module.css';
import HomeStyles from '../../../styles/Home.module.css'
import Link from 'next/link'
import charTurner1 from '../../../public/chartv1.jpeg'
import charTurner2 from '../../../public/chartv2.jpeg'
import kneeling from '../../../public/kneeling.jpeg'
import mascara from '../../../public/mascara.jpeg'
import animevae from '../../../public/animevae.png'
import protogen221 from '../../../public/protogen22-1.jpeg';
import protogen222 from '../../../public/protogen22-2.jpeg';
import misstoon from '../../../public/misstoon.jpeg';
import verybad from '../../../public/veryBadImageNegative.jpeg';
import comivvi from '../../../public/comivvi.jpeg';
import comivvi2 from '../../../public/comivvi2.jpeg';
import anyhentai from '../../../public/anyhentai.jpeg';

const modelsData = [
    {
        id: 1,
        title: 'CharTurner - Character Turnaround helper for 1.5 AND 2.1!',
        link: 'https://civitai.com/models/3036?modelVersionId=8387',
        //'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/31c51994-311e-4486-a1e5-f3c001e7c000/width=2304/00010-3222574139.jpeg',
        imageUrl: [
            charTurner1.src,
            charTurner2.src,
        ],
        tips: 'funciona mejor con controlnet, pero a veces se marea' +
            ' https://www.reddit.com/r/StableDiffusion/comments/1180fls/comment/j9ff39h/?utm_source=reddit&utm_medium=web2x&context=3'
    },
    {
        id: 2,
        link: 'https://civitai.com/user/aDDont/models',
        title: 'DD Loras',
        imageUrl: [
            mascara.src,
            kneeling.src
        ],
        tips: 'lora {DD} Runny makeup mascara tears {DD} True kneeling' +
            '<lora:DDTrueKneeling_v1:1>, DDtrueKneeling_side, from side, kneeling ' +
            '<lora:DDRunnyMakeupMascara_v01:1> ',
    },
    {
        id: 3,
        title: 'kl-f8-anime2-vae',
        link: 'https://civitai.com/models/23906/kl-f8-anime2-vae',
        imageUrl: [
            animevae.src,
        ],
        tips: 'VAE mejora colores de anime ',
    },
    {
        id: 4,
        title: 'Protogen v2.2 (Anime) Official Release',
        link: 'https://civitai.com/models/3627/protogen-v22-official-release',
        imageUrl: [
            protogen221.src,
            protogen222.src,
        ],
        tips: 'modelo tips (from_above:1.3), (from_below:1.3),(from_side:1.3),(from_behind:1.3),',
    },
    {
        id: 5,
        title: 'Mistoon_Anime',
        link: 'https://civitai.com/models/24149/mistoonanime',
        imageUrl: [
            misstoon.src,
        ],
        tips: 'Mistoon_Anime is my blend of SD models that tries to achieve a more "cartoony" anime style with thick borders and brighter colors.',
    },
    {
        id: 6,
        title: 'veryBadImageNegative',
        link: 'https://civitai.com/models/11772/verybadimagenegative',
        imageUrl: [
            verybad.src,
        ],
        tips: 'veryBadImageNegative_v1.3 uses a new training atlas and performs well when used in AOM3 and viewer-mix_v1.7.' +
            ' Textual Inversion  (embbeding)',
    },
    {
        id: 7,
        title: 'Comics_Vision',
        link: 'https://civitai.com/models/54073/comicsvision',
        imageUrl: [
            comivvi.src,
            comivvi2.src,
        ],
        tips: '640 x 768 recomendado' +
            ' (inked original-art:1.2), (lineart:1.33),1woman,space-viking society, blonde braid strong manly woman barbarian,wrinkles,(depth),(movement:1.4),cinematic-composition,snob smirk,(hyperdefined),intricate-setting,undercut,yellow white orange,winter futuristic-city-streets,(thin-lines),viking-sci-fi aesthetic,neon-lighting,stars,giant-robots-machines,(fine-details:1.3),RAW-format,emotional,(muted-colors)',
    },
    {
        id: 8,
        title: 'AnyHentai',
        link: 'https://civitai.com/models/5706/anyhentai',
        imageUrl: [
            anyhentai.src,
        ],
        tips: 'for sampling methods, use Euler a (best), DDIM (second best), or DPM++ DM Karras',

    },
    // Añade más modelos y sus datos aquí
];

function TipsPage() {
    return (
        <div className={HomeStyles.homeContainer}>
            <h1 className={styles.pageTitle}>Tips de Modelos</h1>
            <div className={styles.modelsGrid}>
                {modelsData.map((model) => (
                    <div key={model.id} className={styles.modelCard}>
                        <Link key={model.id + 'lnk'} href={model.link + ''}>
                            <h2 key={model.id + 'h2'} className={styles.modelTitle}>{model.title}</h2>
                        </Link>
                        {
                            model.imageUrl.map((url) => (
                                <img key={url} className={styles.modelImage} src={url} alt={`${model.title} ejemplo`} />
                            ))
                        }
                        <p key={model.id + 'p'} className={styles.modelTips}>{model.tips}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TipsPage;

