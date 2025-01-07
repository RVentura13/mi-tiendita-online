import React, { createContext, useContext, useEffect, useState } from 'react';

// Crear un contexto
export const AuthContext = createContext<any>(null);

// Helper para manejar userInfo en localStorage
const getUserInfoFromLocalStorage = () => {
	try {
		const storedUserInfo = localStorage.getItem('userInfo');
		return storedUserInfo ? JSON.parse(storedUserInfo) : {};
	} catch (error) {
		console.error('Error al parsear userInfo desde localStorage:', error);
		return {};
	}
};

const updateUserInfoInLocalStorage = (updatedInfo: Partial<Record<string, any>>) => {
	try {
		const currentInfo = getUserInfoFromLocalStorage();
		const newInfo = { ...currentInfo, ...updatedInfo };
		localStorage.setItem('userInfo', JSON.stringify(newInfo));
	} catch (error) {
		console.error('Error al guardar userInfo en localStorage:', error);
	}
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const userInfo = getUserInfoFromLocalStorage();

	const [role, setRole] = useState<string | null>(userInfo.role || null);
	const [email, setEmail] = useState<string | null>(userInfo.email || null);
	const [idusuario, setIdusuario] = useState<number | null>(userInfo.idusuario || null);
	const [idpersona, setIdpersona] = useState<number | null>(userInfo.idpersona || null);

	// Sincronizar cambios con localStorage
	useEffect(() => {
		updateUserInfoInLocalStorage({ role, email, idusuario, idpersona });
	}, [role, email, idusuario, idpersona]);

	return (
		<AuthContext.Provider
			value={{
				role,
				email,
				idusuario,
				idpersona,
				setRole,
				setEmail,
				setIdusuario,
				setIdpersona,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Hook para usar el contexto
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe ser usado dentro de un AuthProvider');
	}
	return context;
};
