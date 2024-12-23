import { Request, Response } from 'express';
import { badRequestResponse, internalServerErrorResponse, okResponse } from '../helpers/httpResponses';
import { loginService } from '../services/LoginServices';

/************************* CONTROLADOR LOGIN *************************/

export const loginController = async (req: Request, res: Response): Promise<void> => {
	try {
		// Se obtiene informacion desde body
		const { correo_electronico, contrasena } = req.body;

		// Se llama al servicio
		const usuario = await loginService(correo_electronico, contrasena);

		// Se llama funcion de respuesta http
		okResponse(res, {
			usuario: { correo_electronico: usuario.correo_electronico, rol: usuario.rol },
			token: usuario.token,
		});
	} catch (error) {
		// Manejo de errores especificos
		if (error instanceof Error && error.message === 'correo no existe') {
			badRequestResponse(res, 'El correo no existe en los registros');
		} else {
			internalServerErrorResponse(res, error instanceof Error ? error.message : 'Error inesperado');
		}
	}
};
