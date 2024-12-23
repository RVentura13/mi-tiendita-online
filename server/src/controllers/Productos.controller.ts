import { Request, Response } from 'express';
import { badRequestResponse, createdResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';
import { createProductoService, getAllProductosService, getProductoService, updateEstadoProductoService, updateProductoService } from '../services/ProductosServices';

/************************* OBTENER TODOS *************************/

export const getAllProductos = async (req: Request, res: Response): Promise<void> => {
	try {
		// Extraer el role para filtrar datos de la base de datos
		const userRol = req.user?.rol;

		// Se llama al servicio
		const producto = await getAllProductosService(userRol);

		// Se llama a la funcion para la respuesta http
		okResponse(res, producto);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* OBTENER POR ID *************************/

export const getProducto = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const categoriaId = parseInt(id, 10);

		// Se llama al servicio
		const producto = await getProductoService(categoriaId);

		// Se llama funcion de respuesta http
		okResponse(res, producto);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* CREAR *************************/

export const createProducto = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene informacion desde body
		const { categoriasproductos_idcategoria, usuarios_idusuario, estados_idestado, nombre, marca, codigo, stock, precio } = req.body;

		// Obtener la URL del archivo subido
		const foto = req.file ? `/uploads/${req.file.filename}` : null;

		// Se llama al servicio
		const categoria = await createProductoService({
			categoriasproductos_idcategoria,
			usuarios_idusuario,
			estados_idestado,
			nombre,
			marca,
			codigo,
			stock,
			precio,
			foto,
		});

		// Se llama funcion de respuesta http
		createdResponse(res, categoria);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'nombre existe') {
			badRequestResponse(res, 'El nombre ya existe');
		} else if (error instanceof Error && error.message === 'codigo existe') {
			badRequestResponse(res, 'El codigo ya existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR  *************************/

export const updateProducto = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const productoId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { categoriasproductos_idcategoria, usuarios_idusuario, estados_idestado, nombre, marca, codigo, stock, precio } = req.body;

		// Obtener la URL del archivo subido
		const foto = req.file ? `/uploads/${req.file.filename}` : null;

		// Se llama al servicio
		const producto = await updateProductoService(productoId, {
			categoriasproductos_idcategoria,
			usuarios_idusuario,
			estados_idestado,
			nombre,
			marca,
			codigo,
			stock,
			precio,
			foto,
		});

		// Se llama funcion de respuesta http
		okResponse(res, producto);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'nombre existe') {
			badRequestResponse(res, 'El nombre ya existe');
		} else if (error instanceof Error && error.message === 'codigo existe') {
			badRequestResponse(res, 'El codigo ya existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoProducto = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const productoId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado } = req.body;

		// Se llama al servicio
		const producto = await updateEstadoProductoService(productoId, estados_idestado);

		// Se llama funcion de respuesta http
		okResponse(res, producto);
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
