import { Request, Response } from 'express';
import { badRequestResponse, createdResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';
import { createOrdenDetallesService, getAllOrdenesDetallesService, getOrdenDetallesService, updateEstadoOrdenService, updateOrdenDetallesService } from '../services/OrdenDetallesService';

/************************* OBTENER ORDENES CON DETALLES *************************/

export const getAllOrdenesDetalles = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se llama al servicio
		const ordenDetalles = await getAllOrdenesDetallesService();

		// Se llama funcion de respuesta http
		okResponse(res, ordenDetalles);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* OBTENER POR ID *************************/

export const getOrdenDetalles = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const ordenId = parseInt(id, 10);

		// Se llama al servicio
		const ordenDetalles = await getOrdenDetallesService(ordenId);

		// Se llama funcion de respuesta http
		okResponse(res, ordenDetalles);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* CREAR *************************/

export const createOrdenDetalles = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene informacion desde body
		const { usuarios_idusuario, estados_idestado, clientes_idcliente, fecha_envio, fecha_entregada, total_orden, metodo_pago, nota, detalles } = req.body;

		// Se llama al servicio
		const ordenDetalles = await createOrdenDetallesService({
			usuarios_idusuario,
			estados_idestado,
			clientes_idcliente,
			fecha_envio,
			fecha_entregada,
			total_orden,
			metodo_pago,
			nota,
			detalles,
		});

		// Se llama funcion de respuesta http
		createdResponse(res, ordenDetalles);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'cliente no existe') {
			badRequestResponse(res, 'El cliente no existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR  *************************/

export const updateOrdenDetalles = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const ordenId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { usuarios_idusuario, estados_idestado, clientes_idcliente, fecha_envio, fecha_entregada, total_orden, metodo_pago, nota, detalles } = req.body;

		// Se llama al servicio
		const ordenDetalles = await updateOrdenDetallesService(ordenId, {
			usuarios_idusuario,
			estados_idestado,
			clientes_idcliente,
			fecha_envio,
			fecha_entregada,
			total_orden,
			metodo_pago,
			nota,
			detalles,
		});

		// Se llama funcion de respuesta http
		okResponse(res, ordenDetalles);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'cliente no existe') {
			badRequestResponse(res, 'El cliente no existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoOrden = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const ordenId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado } = req.body;

		// Se llama al servicio
		const ordenDetalles = await updateEstadoOrdenService(ordenId, estados_idestado);

		// Se llama funcion de respuesta http
		okResponse(res, ordenDetalles);
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
