import { Request, Response } from 'express';
import { createEstadoService, getAllEstadosService, getEstadoService, updateEstadoService } from '../services/EstadosServices';
import { badRequestResponse, createdResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';

/************************* OBTENER TODOS *************************/

export const getAllEstados = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se llama al servicio
		const estados = await getAllEstadosService();

		// Se llama a la funcion para la respuesta http
		okResponse(res, estados);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* OBTENER POR ID *************************/

export const getEstado = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const estadoId = parseInt(id, 10);

		// Se llama al servicio
		const estado = await getEstadoService(estadoId);

		// Se llama funcion de respuesta http
		okResponse(res, estado);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* CREAR *************************/

export const createEstado = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene informacion desde body
		const { nombre } = req.body;

		// Se llama al servicio
		const estado = await createEstadoService({ nombre });

		// Se llama funcion de respuesta http
		createdResponse(res, estado);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'nombre existe') {
			badRequestResponse(res, 'El nombre ya existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR *************************/

export const updateEstado = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const estadoId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { nombre } = req.body;

		// Se llama al servicio
		const estado = await updateEstadoService(estadoId, { nombre });

		// Se llama funcion de respuesta http
		okResponse(res, estado, 'Actualizado correctamente');
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'nombre existe') {
			badRequestResponse(res, 'El estado con este nombre ya existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};
