import { Request, Response } from 'express';
import { badRequestResponse, createdResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';
import { createMetodoPagoService, getAllMetodosPagoService, getMetodoPagoService, updateEstadoMetodoPagoService, updateMetodoPagoService } from '../services/MetodosPagoServices';

/************************* OBTENER TODOS *************************/

export const getAllMetodosPago = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se llama al servicio
		const metodo = await getAllMetodosPagoService();

		// Se llama a la funcion para la respuesta http
		okResponse(res, metodo);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* OBTENER POR ID *************************/

export const getMetodoPago = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const metodoId = parseInt(id, 10);

		// Se llama al servicio
		const metodo = await getMetodoPagoService(metodoId);

		// Se llama funcion de respuesta http
		okResponse(res, metodo);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* CREAR *************************/

export const createMetodoPago = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene informacion desde body
		const { estados_idestado, nombre } = req.body;

		// Se llama al servicio
		const metodo = await createMetodoPagoService({
			estados_idestado,
			nombre,
		});

		// Se llama funcion de respuesta http
		createdResponse(res, metodo);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'nombre existe') {
			badRequestResponse(res, 'El nombre ya existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR  *************************/

export const updateMetodoPago = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const metodoId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado, nombre } = req.body;

		// Se llama al servicio
		const metodo = await updateMetodoPagoService(metodoId, {
			estados_idestado,
			nombre,
		});

		// Se llama funcion de respuesta http
		okResponse(res, metodo);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'nombre existe') {
			badRequestResponse(res, 'El nombre ya existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoMetodoPago = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const metodoId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado } = req.body;

		// Se llama al servicio
		const metodo = await updateEstadoMetodoPagoService(metodoId, estados_idestado);

		// Se llama funcion de respuesta http
		okResponse(res, metodo);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'estado no existe') {
			badRequestResponse(res, 'El estado no existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};
