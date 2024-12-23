import { QueryTypes } from 'sequelize';
import db from '../config/database';

type metodoPagoDataProps = {
	estados_idestado: number;
	nombre: string;
};

/************************* OBTENER TODOS *************************/

export const getAllMetodosPagoService = async (): Promise<metodoPagoDataProps[]> => {
	try {
		//Hacer la consulta a la base de datos y traer todos los registros
		const metodos = (await db.query('SELECT * FROM MetodosPago ORDER BY idmetodo;', {
			type: QueryTypes.SELECT,
		})) as metodoPagoDataProps[];

		//Se retornan los datos encontrados
		return metodos;
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw new Error('Error en el servidor: ' + error);
	}
};

/************************* OBTENER POR ID *************************/

export const getMetodoPagoService = async (id: number): Promise<metodoPagoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const metodo = (await db.query('SELECT * FROM MetodosPago WHERE idmetodo = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as metodoPagoDataProps[];

		//Si id no existe retorna un error
		if (metodo.length === 0) {
			throw new Error('id no existe');
		}

		// Retorna datos encontrados
		return metodo[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* CREAR *************************/

export const createMetodoPagoService = async (metodoPagoData: metodoPagoDataProps): Promise<metodoPagoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar si existe el nombre
		const existeNombre = (await db.query('SELECT * FROM MetodosPago WHERE nombre = :nombre;', {
			replacements: {
				nombre: metodoPagoData.nombre,
			},
			type: QueryTypes.SELECT,
		})) as metodoPagoDataProps[];

		//Si nombre existe retorna un error
		if (existeNombre.length > 0) {
			throw new Error('nombre existe');
		}

		// Llamada al procedimiento almacenado
		const metodo = (await db.query('EXEC sp_insertar_metodo_pago @idestado = :idestado, @nombre = :nombre;', {
			replacements: {
				idestado: metodoPagoData.estados_idestado,
				nombre: metodoPagoData.nombre,
			},
			type: QueryTypes.INSERT,
		})) as metodoPagoDataProps[];

		// Retorna datos ingresados
		return metodo[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR *************************/

export const updateMetodoPagoService = async (id: number, metodoPagoData: metodoPagoDataProps): Promise<metodoPagoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM MetodosPago WHERE idmetodo = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as metodoPagoDataProps[];

		//Si id no existe retorna un error
		if (existeId.length === 0) {
			throw new Error('id no existe');
		}

		//Hacer la consulta a la base de datos para verificar si existe el nombre
		const existeNombre = (await db.query('SELECT * FROM MetodosPago WHERE nombre = :nombre AND idmetodo <> :id;', {
			replacements: {
				nombre: metodoPagoData.nombre,
				id,
			},
			type: QueryTypes.SELECT,
		})) as metodoPagoDataProps[];

		//Si nombre existe retorna un error
		if (existeNombre.length > 0) {
			throw new Error('nombre existe');
		}

		// Llamada al procedimiento almacenado
		const metodo = (await db.query('EXEC sp_actualizar_metodo_pago @idmetodo = :id, @idestado = :idestado, @nombre = :nombre;', {
			replacements: {
				id,
				idestado: metodoPagoData.estados_idestado,
				nombre: metodoPagoData.nombre,
			},
			type: QueryTypes.UPDATE,
		})) as metodoPagoDataProps[];

		// Retorna datos actualizados
		return metodo[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoMetodoPagoService = async (id: number, idestado: number): Promise<metodoPagoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM MetodosPago WHERE idmetodo = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as metodoPagoDataProps[];

		//Si id no existe retorna un error
		if (existeId.length === 0) {
			throw new Error('id no existe');
		}

		//Hacer la consulta a la base de datos para verificar si estado existe
		const existeEstado = (await db.query('SELECT * FROM Estados WHERE idestado = :idestado', {
			replacements: {
				idestado,
			},
			type: QueryTypes.SELECT,
		})) as metodoPagoDataProps[];

		//Si id no existe retorna un error
		if (existeEstado.length === 0) {
			throw new Error('estado no existe');
		}

		// Llamada al procedimiento almacenado
		const metodo = (await db.query('EXEC sp_actualizar_estado_metodo_pago @idmetodo = :id, @idestado = :idestado;', {
			replacements: {
				id,
				idestado,
			},
			type: QueryTypes.UPDATE,
		})) as metodoPagoDataProps[];

		// Retorna datos actualizados
		return metodo[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};
