import { Request, Response } from 'express';
import { createRolService, getAllRolesService, getRolService, updateEstadoRolService, updateRolService } from '../services/RolesServices';
import { badRequestResponse, createdResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';

/************************* OBTENER TODOS *************************/

export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se llama al servicio
		const roles = await getAllRolesService();

		// Se llama a la funcion para la respuesta http
		okResponse(res, roles);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* OBTENER POR ID *************************/

export const getRol = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const rolId = parseInt(id, 10);

		// Se llama al servicio
		const rol = await getRolService(rolId);

		// Se llama funcion de respuesta http
		okResponse(res, rol);
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

export const createRol = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene informacion desde body
		const { estados_idestado, nombre, descripcion } = req.body;

		// Se llama al servicio
		const rol = await createRolService({ estados_idestado, nombre, descripcion });

		// Se llama funcion de respuesta http
		createdResponse(res, rol);
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

export const updateRol = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const rolId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado, nombre, descripcion } = req.body;

		// Se llama al servicio
		const rol = await updateRolService(rolId, { estados_idestado, nombre, descripcion });

		// Se llama funcion de respuesta http
		okResponse(res, rol, 'Actualizado correctamente');
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'nombre existe') {
			badRequestResponse(res, 'El rol con este nombre ya existe');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoRol = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const rolId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado } = req.body;

		// Se llama al servicio
		const rol = await updateEstadoRolService(rolId, estados_idestado);

		// Se llama funcion de respuesta http
		okResponse(res, rol, 'Estado actualizado');
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
