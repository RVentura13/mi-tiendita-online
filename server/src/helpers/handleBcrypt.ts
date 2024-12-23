import bcrypt from 'bcrypt';

export const encryptPassword = async (contrasena: string): Promise<string> => {
	// Encriptar la contraseña antes de guardarla
	const saltRounds = 10; // Número de rondas para generar el salt
	const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
	return hashedPassword;
};

export const comparePassword = async (contrasena: string, hash: string): Promise<boolean> => {
	return await bcrypt.compare(contrasena, hash);
};
