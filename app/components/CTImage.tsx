'use client'
import Image from 'next/image'
import React from 'react'
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/ImageGrid.module.css'
import { Backdrop } from '@mui/material';
import Spinner from './Spinner';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { settings } from '../config';
import TextField from '@mui/material/TextField';

type Props = {}
type FixmeAny = any
function CTImage({ }: Props) {
    const [imagenes, setImagenes] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [image, setImage]: FixmeAny = React.useState({});
    const [text, setText]: FixmeAny = React.useState("");
    const [imgObj, setImgObj]: FixmeAny = React.useState({} as any);
    const [password, setPassword] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(settings.getAllFiles, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    path: '',
                })
            })
            const json = await result.json()
            if (!json.sucess) {
                console.log('error')
                return;
            }
            //console.log(json.data)
            setImagenes(json.data)
            setLoading(false)
        }
        console.log('fetching')
        fetchData();
    }, []);
    const queryImage = async (image: any) => {
        setLoading(true);
        const result = await fetch(settings.getImage, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: image.folder + image.imagen,
            })

        })
        const json = await result.json()
        if (!json.sucess) {
            console.log('error')
            return;
        }
        //console.log(json.data)
        setLoading(false)
        return json.data
    }
    const showText = async (image: any) => {
        const imagenbase64 = await queryImage(image)
        let objectUrld: any
        if (imagenbase64 !== '') {
            const buffer = Buffer.from(imagenbase64, 'base64');
            const blobie = new Blob([buffer]);
            objectUrld = URL.createObjectURL(blobie);
        } else {
            objectUrld = 'thumnails/test.png'
        }
        setImage(objectUrld)
        setText(image.text)
        setImgObj(image)
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };

    const borrarImagen = async () => {
        setLoading(true);
        const result = await fetch(settings.deleteImage, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imagen: imgObj.folder + imgObj.imagen,
                prompt: imgObj.folder + imgObj.prompt,
                thumb: settings.destinationFolder + '/' + imgObj.imagen,
                password: password

            })

        })
        const json = await result.json()
        if (!json.sucess) {
            console.log('error')
            return;
        }
        console.log(json)
        setLoading(false)
        setOpen(false);
    }
    const realoadimages = async () => {
        setLoading(true)
        const result = await fetch(settings.getAllFiles, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: '',
            })
        })
        const json = await result.json()
        if (!json.sucess) {
            console.log('error')
            return;
        }
        //console.log(json.data)
        setImagenes(json.data)
        setLoading(false)
    }
    return (
        <>
            <Button variant="contained" onClick={realoadimages}>Reload</Button>
            <div className={`${styles.imageGrid}`}>
                {imagenes.map((imagen: FixmeAny) => {
                    const buffer = Buffer.from(imagen.thumbnail, 'base64');
                    const blobie = new Blob([buffer]);
                    const objectUrld = URL.createObjectURL(blobie);
                    return (
                        <Image
                            key={uuidv4()}
                            src={objectUrld}
                            alt={imagen.imagen}
                            width={100}
                            height={100}
                            onClick={() => showText(imagen)}
                        />
                    );
                })}
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <Spinner />
            </Backdrop>
            <Dialog open={open} onClose={handleClose} maxWidth={'md'} fullWidth={true}>
                <DialogTitle>{"Detalles"}</DialogTitle>
                <DialogContent>
                    <p>Nombre: {imgObj.imagen}</p>
                    <p>Folder: {imgObj.folder}</p>
                    { /* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="profile-photo" src={image} alt={"selectedFile.name"} />
                    <br />
                    { // convert \n\r to <br />
                        text.split('\n').map((item: any, key: any) => {
                            return <span key={key}>{item}<br /></span>
                        })

                    }
                    <br />

                </DialogContent>
                <DialogActions>
                    <TextField
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="standard"
                        value={password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <Button onClick={handleClose}>{"Cerrar"}</Button>
                    <Button variant="contained" color="error" onClick={borrarImagen}>{"Borrar"}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CTImage
