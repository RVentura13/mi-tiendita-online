import express from 'express';
import { loginController } from '../controllers/Login.controller';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

export const loginRoutes = express.Router();

loginRoutes.post(
	'/',
	[
		body('correo_electronico').notEmpty().withMessage('El correo electrónico no puede ir vacío').isEmail().withMessage('El correo electrónico debe tener un formato válido'),
		body('contrasena').notEmpty().withMessage('La contraseña no puede ir vacía'),
	],
	validateRequest,
	loginController
);
