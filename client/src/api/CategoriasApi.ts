import { toast } from 'react-toastify';
import { categoriasType } from '../types';
import { getCookie } from '../utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type responseProps = {
	success: string;
	message: string;
	data?: categoriasType[];
};

export const getCategorias = async (useto: string = ''): Promise<categoriasType[]> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		const response = await fetch(`${API_BASE_URL}/categoriasproductos?useto=${useto}`, {
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

export const createCategoria = async (usuarios_idusuario: number, estados_idestado: number, nombre: string): Promise<categoriasType[]> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		const response = await fetch(`${API_BASE_URL}/categoriasproductos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
			body: JSON.stringify({ usuarios_idusuario, estados_idestado, nombre }),
		});

		const responseData: responseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Error al crear registro');
		}
		toast.success('Categoría creada correctamente');
		return responseData.data!;
	} catch (error: any) {
		// Mostrar el mensaje de error con toastify
		toast.error(error.message || 'Error desconocido');
		return [];
	}
};

export const updateCategoria = async (idcategoria: number, usuarios_idusuario: number, estados_idestado: number, nombre: string): Promise<categoriasType[]> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		const response = await fetch(`${API_BASE_URL}/categoriasproductos/${idcategoria}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
			body: JSON.stringify({ usuarios_idusuario, estados_idestado, nombre }),
		});

		const responseData: responseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Error al crear registro');
		}
		toast.success('Categoría actualizada correctamente');
		return responseData.data!;
	} catch (error: any) {
		// Mostrar el mensaje de error con toastify
		toast.error(error.message || 'Error desconocido');
		return [];
	}
};

export const updateEstadoCategorias = async (idcategoria: number, estados_idestado: number) => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');
		const response = await fetch(`${API_BASE_URL}/categoriasproductos/${idcategoria}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},

			body: JSON.stringify({ idcategoria, estados_idestado }),
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
