//import chokidar from 'chokidar';
const chokidar = require('chokidar');

// Ruta de la carpeta a observar
const folderPath = '/mnt/shares/sdimages/';

// Opciones de la observación
const options = { ignored: /[\/\\]\./, persistent: true, ignoreInitial: true };

// Función para manejar los cambios
const handleChange = (path, event) => {
    console.log(`Se detectó un cambio: ${event} en el archivo ${path}`);
};

// Comenzar la observación
const watcher = chokidar.watch(folderPath, options);
watcher
    .on('add', (path) => handleChange(path, 'añadir'))
    .on('change', (path) => handleChange(path, 'cambiar'))
    .on('unlink', (path) => handleChange(path, 'eliminar'));
