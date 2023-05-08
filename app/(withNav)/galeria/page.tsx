import CTImage from '@/app/components/CTImage'
import HomeStyles from '../../../styles/Home.module.css'
import React from 'react'

type Props = {}

function page({ }: Props) {
    return (
        <div className={HomeStyles.homeContainer}>
            <CTImage />
        </div>
    )
}

export default page