import { QueryTypes } from 'sequelize';
import db from '../config/database';

type personasDataProps = {
	estados_idestado: number;
	cui: number;
	nombre: string;
	apellido: string;
	fecha_nacimiento: Date;
	correo_electronico: string;
	telefono: number;
	direccion: string;
};

/************************* OBTENER TODOS *************************/

export const getAllPersonasService = async (): Promise<personasDataProps[]> => {
	try {
		//Hacer la consulta a la base de datos y traer todos los registros
		const personas = (await db.query('SELECT * FROM Personas ORDER BY idpersona;', {
			type: QueryTypes.SELECT,
		})) as personasDataProps[];

		//Retorna datos encontrados
		return personas;
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw new Error('Error en el servidor: ' + error);
	}
};

/************************* OBTENER POR ID *************************/

export const getPersonaService = async (id: number): Promise<personasDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const persona = (await db.query('SELECT * FROM Personas WHERE idpersona = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as personasDataProps[];

		//Si id no existe retorna un error
		if (persona.length === 0) {
			throw new Error('id no existe');
		}
		// Retorna datos encontrados
		return persona[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* CREAR *************************/

export const createPersonaService = async (personaData: personasDataProps): Promise<personasDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar si existe el CUI
		const existeCui = (await db.query('SELECT * FROM Personas WHERE cui = :cui;', {
			replacements: { cui: personaData.cui },
			type: QueryTypes.SELECT,
		})) as personasDataProps[];

		//Si CUI existe retorna un error
		if (existeCui.length > 0) {
			throw new Error('cui existe');
		}

		// Hacer la consulta a la base de datos para verificar si el correo existe
		const existeCorreo = (await db.query('SELECT * FROM Personas WHERE correo_electronico = :correo;', {
			replacements: { correo: personaData.correo_electronico },
			type: QueryTypes.SELECT,
		})) as personasDataProps[];

		//Si correo existe retorna un error
		if (existeCorreo.length > 0) {
			throw new Error('correo existe');
		}
		// Llamado al procedimiento almacenado
		const persona = (await db.query(
			'EXEC sp_insertar_persona @idestado = :idestado, @cui = :cui, @nombre = :nombre, @apellido = :apellido, @fecha_nacimiento = :fecha_nacimiento, @correo_electronico = :correo, @telefono = :telefono, @direccion = :direccion;',
			{
				replacements: {
					idestado: personaData.estados_idestado,
					cui: personaData.cui,
					nombre: personaData.nombre,
					apellido: personaData.apellido,
					fecha_nacimiento: personaData.fecha_nacimiento,
					correo: personaData.correo_electronico,
					telefono: personaData.telefono,
					direccion: personaData.direccion,
				},
				type: QueryTypes.INSERT,
			}
		)) as personasDataProps[];

		// Retorna datos ingresados
		return persona[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR *************************/

export const updatePersonaService = async (id: number, personaData: personasDataProps): Promise<personasDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM Personas WHERE idpersona = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as personasDataProps[];

		//Si id no existe retorna un error
		if (existeId.length === 0) {
			throw new Error('id no existe');
		}
		//Hacer la consulta a la base de datos para verificar si existe el CUI
		const existeCui = (await db.query('SELECT * FROM Personas WHERE cui = :cui and idpersona <> :id;', {
			replacements: { cui: personaData.cui, id },
			type: QueryTypes.SELECT,
		})) as personasDataProps[];

		//Si CUI existe retorna un error
		if (existeCui.length > 0) {
			throw new Error('cui existe');
		}
		// Hacer la consulta a la base de datos para verificar si el correo existe
		const existeCorreo = (await db.query('SELECT * FROM Personas WHERE correo_electronico = :correo and idpersona <> :id;', {
			replacements: { correo: personaData.correo_electronico, id },
			type: QueryTypes.SELECT,
		})) as personasDataProps[];

		//Si correo existe retorna un error
		if (existeCorreo.length > 0) {
			throw new Error('correo existe');
		}

		// Llamado al procedimiento almacenado
		const persona = (await db.query(
			'EXEC sp_actualizar_persona @idpersona = :id, @idestado = :idestado, @cui = :cui, @nombre = :nombre, @apellido = :apellido, @fecha_nacimiento = :fecha_nacimiento, @correo_electronico = :correo, @telefono = :telefono, @direccion = :direccion;',
			{
				replacements: {
					id,
					idestado: personaData.estados_idestado,
					cui: personaData.cui,
					nombre: personaData.nombre,
					apellido: personaData.apellido,
					fecha_nacimiento: personaData.fecha_nacimiento,
					correo: personaData.correo_electronico,
					telefono: personaData.telefono,
					direccion: personaData.direccion,
				},
				type: QueryTypes.UPDATE,
			}
		)) as personasDataProps[];

		// Retorna datos actualizados
		return persona[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoPersonaService = async (id: number, idestado: number): Promise<personasDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM Personas WHERE idpersona = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as personasDataProps[];

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
		})) as personasDataProps[];

		//Si id no existe retorna un error
		if (existeEstado.length === 0) {
			throw new Error('estado no existe');
		}

		// Llamada al procedimiento almacenado
		const persona = (await db.query('EXEC sp_actualizar_estado_persona @idpersona = :id, @idestado = :idestado;', {
			replacements: {
				id,
				idestado,
			},
			type: QueryTypes.UPDATE,
		})) as personasDataProps[];

		// Retorna datos actualizados
		return persona[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};
