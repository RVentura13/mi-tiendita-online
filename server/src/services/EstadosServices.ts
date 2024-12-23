import { QueryTypes } from 'sequelize';
import db from '../config/database';

type estadosDataProps = {
	nombre: string;
};

/************************* OBTENER TODOS *************************/

export const getAllEstadosService = async (): Promise<estadosDataProps[]> => {
	try {
		//Hacer la consulta a la base de datos y traer todos los registros
		const estados = (await db.query('SELECT * FROM Estados ORDER BY idestado;', {
			type: QueryTypes.SELECT,
		})) as estadosDataProps[];

		//Se encontraron datos se retornan
		return estados;
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw new Error('Error en el servidor: ' + error);
	}
};

/************************* OBTENER POR ID *************************/

export const getEstadoService = async (id: number): Promise<estadosDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const estado = (await db.query('SELECT * FROM Estados WHERE idestado = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as estadosDataProps[];

		//Si id no existe retorna un error
		if (estado.length === 0) {
			throw new Error('id no existe');
		}

		// Retorna la información encontrada
		return estado[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* CREAR *************************/

export const createEstadoService = async (estadoData: estadosDataProps): Promise<estadosDataProps> => {
	try {
		//Hacer la consulta a la base de datos
		const existeNombreEstado = (await db.query('SELECT * FROM Estados WHERE nombre = :nombre;', {
			replacements: { nombre: estadoData.nombre },
			type: QueryTypes.SELECT,
		})) as estadosDataProps[];

		//Si nombre existe retorna un error
		if (existeNombreEstado.length > 0) {
			throw new Error('nombre existe');
		}

		// Llamado al procedimiento almacenado
		const estado = (await db.query('EXEC sp_insertar_estado @nombre = :nombre;', {
			replacements: { nombre: estadoData.nombre },
			type: QueryTypes.INSERT,
		})) as estadosDataProps[];

		// Retorna datos ingresados
		return estado[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR *************************/

export const updateEstadoService = async (id: number, estadoData: estadosDataProps): Promise<estadosDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const estadoId = (await db.query('SELECT * FROM Estados WHERE idestado = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as estadosDataProps[];

		//Si id no existe retorna un error
		if (estadoId.length === 0) {
			throw new Error('id no existe');
		}

		//Hacer la consulta a la base de datos para verificar si existe nombre
		const existeNombreEstado = (await db.query('SELECT * FROM Estados WHERE nombre = :nombre and idestado <> :id;', {
			replacements: { nombre: estadoData.nombre, id },
			type: QueryTypes.SELECT,
		})) as estadosDataProps[];

		//Si nombre existe retorna un error
		if (existeNombreEstado.length > 0) {
			throw new Error('nombre existe');
		}
		// Llamado al procedimiento almacenado
		const estado = (await db.query('EXEC sp_actualizar_nombre_estado @idestado = :id, @nombre = :nombre;', {
			replacements: { id, nombre: estadoData.nombre },
			type: QueryTypes.UPDATE,
		})) as estadosDataProps[];

		// Retorna datos actualizados
		return estado[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};
