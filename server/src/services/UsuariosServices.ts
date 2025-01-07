import { QueryTypes } from 'sequelize';
import db from '../config/database';
import { encryptPassword } from '../helpers/handleBcrypt';

type usuarioDataProps = {
	roles_idrol: number;
	estados_idestado: number;
	personas_idpersona: number;
	contrasena: string;
};

type UsuarioDataPropsCreate = {
	roles_idrol: number;
	contrasena: string;
	cui: number;
	nombre: string;
	apellido: string;
	fecha_nacimiento: Date;
	correo_electronico: string;
	telefono: number;
	direccion: string;
	nit: string;
};

/************************* OBTENER TODOS *************************/

export const getAllUsuariosService = async (): Promise<usuarioDataProps[]> => {
	try {
		//Hacer la consulta a la base de datos y traer todos los registros
		const usuarios = (await db.query(
			`select u.idusuario as id, r.nombre as nombre_rol, p.nombre as nombre_persona, p.apellido as apellido_persona, p.correo_electronico, u.estados_idestado from Usuarios u
				inner join Personas p on u.personas_idpersona = p.idpersona
				inner join Roles r on u.roles_idrol = r.idrol;`,
			{
				type: QueryTypes.SELECT,
			}
		)) as usuarioDataProps[];

		//Se retornan los datos encontrados
		return usuarios;
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw new Error('Error en el servidor: ' + error);
	}
};

/************************* OBTENER POR ID *************************/

export const getUsuarioService = async (id: number): Promise<usuarioDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const usuario = (await db.query(
			'select u.idusuario as id, r.nombre as Rol, e.nombre as Estado, p.nombre as Persona from Usuarios u inner join Roles r on u.roles_idrol = r.idrol inner join Estados e on u.estados_idestado = e.idestado inner join Personas p on u.personas_idpersona = p.idpersona WHERE idusuario = :id;',
			{
				replacements: { id },
				type: QueryTypes.SELECT,
			}
		)) as usuarioDataProps[];

		//Si id no existe retorna un error
		if (usuario.length === 0) {
			throw new Error('id no existe');
		}

		// Retorna datos encontrados
		return usuario[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* CREAR *************************/

export const createUsuarioService = async (usuarioData: UsuarioDataPropsCreate): Promise<UsuarioDataPropsCreate> => {
	try {
		// Encriptar la contraseña
		const hashedPassword = await encryptPassword(usuarioData.contrasena);

		// Llamada al procedimiento almacenado
		const usuario = (await db.query(
			`EXEC sp_insertar_usuario_persona_cliente
				@cui = :cui,
				@nombre = :nombre,
				@apellido = :apellido,
				@fecha_nacimiento = :fecha_nacimiento,
				@correo_electronico = :correo_electronico,
				@telefono = :telefono,
				@direccion = :direccion,
				@nit = :nit,
				@roles_idrol = :roles_idrol,
				@contrasena = :contrasena;`,
			{
				replacements: {
					cui: usuarioData.cui,
					nombre: usuarioData.nombre,
					apellido: usuarioData.apellido,
					fecha_nacimiento: usuarioData.fecha_nacimiento,
					correo_electronico: usuarioData.correo_electronico,
					telefono: usuarioData.telefono,
					direccion: usuarioData.direccion,
					nit: usuarioData.nit,
					roles_idrol: usuarioData.roles_idrol,
					contrasena: hashedPassword,
				},
				type: QueryTypes.SELECT,
			}
		)) as UsuarioDataPropsCreate[];

		// Retorna los datos ingresados
		return usuario[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR *************************/

export const updateUsuarioService = async (id: number, usuarioData: usuarioDataProps): Promise<usuarioDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM Usuarios WHERE idusuario = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as usuarioDataProps[];

		//Si id no existe retorna un error
		if (existeId.length === 0) {
			throw new Error('id no existe');
		}

		//Hacer la consulta a la base de datos para verificar si existe la persona
		const existePersona = (await db.query('SELECT * FROM Personas WHERE idpersona = :idpersona;', {
			replacements: { idpersona: usuarioData.personas_idpersona },
			type: QueryTypes.SELECT,
		})) as usuarioDataProps[];

		//Si persona no existe retorna un error
		if (existePersona.length === 0) {
			throw new Error('persona no existe');
		}

		//Hacer la consulta a la base de datos para verificar si existe la persona en usuarios para evitar mas de un usuario
		const existePersonaenUsuarios = (await db.query('SELECT * FROM Usuarios WHERE personas_idpersona = :idpersona and idusuario <> :id;', {
			replacements: { idpersona: usuarioData.personas_idpersona, id },
			type: QueryTypes.SELECT,
		})) as usuarioDataProps[];

		//Si persona no existe retorna un error
		if (existePersonaenUsuarios.length > 0) {
			throw new Error('persona existe');
		}

		//Encriptar la contraseña
		const hashedPassword = await encryptPassword(usuarioData.contrasena);

		// Llamada al procedimiento almacenado
		const usuario = (await db.query('EXEC sp_actualizar_usuario @idusuario = :id, @idrol = :idrol, @idestado = :idestado, @idpersona = :idpersona, @contrasena = :contrasena;', {
			replacements: {
				id,
				idrol: usuarioData.roles_idrol,
				idestado: usuarioData.estados_idestado,
				idpersona: usuarioData.personas_idpersona,
				contrasena: hashedPassword,
			},
			type: QueryTypes.UPDATE,
		})) as usuarioDataProps[];

		// Retorna datos actualizados
		return usuario[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoUsuarioService = async (id: number, idestado: number): Promise<usuarioDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar si existe el usuario
		const existeUsuario = (await db.query('SELECT * FROM Usuarios WHERE idusuario = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as usuarioDataProps[];

		//Si id no existe retorna un error
		if (existeUsuario.length === 0) {
			throw new Error('id no existe');
		}

		//Hacer la consulta a la base de datos para verificar si estado existe
		const existeEstado = (await db.query('SELECT * FROM Estados WHERE idestado = :idestado', {
			replacements: {
				idestado,
			},
			type: QueryTypes.SELECT,
		})) as usuarioDataProps[];

		//Si id no existe retorna un error
		if (existeEstado.length === 0) {
			throw new Error('estado no existe');
		}

		// Llamada al procedimiento almacenado
		const usuario = (await db.query('EXEC sp_actualizar_estado_usuario @idusuario = :id, @idestado = :idestado;', {
			replacements: {
				id,
				idestado,
			},
			type: QueryTypes.UPDATE,
		})) as usuarioDataProps[];

		// Retorna datos actualizados
		return usuario[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};
