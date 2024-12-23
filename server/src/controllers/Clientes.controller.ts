import { Request, Response } from 'express';
import { createClienteService, getAllClientesService, getClienteService, updateClienteService, updateEstadoClienteService } from '../services/ClientesServices';
import { badRequestResponse, createdResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';

/************************* OBTENER TODOS *************************/

export const getAllClientes = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se llama al servicio
		const clientes = await getAllClientesService();

		// Se llama a la funcion para la respuesta http
		okResponse(res, clientes);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* OBTENER POR ID *************************/

export const getCliente = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const clienteId = parseInt(id, 10);

		// Se llama al servicio
		const cliente = await getClienteService(clienteId);

		// Se llama funcion de respuesta http
		okResponse(res, cliente);
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

export const createCliente = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene informacion desde body
		const { personas_idpersona, estados_idestado, tipo_cliente, nit, razon_social, nombre_comercial, direccion_entrega } = req.body;

		// Se llama al servicio
		const cliente = await createClienteService({
			personas_idpersona,
			estados_idestado,
			tipo_cliente,
			nit,
			razon_social,
			nombre_comercial,
			direccion_entrega,
		});

		// Se llama funcion de respuesta http
		createdResponse(res, cliente);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'nit existe') {
			badRequestResponse(res, 'Nit ya está registrado');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR  *************************/

export const updateCliente = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const clienteId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { personas_idpersona, estados_idestado, tipo_cliente, nit, razon_social, nombre_comercial, direccion_entrega } = req.body;

		// Se llama al servicio
		const cliente = await updateClienteService(clienteId, {
			personas_idpersona,
			estados_idestado,
			tipo_cliente,
			nit,
			razon_social,
			nombre_comercial,
			direccion_entrega,
		});

		// Se llama funcion de respuesta http
		okResponse(res, cliente);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'nit existe') {
			badRequestResponse(res, 'Nit ya está registrado');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoCliente = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const clienteId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado } = req.body;

		// Se llama al servicio
		const cliente = await updateEstadoClienteService(clienteId, estados_idestado);

		// Se llama funcion de respuesta http
		okResponse(res, cliente);
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
