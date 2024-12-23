import { NextFunction, Request, Response } from 'express';
import { unauthorizedResponse } from '../helpers/httpResponses';
import { verifyToken } from '../helpers/jwt.util';

import { getUserRole } from '../services/authQuery';

/************************* VERIFICACION DE AUTENTICACION DE USUARIO *************************/

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const authHeader = req.headers.authorization;

	//Se verifica si viene el token y si es correcto
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		unauthorizedResponse(res, 'Token no proporcionado o no válido');
		return;
	}

	// Quita el Bearer y deja solo el token
	const token = authHeader.split(' ')[1];

	try {
		// Se verifica el token
		const decoded = verifyToken(token) as { correo_electronico: string; rol: number };

		// Si no es correcto o no se puede verificar se envia error
		if (!decoded) {
			unauthorizedResponse(res, 'Token no válido');
			return;
		}

		// Si token pasa validaciones se continua con el siguiente middleware
		next();
	} catch (error) {
		console.error('Error al verificar el token:', error);
		unauthorizedResponse(res, 'Token inválido o caducado');
	}
};

/************************* CONFIRMAR EL ROL DEL USUARIO *************************/

export const checkRoleUsuario =
	(roles: string[]) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const authHeader = req.headers.authorization;

		//Se verifica si viene el token y si es correcto
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			unauthorizedResponse(res, 'Token no proporcionado o no válido');
			return;
		}
		// Quita el Bearer y deja solo el token
		const token = authHeader.split(' ')[1];

		try {
			// Se verifica el token
			const decoded = verifyToken(token) as { correo_electronico: string; rol: string };

			// Si no es correcto o no se puede verificar se envia error
			if (!decoded) {
				unauthorizedResponse(res, 'Token no válido');
				return;
			}

			// Obtener el rol del usuario desde la base de datos
			const userRole = await getUserRole(decoded.correo_electronico);

			// Asegurarse de que `req.user` exista antes de asignar valores
			req.user = req.user || {};
			// Asignar el rol a la variable global
			req.user.rol = userRole;

			// Si el rol del usuario no se incluye en los roles permitidos para la ruta se envia un error
			if (!roles.includes(userRole)) {
				unauthorizedResponse(res, 'Acceso denegado: No tienes permiso para acceder a esta ruta');
				return;
			}

			// Si el rol es permitido se continua
			next();
		} catch (error) {
			unauthorizedResponse(res, 'Error al obtener el rol del usuario');
		}
	};
