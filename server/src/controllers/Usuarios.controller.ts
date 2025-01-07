import { Request, Response } from 'express';
import { createUsuarioService, getAllUsuariosService, getUsuarioService, updateEstadoUsuarioService, updateUsuarioService } from '../services/UsuariosServices';
import { badRequestResponse, createdResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';

/************************* OBTENER TODOS *************************/

export const getAllUsuarios = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se llama al servicio
		const usuarios = await getAllUsuariosService();

		// Se llama a la funcion para la respuesta http
		okResponse(res, usuarios);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* OBTENER POR ID *************************/

export const getUsuario = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const usuarioId = parseInt(id, 10);

		// Se llama al servicio
		const usuario = await getUsuarioService(usuarioId);

		// Se llama funcion de respuesta http
		okResponse(res, usuario);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* CREAR *************************/

export const createUsuario = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene la información desde el body de la solicitud
		const { roles_idrol, contrasena, cui, nombre, apellido, fecha_nacimiento, correo_electronico, telefono, direccion, nit } = req.body;

		// Se llama al servicio para crear el usuario
		const usuario = await createUsuarioService({
			roles_idrol,
			contrasena,
			cui,
			nombre,
			apellido,
			fecha_nacimiento,
			correo_electronico,
			telefono,
			direccion,
			nit,
		});

		// Se llama la función de respuesta http para indicar que el recurso fue creado
		createdResponse(res, usuario);
	} catch (error) {
		// Manejo de errores específicos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'persona no existe') {
			badRequestResponse(res, 'No existe la persona a la que se quiere asignar usuario');
		} else if (error instanceof Error && error.message === 'persona existe') {
			badRequestResponse(res, 'La persona ya tiene un usuario');
		} else {
			// Si ocurre un error inesperado, se responde con un error del servidor
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR  *************************/

export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const usuarioId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { roles_idrol, estados_idestado, personas_idpersona, contrasena } = req.body;

		// Se llama al servicio
		const usuario = await updateUsuarioService(usuarioId, {
			roles_idrol,
			estados_idestado,
			personas_idpersona,
			contrasena,
		});

		// Se llama funcion de respuesta http
		okResponse(res, usuario);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'persona no existe') {
			badRequestResponse(res, 'No existe la persona a la que se quiere asignar usuario');
		} else if (error instanceof Error && error.message === 'persona existe') {
			badRequestResponse(res, 'La persona ya tiene un usuario');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoUsuario = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const usuarioId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado } = req.body;

		// Se llama al servicio
		const usuario = await updateEstadoUsuarioService(usuarioId, estados_idestado);

		// Se llama funcion de respuesta http
		createdResponse(res, usuario);
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
