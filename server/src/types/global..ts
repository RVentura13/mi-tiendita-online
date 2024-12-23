/**********  Propiedad extendida del objeto Request de Express **********/

// Se utilizará para guardar el rol de manera global

declare global {
	namespace Express {
		interface Request {
			user: {
				correo_electronico: string;
				rol: string;
			};
		}
	}
}
