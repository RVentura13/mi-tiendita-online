// Tipado

export type loginTypes = {
	email: string;
	password: string;
};

export type productosTypes = {
	idproducto?: number;
	categoriasproductos_idcategoria: number;
	usuarios_idusuario: number;
	estados_idestado: number;
	nombre: string;
	marca: string;
	codigo: string;
	stock: number;
	precio: number;
	foto?: File;
};

export type CartItem = {
	idproducto: number;
	nombre: string;
	foto: string;
	precio: number;
	stock: number;
	quantity: number;
	estados_idestado: number;
};

export type clienteTypes = {
	idcliente: number;
	personas_idpersona: number;
	estados_idestado: number;
	nombre: string;
	apellido: string;
	correo_electronico: string;
	telefono: number;
	nit: string;
	direccion_entrega: string;
};

export type metodosPagoTypes = {
	idmetodo: number;
	estados_idestado: number;
	nombre: string;
};

export type categoriasType = {
	idcategoria: number;
	usuarios_idusuario: number;
	estados_idestado: number;
	nombre: string;
};

export type ordenType = {
	idorden: number;
	usuarios_idusuario: number;
	clientes_idcliente: number;
	total_orden: number;
	metodo_pago: number;
	nota: string;
	detalles: [];
};

export type detalles = {
	ordenes_idorden: number;
	productos_idproducto: number;
	cantidad: number;
	descuento: number;
	subtotal: number;
	nota: string;
};

type DetalleOrden = {
	idorden: number;
	idproducto: number;
	cantidad: number;
	precio: number;
	descuento: number;
};

export type ordenesDetallesType = {
	clientes_idcliente: number;
	detalles: DetalleOrden[]; // Un array de objetos "DetalleOrden"
	estados_idestado: number;
	fecha_entregada: Date;
	fecha_envio: Date;
	idorden: number;
	metodo_pago: string;
	total_orden: number;
	usuarios_idusuario: number;
};

export type detallesData = {
	idorden?: number; // Opcional
	idproducto?: number; // Opcional
	cantidad: number;
	precio: number;
	descuento?: number;
	subtotal?: number;
	nombre_producto: string;
	foto: string;
	nota?: string; // Opcional
};

export type ordenDetallesData = {
	idorden?: number;
	usuarios_idusuario: number;
	estados_idestado: number;
	nombre_cliente?: string;
	apellido_cliente?: string;
	nombre_forma_pago?: string;
	nombre_estado?: string;
	clientes_idcliente: number;
	fecha_envio?: Date;
	fecha_entregada?: Date;
	total_orden?: number;
	metodo_pago: string;
	nota?: string;
	fecha_creacion?: Date;
	detalles?: detallesData[];
};

export type usuariosType = {
	idusuario?: number;
	roles_idrol: number;
	cui: number;
	nombre: string;
	apellido: string;
	fecha_nacimiento: Date;
	correo_electronico: string;
	telefono: number;
	nit: string;
	direccion: string;
	contrasena: string;
};
