import { QueryTypes } from 'sequelize';
import db from '../config/database';

type usuarioDataProps = {
	rol: string;
};

/************************* CONSULTA PARA OBTENER Y VERIFICAR ROL DE USUARIO PARA PERMISOS DE RUTA *************************/

export const getUserRole = async (correoElectronico: string): Promise<string> => {
	try {
		// Consulta a la base de datos para verificar si usuario existe
		const result = (await db.query(
			` SELECT r.nombre as rol
                FROM Usuarios u
                INNER JOIN Personas p ON u.personas_idpersona = p.idpersona
                INNER JOIN Roles r ON u.roles_idrol = r.idrol
                WHERE p.correo_electronico = :correo;`,
			{
				replacements: { correo: correoElectronico },
				type: QueryTypes.SELECT,
			}
		)) as usuarioDataProps[];

		// Si no se encuentra el usuario devolver string vacio
		if (result.length === 0) {
			return '';
		}

		// Retorna el rol del usuario
		return result[0].rol;
	} catch (error) {
		// Captura y envio de errores
		console.error('Error al obtener el rol del usuario:', error);
		throw new Error('Error al obtener el rol del usuario');
	}
};
