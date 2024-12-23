import express from 'express';
import { body, param } from 'express-validator';

import { createCliente, getAllClientes, getCliente, updateCliente, updateEstadoCliente } from '../controllers/Clientes.controller';
import { authenticate, checkRoleUsuario } from '../middleware/authMiddleware';
import { rolesPermitidos } from '../config/rolesConfig';
import { validateRequest } from '../middleware/validateRequest';

export const clienteRoutes = express.Router();

// Se verifica si usuario está autenticado correctamente en toda la ruta
clienteRoutes.use(authenticate);

// Rutas para el CRUD, se valída parametros y datos con express validator, se verifica el rol para determinar permisos y el controlador

/************************* GET ALL *************************/
clienteRoutes.get('/', checkRoleUsuario(rolesPermitidos.clientes.get), getAllClientes);

/************************* GET BY ID *************************/
clienteRoutes.get(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El rol debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.clientes.get),
	getCliente
);

/************************* CREATE *************************/
clienteRoutes.post(
	'/',
	[
		body('personas_idpersona')
			.notEmpty()
			.withMessage('El id de la persona no puede ir vacía')
			.isNumeric()
			.withMessage('El id de la persona debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id de la persona debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('tipo_cliente').notEmpty().withMessage('El tipo de cliente no puede ir vacío').isLength({ max: 20 }).withMessage('El tipo de cliente no debe exceder los 20 caracteres'),
		body('nit').notEmpty().withMessage('El NIT no puede ir vacío').isLength({ max: 10 }).withMessage('El NIT no debe exceder los 10 caracteres'),
		body('razon_social').optional().isLength({ max: 245 }).withMessage('La razón social no debe exceder los 245 caracteres'),
		body('nombre_comercial').optional().isLength({ max: 50 }).withMessage('El nombre comercial no debe exceder los 50 caracteres'),
		body('direccion_entrega').notEmpty().withMessage('La dirección de entrega no puede ir vacía').isLength({ max: 100 }).withMessage('La dirección de entrega no debe exceder los 100 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.clientes.post),
	createCliente
);

/************************* UPDATE *************************/
clienteRoutes.put(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
		body('personas_idpersona')
			.notEmpty()
			.withMessage('El id de la persona no puede ir vacía')
			.isNumeric()
			.withMessage('El id de la persona debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id de la persona debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('tipo_cliente').notEmpty().withMessage('El tipo de cliente no puede ir vacío').isLength({ max: 20 }).withMessage('El tipo de cliente no debe exceder los 20 caracteres'),
		body('nit').notEmpty().withMessage('El NIT no puede ir vacío').isLength({ max: 10 }).withMessage('El NIT no debe exceder los 10 caracteres'),
		body('razon_social').optional().isLength({ max: 255 }).withMessage('La razón social no debe exceder los 255 caracteres'),
		body('nombre_comercial').optional().isLength({ max: 50 }).withMessage('El nombre comercial no debe exceder los 50 caracteres'),
		body('direccion_entrega').notEmpty().withMessage('La dirección de entrega no puede ir vacía').isLength({ max: 100 }).withMessage('La dirección de entrega no debe exceder los 100 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.clientes.put),
	updateCliente
);

/************************* UPDATE ESTADO *************************/
clienteRoutes.patch(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número válido')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.clientes.patch),
	updateEstadoCliente
);
