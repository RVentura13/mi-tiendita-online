import { Sequelize } from '@sequelize/core';
import { MsSqlDialect } from '@sequelize/mssql';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize({
	dialect: MsSqlDialect,
	server: process.env.DB_SERVER || 'localhost',
	port: Number(process.env.DB_PORT) || 1433,
	database: process.env.DB_NAME || 'database',
	authentication: {
		type: 'default',
		options: {
			userName: process.env.DB_USER || 'username',
			password: process.env.DB_PASSWORD || 'password',
		},
	},
	encrypt: true, // Usar cifrado SSL
	trustServerCertificate: true, // Aceptar certificado auto-firmado
	logging: false,
});

export default db;
