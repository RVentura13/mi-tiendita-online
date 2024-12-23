import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
	// Obtener los errores de validación
	const errors: ValidationError[] = validationResult(req).array();

	// Si hay errores, devolver respuesta con error 400 y los errores
	if (errors.length > 0) {
		res.status(400).json({ error: errors });
		return;
	}

	// Si no hay errores, continuar con el siguiente middleware o controlador
	next();
};
