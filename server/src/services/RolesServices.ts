import { QueryTypes } from 'sequelize';
import db from '../config/database';

type rolesDataProps = {
	estados_idestado: number;
	nombre: string;
	descripcion: string;
};

/************************* OBTENER TODOS *************************/

export const getAllRolesService = async (): Promise<rolesDataProps[] | string> => {
	try {
		//Hacer la consulta a la base de datos y traer todos los registros
		const roles = (await db.query('SELECT * FROM Roles ORDER BY idrol;', {
			type: QueryTypes.SELECT,
		})) as rolesDataProps[];

		//Se retornan los datos encontrados
		return roles;
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw new Error('Error en el servidor: ' + error);
	}
};

/************************* OBTENER POR ID *************************/

export const getRolService = async (id: number): Promise<rolesDataProps> => {
	try {
		//Hacer la consulta a la base de datos
		const rol = (await db.query('SELECT * FROM Roles WHERE idrol = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as rolesDataProps[];

		//Si id no existe retorna un error
		if (rol.length === 0) {
			throw new Error('id no existe');
		}

		// si encuentra el id retorna la información encontrada
		return rol[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* CREAR *************************/

export const createRolService = async (rolData: rolesDataProps): Promise<rolesDataProps> => {
	try {
		//Se valida que no exista el nombre del rol
		const existeNombreRol = (await db.query('SELECT * FROM Roles WHERE nombre = :nombre;', {
			replacements: { nombre: rolData.nombre },
			type: QueryTypes.SELECT,
		})) as rolesDataProps[];

		//Si el nombre existe se retorna un error
		if (existeNombreRol.length > 0) {
			throw new Error('nombre existe');
		}

		//Llamado al procedimiento almacenado
		const rol = (await db.query('EXEC sp_insertar_rol @idestado = :idestado, @nombre = :nombre, @descripcion = :descripcion;', {
			replacements: {
				idestado: rolData.estados_idestado,
				nombre: rolData.nombre,
				descripcion: rolData.descripcion,
			},
			type: QueryTypes.INSERT,
		})) as rolesDataProps[];

		//Retorna los datos ingresados
		return rol[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR *************************/

export const updateRolService = async (id: number, rolData: rolesDataProps): Promise<rolesDataProps> => {
	try {
		// Se valida que id exista
		const rolId = (await db.query('SELECT * FROM Roles WHERE idrol = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as rolesDataProps[];

		//Si id no existe retorna un error
		if (rolId.length === 0) {
			throw new Error('id no existe');
		}

		// Se valida que no exista el nombre del rol
		const existeNombreRol = (await db.query('SELECT * FROM Roles WHERE nombre = :nombre and idrol <> :id;', {
			replacements: { nombre: rolData.nombre, id },
			type: QueryTypes.SELECT,
		})) as rolesDataProps[];

		// Si el nombre existe se retorna un error
		if (existeNombreRol.length > 0) {
			throw new Error('nombre existe');
		}

		// Llamado al procedimiento almacenado
		const rol = (await db.query('EXEC sp_actualizar_rol @idrol = :id, @idestado = :idestado, @nombre = :nombre, @descripcion = :descripcion;', {
			replacements: {
				id,
				idestado: rolData.estados_idestado,
				nombre: rolData.nombre,
				descripcion: rolData.descripcion,
			},
			type: QueryTypes.UPDATE,
		})) as rolesDataProps[];

		// Retorna datos actualizados
		return rol[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoRolService = async (id: number, idestado: number): Promise<rolesDataProps> => {
	try {
		// Se valida que id exista
		const rolId = (await db.query('SELECT * FROM Roles WHERE idrol = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as rolesDataProps[];

		//Si id no existe retorna un error
		if (rolId.length === 0) {
			throw new Error('id no existe');
		}

		//Hacer la consulta a la base de datos para verificar si estado existe
		const existeEstado = (await db.query('SELECT * FROM Estados WHERE idestado = :idestado', {
			replacements: {
				idestado,
			},
			type: QueryTypes.SELECT,
		})) as rolesDataProps[];

		//Si id no existe retorna un error
		if (existeEstado.length === 0) {
			throw new Error('estado no existe');
		}

		// Llamado al procedimiento almacenado
		const rol = (await db.query('EXEC sp_actualizar_estado_rol @idrol = :id, @idestado = :idestado;', {
			replacements: { id, idestado },
			type: QueryTypes.UPDATE,
		})) as rolesDataProps[];

		// Se retorna datos actualizados
		return rol[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};
