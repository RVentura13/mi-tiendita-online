import { Request, Response } from 'express';
import { createPersonaService, getAllPersonasService, getPersonaService, updateEstadoPersonaService, updatePersonaService } from '../services/PersonasServices';
import { badRequestResponse, createdResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';

/************************* OBTENER TODOS *************************/

export const getAllPersonas = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se llama al servicio
		const personas = await getAllPersonasService();

		// Se llama a la funcion para la respuesta http
		okResponse(res, personas);
	} catch (error) {
		// Manejo de errores especificos
		internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
	}
};

/************************* OBTENER POR ID *************************/

export const getPersona = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const personaId = parseInt(id, 10);

		// Se llama al servicio
		const persona = await getPersonaService(personaId);

		// Se llama funcion de respuesta http
		okResponse(res, persona);
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

export const createPersona = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene informacion desde body
		const { estados_idestado, cui, nombre, apellido, fecha_nacimiento, correo_electronico, telefono, direccion } = req.body;

		// Se llama al servicio
		const persona = await createPersonaService({
			estados_idestado,
			cui,
			nombre,
			apellido,
			fecha_nacimiento,
			correo_electronico,
			telefono,
			direccion,
		});

		// Se llama funcion de respuesta http
		createdResponse(res, persona);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'cui existe') {
			badRequestResponse(res, 'CUI ya registrado');
		} else if (error instanceof Error && error.message === 'correo existe') {
			badRequestResponse(res, 'El correo ya está registrado');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR  *************************/

export const updatePersona = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const personaId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado, cui, nombre, apellido, fecha_nacimiento, correo_electronico, telefono, direccion } = req.body;

		// Se llama al servicio
		const persona = await updatePersonaService(personaId, {
			estados_idestado,
			cui,
			nombre,
			apellido,
			fecha_nacimiento,
			correo_electronico,
			telefono,
			direccion,
		});

		// Se llama funcion de respuesta http
		okResponse(res, persona);
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'id no existe') {
			badRequestResponse(res, 'El id proporcionado no existe');
		} else if (error instanceof Error && error.message === 'cui existe') {
			badRequestResponse(res, 'CUI ya registrado');
		} else if (error instanceof Error && error.message === 'correo existe') {
			badRequestResponse(res, 'El correo ya está registrado');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoPersona = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene id y se convierte a numero
		const { id } = req.params;
		const personaId = parseInt(id, 10);

		// Se obtiene informacion desde body
		const { estados_idestado } = req.body;

		// Se llama al servicio
		const persona = await updateEstadoPersonaService(personaId, estados_idestado);

		// Se llama funcion de respuesta http
		okResponse(res, persona);
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
