import { QueryTypes } from 'sequelize';
import db from '../config/database';
import { comparePassword, encryptPassword } from '../helpers/handleBcrypt';
import { generateToken } from '../helpers/jwt.util';

type userDataProps = {
	idusuario: number;
	personas_idpersona: number;
	nombre: string;
	correo_electronico: string;
	contrasena: string;
	roles_idrol: number;
	rol: string;
};

type LoginServiceResponse = {
	correo_electronico: string;
	rol: string;
	idusuario: number;
	personas_idpersona: number;
	token: string;
};

/************************* VERIFICAR USUARIO Y VALIDAR CONTRASEÑA PARA LOGIN *************************/

export const loginService = async (correo_electronico: string, contrasenaTextPlain: string): Promise<LoginServiceResponse> => {
	try {
		// Consulta para verificar si existe usuario, por el correo
		const usuario = (await db.query(
			`SELECT p.correo_electronico, r.nombre as rol, u.contrasena, u.idusuario, u.personas_idpersona
			FROM Usuarios u
			INNER JOIN Personas p ON u.personas_idpersona = p.idpersona
			INNER JOIN Roles r ON u.roles_idrol = r.idrol
			WHERE p.correo_electronico = :correo AND p.estados_idestado = 1;`,
			{
				replacements: {
					correo: correo_electronico,
				},
				type: QueryTypes.SELECT,
			}
		)) as userDataProps[];

		// Si el usuario no existe se envia un error
		if (usuario.length === 0) {
			throw new Error('correo no existe');
		}

		const user = usuario[0];

		// Si la contraseña no está hasheada
		if (user.contrasena === contrasenaTextPlain) {
			// Hashear la contraseña y actualizar en la base de datos
			const hashedPassword = await encryptPassword(contrasenaTextPlain);
			await db.query(`UPDATE Usuarios SET contrasena = :hashedPassword WHERE idusuario = :idusuario`, {
				replacements: {
					hashedPassword,
					idusuario: user.idusuario,
				},
				type: QueryTypes.UPDATE,
			});
		} else {
			// Se compara la contraseña
			const checkPassword = await comparePassword(contrasenaTextPlain, user.contrasena);

			// Si contraseña es incorrecta se envia error
			if (!checkPassword) {
				throw new Error('contrasena incorrecta');
			}
		}

		//Generar el token para autenticación
		const token = generateToken({
			correo_electronico: user.correo_electronico,
			rol: user.rol,
		});

		// Retorna datos de usuario y el token
		return { ...user, token };
	} catch (error) {
		// Manejo de errores especificos
		console.error('Error en el servidor', error);
		throw error;
	}
};
