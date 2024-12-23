import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Creacion de clave secreta
const SECRET_KEY = process.env.JWT_SECRET || 'clavesecreta';

// Generar token
export const generateToken = (payload: object): string => {
	return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};

// Verificar token
export const verifyToken = (token: string): any => {
	return jwt.verify(token, SECRET_KEY);
};
