import React from 'react';

import styles from './TipsPage.module.css';
import HomeStyles from '../../../styles/Home.module.css'

const modelsData = [
    {
        id: 1,
        title: 'Modelo 1',
        imageUrl: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/31c51994-311e-4486-a1e5-f3c001e7c000/width=2304/00010-3222574139.jpeg',
        tips: 'Tip 1: Asegúrate de que el modelo esté bien entrenado antes de usarlo.',
    },
    {
        id: 2,
        title: 'Modelo 2',
        imageUrl: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/31c51994-311e-4486-a1e5-f3c001e7c000/width=2304/00010-3222574139.jpeg',
        tips: 'Tip 2: Utiliza una GPU para mejorar la velocidad de generación de imágenes.',
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
                        <h2 className={styles.modelTitle}>{model.title}</h2>
                        <img className={styles.modelImage} src={model.imageUrl} alt={`${model.title} ejemplo`} />
                        <img className={styles.modelImage} src={model.imageUrl} alt={`${model.title} ejemplo`} />
                        <p className={styles.modelTips}>{model.tips}</p>
                    </div>
                ))}
            </div>
            <div className={styles.modelCard}>
                <div className="card-body">
                    This is some text within a card body.
                </div>
            </div>
        </div>
    );
}

export default TipsPage;

