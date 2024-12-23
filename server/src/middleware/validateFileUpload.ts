import { Request, Response, NextFunction } from 'express';
import { badRequestResponse } from '../helpers/httpResponses';

export const validateFileUpload = (req: Request, res: Response, next: NextFunction): void => {
	const file = req.file;

	// Verifica si el archivo existe en el body
	if (!file) {
		badRequestResponse(res, 'La foto es obligatoria');
		return;
	}

	// Revisa la extension del archivo
	const allowedMimeTypes = ['image/jpeg', 'image/png'];
	if (!allowedMimeTypes.includes(file.mimetype)) {
		badRequestResponse(res, 'El tipo de archivo no es permitido, debe ser JPEG o PNG');
		return;
	}

	// Revisa el peso del archivo
	if (file.size > 5 * 1024 * 1024) {
		badRequestResponse(res, 'El archivo no debe exceder los 5MB');
		return;
	}

	next();
};
