import { Response } from 'express';

// Respuesta exitosa 200
export const okResponse = (res: Response, data: any, message = 'Transacción exitosa') => {
	return res.status(200).json({ success: true, message, data });
};

// Respuesta 201 (creado)
export const createdResponse = (res: Response, data: any, message = 'Creado exitosamente') => {
	return res.status(201).json({ success: true, message, data });
};

// Respuesta 400 (mala petición)
export const badRequestResponse = (res: Response, message = 'Solicitud inválida') => {
	return res.status(400).json({ success: false, message });
};

// Respuesta 401 (no autorizado)
export const unauthorizedResponse = (res: Response, message = 'No autorizado') => {
	return res.status(401).json({ success: false, message });
};

// Respuesta 403 (prohibido)
export const forbiddenResponse = (res: Response, message = 'Acceso denegado') => {
	return res.status(403).json({ success: false, message });
};
// Respuesta 404 (no encontrado)
export const notFoundResponse = (res: Response, message = 'Datos no encontrados') => {
	return res.status(404).json({ success: false, message });
};

// Respuesta 500 (error interno del servidor)
export const internalServerErrorResponse = (res: Response, message = 'Error interno del servidor') => {
	return res.status(500).json({ success: false, message });
};
