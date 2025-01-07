import { Request, Response } from 'express';
import {
	createCategoriaProductoService,
	getAllCategoriasProductosService,
	getCategoriaProductoService,
	updateCategoriaProductoService,
	updateEstadoCategoriaProductoService,
} from '../services/CategoriasProductosServices';
import { badRequestResponse, createdResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';

/************************* OBTENER TODOS *************************/

export const getAllCategoriasProductos = async (req: Request, res: Response): Promise<void> => {
	try {
		// Obtén el parámetro `useTo` de la query string
		const useto = req.query.useto as string | undefined;
		// Se llama al servicio
		const categoria = await getAllCategoriasProductosService(useto);

		// Se llama a la funcion para la respuesta http
		okResponse(res, categoria);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* OBTENER POR ID *************************/

export const getCategoriaProducto = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const categoriaId = parseInt(id, 10);

		// Se llama al servicio
		const categoria = await getCategoriaProductoService(categoriaId);

		// Se llama funcion de respuesta http
		okResponse(res, categoria);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* CREAR *************************/

export const createCategoriaProducto = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene informacion desde body
		const { usuarios_idusuario, estados_idestado, nombre } = req.body;

		// Se llama al servicio
		const categoria = await createCategoriaProductoService({
			usuarios_idusuario,
			estados_idestado,
			nombre,
		});

		// Se llama funcion de respuesta http
		createdResponse(res, categoria);
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

export const updateCategoriaProducto = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const categoriaId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { usuarios_idusuario, estados_idestado, nombre } = req.body;

		// Se llama al servicio
		const categoria = await updateCategoriaProductoService(categoriaId, {
			usuarios_idusuario,
			estados_idestado,
			nombre,
		});

		// Se llama funcion de respuesta http
		okResponse(res, categoria);
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

export const updateEstadoCategoriaProducto = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const categoriaId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado } = req.body;

		// Se llama al servicio
		const categoria = await updateEstadoCategoriaProductoService(categoriaId, estados_idestado);

		// Se llama funcion de respuesta http
		okResponse(res, categoria);
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
