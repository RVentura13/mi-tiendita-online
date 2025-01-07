/************************* Configuracion de permisos de los roles para las rutas *************************/

export const rolesPermitidos = {
	estados: {
		get: ['Administrador', 'Operador', 'Cliente'],
		post: ['Administrador'],
		put: ['Administrador'],
	},
	roles: {
		get: ['Administrador', 'Operador', 'Cliente'],
		post: ['Administrador'],
		put: ['Administrador'],
		patch: ['Administrador'],
	},
	personas: {
		get: ['Administrador', 'Operador', 'Cliente'],
		post: ['Administrador', 'Operador'],
		put: ['Administrador', 'Operador'],
		patch: ['Administrador', 'Operador'],
	},
	clientes: {
		get: ['Administrador', 'Operador', 'Cliente'],
		post: ['Administrador', 'Operador'],
		put: ['Administrador', 'Operador'],
		patch: ['Administrador', 'Operador'],
	},
	usuarios: {
		get: ['Administrador', 'Operador', 'Cliente'],
		post: ['Administrador', 'Operador'],
		put: ['Administrador', 'Operador'],
		patch: ['Administrador', 'Operador'],
	},
	categoriasProductos: {
		get: ['Administrador', 'Operador', 'Cliente'],
		post: ['Administrador', 'Operador'],
		put: ['Administrador', 'Operador'],
		patch: ['Administrador', 'Operador'],
	},
	productos: {
		get: ['Administrador', 'Operador', 'Cliente'],
		post: ['Administrador'],
		put: ['Administrador', 'Operador'],
		patch: ['Administrador', 'Operador'],
	},
	metodosPago: {
		get: ['Administrador', 'Operador', 'Cliente'],
		post: ['Administrador'],
		put: ['Administrador'],
		patch: ['Administrador'],
	},
	ordenes: {
		get: ['Administrador', 'Operador', 'Cliente'],
		post: ['Administrador', 'Operador', 'Cliente'],
		put: ['Administrador', 'Operador', 'Cliente'],
		patch: ['Administrador', 'Operador', 'Cliente'],
	},
};
