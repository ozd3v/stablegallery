'use client'
import Image from 'next/image'
import React from 'react'
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/ImageGrid.module.css'
import DialogStyles from '../../styles/DialogStyles.module.css';
import { Backdrop } from '@mui/material';
import Spinner from './Spinner';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { settings } from '../config';
import TextField from '@mui/material/TextField';
import TextDisplay from './TextDisplay';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {}
type FixmeAny = any
function CTImage({ }: Props) {
    const [imagenes, setImagenes]: FixmeAny = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [image, setImage]: FixmeAny = React.useState({});
    const [text, setText]: FixmeAny = React.useState("");
    const [imgObj, setImgObj]: FixmeAny = React.useState({} as any);
    const [password, setPassword] = React.useState('');
    const [itemsPerPage, setItemsPerPage] = React.useState(50);
    const [hasMore, setHasMore] = React.useState(true);
    const fetchData = async (start = 0) => {
        console.log('fetching', start)
        const apiGetAllFiles = process.env.NEXT_PUBLIC_GETALLFILES ? process.env.NEXT_PUBLIC_GETALLFILES : ''
        if (apiGetAllFiles === '') {
            console.log('error apiGetAllFiles')
            return;
        }
        const result = await fetch(apiGetAllFiles, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: '',
                start: start,
                limit: itemsPerPage,
            })
        })
        const json = await result.json()
        if (!json.sucess) {
            console.log('error')
            setLoading(false);
            return;
        }
        //console.log(json.data)
        //setImagenes(json.data)
        // Verifica si es la primera página (start = 0)
        if (start === 0) {
            // Establece las imágenes en el nuevo conjunto de datos
            setImagenes(json.data);
        } else {
            // Agrega las imágenes al conjunto de datos existente
            setImagenes([...imagenes, ...json.data]);
        }
        // Establece el estado "hasMore" según el valor devuelto por la API
        setHasMore(json.hasMore);
        setLoading(false)
        console.log('fetching done', json.hasMore)
    }
    React.useEffect(() => {
        fetchData(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const queryImage = async (image: any) => {
        setLoading(true);
        const apiGetImage = process.env.NEXT_PUBLIC_GETIMAGE ? process.env.NEXT_PUBLIC_GETIMAGE : ''
        if (apiGetImage === '') {
            console.log('error getImage')
            return;
        }
        const result = await fetch(apiGetImage, {
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
            setLoading(false);
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
        const apiDelete: string = process.env.NEXT_PUBLIC_DELETEIMAGE ? process.env.NEXT_PUBLIC_DELETEIMAGE : ''
        const destinationFolder = process.env.NEXT_PUBLIC_DESTINATIONFOLDER ? process.env.NEXT_PUBLIC_DESTINATIONFOLDER : '';
        if (apiDelete === '' || destinationFolder === '') {
            console.log('error apiDelete')
            setLoading(false);
            return;
        }
        //console.log("a borrar", imgObj.folder + imgObj.thumbnailPath)

        const result = await fetch(apiDelete, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imagen: imgObj.folder + imgObj.imagen,
                prompt: imgObj.folder + imgObj.prompt,
                thumb: imgObj.thumbnailPath,
                password: password

            })

        })
        const json = await result.json()
        if (!json.sucess) {
            console.log('error')
            setLoading(false);
            return;
        }
        console.log(json)
        setLoading(false)
        setOpen(false);
    }
    const realoadimages = async () => {
        setLoading(true)
        await fetchData(0);
        /*
        setLoading(true)
        const apiGetAllFiles = process.env.NEXT_PUBLIC_GETALLFILES ? process.env.NEXT_PUBLIC_GETALLFILES : ''
        if (apiGetAllFiles === '') {
            console.log('error apiGetAllFiles')
            return;
        }

        const result = await fetch(apiGetAllFiles, {
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
            setLoading(false);
            return;
        }
        //console.log(json.data)
        setImagenes(json.data)
        setLoading(false)
        */
    }
    return (
        <>
            <Button variant="contained" onClick={realoadimages}>Reload</Button>
            <InfiniteScroll
                dataLength={imagenes.length}
                next={() => fetchData(imagenes.length)}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >
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

            </InfiniteScroll>

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
            <Dialog open={open} onClose={handleClose} maxWidth={'md'}
                fullWidth={true}
                PaperProps={{
                    className: DialogStyles.dialogContainer
                }}

            >
                <DialogTitle className={DialogStyles.dialogTitle} >{"Detalles"}
                </DialogTitle>
                <DialogContent >
                    <p>Nombre: {imgObj.imagen}</p>
                    <p>Folder: {imgObj.folder}</p>

                    <div className={DialogStyles.imageContainer}>
                        { /* eslint-disable-next-line @next/next/no-img-element */}
                        <img className={`${DialogStyles.image} profile-photo`} src={image} alt={"selectedFile.name"} />
                    </div>
                    <TextDisplay rawText={text} />


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
                        InputLabelProps={{
                            className: DialogStyles.passwordInput,
                        }}
                        InputProps={{
                            className: DialogStyles.passwordInput,
                        }}
                    />
                    <Button onClick={handleClose}
                        className={DialogStyles.closeButton}
                    >{"Cerrar"}</Button>
                    <Button variant="contained" color="error"
                        className={DialogStyles.deleteButton}
                        onClick={borrarImagen}>{"Borrar"}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CTImage
