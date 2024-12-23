import express from 'express';
import { body, param } from 'express-validator';

import { createOrdenDetalles, getAllOrdenesDetalles, getOrdenDetalles, updateEstadoOrden, updateOrdenDetalles } from '../controllers/OrdenDetalles.controller';
import { authenticate, checkRoleUsuario } from '../middleware/authMiddleware';
import { rolesPermitidos } from '../config/rolesConfig';
import { validateRequest } from '../middleware/validateRequest';

export const ordenDetallesRoutes = express.Router();

// Se verifica si usuario está autenticado correctamente en toda la ruta
ordenDetallesRoutes.use(authenticate);

// Rutas para el CRUD, se valída parametros y datos con express validator, se verifica el rol para determinar permisos y el controlador

/************************* GET ALL *************************/
ordenDetallesRoutes.get('/', checkRoleUsuario(rolesPermitidos.ordenes.get), getAllOrdenesDetalles);

/************************* GET BY ID *************************/
ordenDetallesRoutes.get(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.ordenes.get),
	getOrdenDetalles
);

/************************* CREATE *************************/
ordenDetallesRoutes.post(
	'/',
	[
		body('usuarios_idusuario')
			.notEmpty()
			.withMessage('El id del usuario es obligatorio')
			.isNumeric()
			.withMessage('El id del usuario debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del usuario debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado es obligatorio')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('clientes_idcliente')
			.notEmpty()
			.withMessage('El id del cliente es obligatorio')
			.isNumeric()
			.withMessage('El id del cliente debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del cliente debe ser un número positivo'),
		body('fecha_envio').optional().isISO8601().withMessage('La fecha de envío debe ser una fecha válida'),
		body('fecha_entregada').optional().isISO8601().withMessage('La fecha de entrega debe ser una fecha válida'),
		body('metodo_pago').notEmpty().withMessage('El método de pago es obligatorio').isNumeric().withMessage('El método de pago debe ser un número'),
		body('nota').optional().isString().withMessage('La nota debe ser una cadena de texto'),

		// Validaciones para la tabla DetallesOrdenes
		body('detalles').isArray({ min: 1 }).withMessage('Debe proporcionar al menos un detalle de la orden'),
		body('detalles.*.productos_idproducto')
			.notEmpty()
			.withMessage('El id del producto es obligatorio')
			.isNumeric()
			.withMessage('El id del producto debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del producto debe ser un número positivo'),
		body('detalles.*.cantidad').notEmpty().withMessage('La cantidad es obligatoria').isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
		body('detalles.*.descuento')
			.optional()
			.isDecimal()
			.withMessage('El descuento debe ser un número decimal válido')
			.custom((value) => value > -1)
			.withMessage('El descuento debe ser un número positivo'),
		body('detalles.*.nota').optional().isString().withMessage('La nota del detalle debe ser una cadena de texto'),
	],
	checkRoleUsuario(rolesPermitidos.ordenes.post),
	validateRequest,
	createOrdenDetalles
);

/************************* UPDATE *************************/
ordenDetallesRoutes.put(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
		body('usuarios_idusuario')
			.notEmpty()
			.withMessage('El id del usuario es obligatorio')
			.isNumeric()
			.withMessage('El id del usuario debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del usuario debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado es obligatorio')
			.isNumeric()
			.withMessage('E id dell estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('clientes_idcliente')
			.notEmpty()
			.withMessage('El id del cliente es obligatorio')
			.isNumeric()
			.withMessage('El id del cliente debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del cliente debe ser un número positivo'),
		body('fecha_envio').optional().isISO8601().withMessage('La fecha de envío debe ser una fecha válida'),
		body('fecha_entregada').optional().isISO8601().withMessage('La fecha de entrega debe ser una fecha válida'),
		body('metodo_pago').notEmpty().withMessage('El método de pago es obligatorio').isNumeric().withMessage('El método de pago debe ser un número'),
		body('nota').optional().isString().withMessage('La nota debe ser una cadena de texto'),

		// Validaciones para la tabla DetallesOrdenes
		body('detalles').isArray({ min: 1 }).withMessage('Debe proporcionar al menos un detalle de la orden'),
		body('detalles.*.productos_idproducto')
			.notEmpty()
			.withMessage('El id del producto es obligatorio')
			.isNumeric()
			.withMessage('El id del producto debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del producto debe ser un número positivo'),
		body('detalles.*.cantidad').notEmpty().withMessage('La cantidad es obligatoria').isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
		body('detalles.*.descuento')
			.optional()
			.isDecimal()
			.withMessage('El descuento debe ser un número decimal válido')
			.custom((value) => value > -1)
			.withMessage('El descuento debe ser un número positivo'),
		body('detalles.*.nota').optional().isString().withMessage('La nota del detalle debe ser una cadena de texto'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.ordenes.put),
	updateOrdenDetalles
);

/************************* UPDATE ESTADO *************************/
ordenDetallesRoutes.patch(
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
	checkRoleUsuario(rolesPermitidos.ordenes.patch),
	updateEstadoOrden
);
