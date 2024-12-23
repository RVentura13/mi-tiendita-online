import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ruta donde se guardarán los archivos
const uploadDir = path.join(__dirname, '../uploads');

// Verificar si la carpeta existe, si no, crearla
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
	// Carpeta donde se guardarán los archivos
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},

	// Nombrar archivos
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const fileExtension = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
	},
});

// Filtro de archivos por extension
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	const allowedMimeTypes = ['image/jpeg', 'image/png'];
	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Tipo de archivo no permitido'));
	}
};

// Configuración de multer
export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5, // Peso maximo del archivo, 5 MB
	},
});
