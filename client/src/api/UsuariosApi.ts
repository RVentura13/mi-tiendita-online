import { toast } from 'react-toastify';
import { usuariosType } from '../types';
import { getCookie } from '../utils/cookies';

// URL base de los endpoin
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type responseProps = {
	success: string;
	message: string;
	data?: usuariosType[];
};

type createResponseProps = {
	success: string;
	message: string;
	data?: usuariosType;
};

// Obtener todos los datos
export const getUsuarios = async (): Promise<usuariosType[]> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		const response = await fetch(`${API_BASE_URL}/usuarios`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
		});

		const responseData: responseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Credenciales inválidas');
		}

		return responseData.data!;
	} catch (error: any) {
		// Mostrar el mensaje de error con toastify
		toast.error(error.message || 'Error desconocido');
		return [];
	}
};

export const createUsuario = async (
	roles_idrol: number,
	cui: number,
	nombre: string,
	apellido: string,
	fecha_nacimiento: Date,
	correo_electronico: string,
	telefono: number,
	direccion: string,
	nit: string,
	contrasena: string
): Promise<usuariosType | null> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		const response = await fetch(`${API_BASE_URL}/usuarios`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
			body: JSON.stringify({
				roles_idrol,
				contrasena,
				cui,
				nombre,
				apellido,
				fecha_nacimiento,
				correo_electronico,
				telefono,
				direccion,
				nit,
			}),
		});

		const responseData: createResponseProps = await response.json();

		console.log(responseData);

		if (!response.ok) {
			throw new Error(responseData.message || 'Error al crear el registro');
		}

		toast.success('Usuario creado correctamente');
		return responseData.data!;
	} catch (error: any) {
		toast.error(error.message || 'Error desconocido');
		return null;
	}
};

export const updateUsuario = async (
	idusuario: number,
	roles_idrol: number,
	cui: number,
	nombre: string,
	apellido: string,
	fecha_nacimiento: Date,
	correo_electronico: string,
	telefono: number,
	direccion: string,
	nit: string,
	contrasena: string
): Promise<usuariosType | null> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		const response = await fetch(`${API_BASE_URL}/usuarios/${idusuario}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
			body: JSON.stringify({
				roles_idrol,
				contrasena,
				cui,
				nombre,
				apellido,
				fecha_nacimiento,
				correo_electronico,
				telefono,
				direccion,
				nit,
			}),
		});

		const responseData: createResponseProps = await response.json();

		console.log(responseData);

		if (!response.ok) {
			throw new Error(responseData.message || 'Error al crear el registro');
		}

		toast.success('Usuario creado correctamente');
		return responseData.data!;
	} catch (error: any) {
		toast.error(error.message || 'Error desconocido');
		return null;
	}
};

export const updateEstadoUsuario = async (idusuario: number, estados_idestado: number) => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');
		const response = await fetch(`${API_BASE_URL}/usuarios/${idusuario}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},

			body: JSON.stringify({ idusuario, estados_idestado }),
		});

		const responseData: responseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Error en los datos');
		}

		toast.success('Actualizado exitosamente');
		return responseData.data!;
	} catch (error: any) {
		// Mostrar el mensaje de error con toastify
		toast.error(error.message || 'Error desconocido');
		return null;
	}
};
