

--create database GDA00361OT_RonyVentura;


--use GDA00361OT_RonyVentura;



/************************* CREACION DE TABLAS *************************/

create table Estados(
idestado int identity,
nombre varchar(50) unique not null,
constraint PK_estados primary key (idestado)
);

create table Roles(
idrol int identity,
estados_idestado int not null,
nombre varchar(50) unique not null,
descripcion varchar(100) not null,
constraint PK_roles primary key (idrol),
constraint FK_roles_estados foreign key (estados_idestado) references Estados(idestado)
);

create table Personas(
idpersona int identity,
estados_idestado int not null,
cui bigint unique not null,
nombre varchar(30) not null,
apellido varchar(30) not null,
fecha_nacimiento date not null,
correo_electronico varchar(50) unique not null,
telefono numeric(8,0) not null,
direccion varchar(100) not null,
fecha_creacion datetime default getdate(),
constraint PK_personas primary key (idpersona),
constraint FK_personas_estados foreign key (estados_idestado) references Estados(idestado)
);

create table Clientes(
idcliente int identity,
personas_idpersona int not null,
estados_idestado int not null,
tipo_cliente varchar(20) not null,
nit varchar(10) unique not null,
razon_social varchar(255),
nombre_comercial varchar(50),
direccion_entrega varchar(100) not null,
fecha_creacion datetime default getdate(),
constraint PK_clientes primary key (idcliente),
constraint FK_clientes_personas foreign key (personas_idpersona) references Personas(idpersona),
constraint FK_clientes_estados foreign key (estados_idestado) references Estados(idestado),
);

create table Usuarios(
idusuario int identity,
roles_idrol int not null,
estados_idestado int not null,
personas_idpersona int not null,
contrasena varchar(255) not null,
fecha_creacion datetime default getdate(),
constraint PK_usuarios primary key (idusuario),
constraint FK_usuarios_roles foreign key (roles_idrol) references Roles(idrol),
constraint FK_usuarios_estados foreign key (estados_idestado) references Estados(idestado),
constraint FK_usuarios_personas foreign key (personas_idpersona) references Personas(idpersona)
);

create table CategoriasProductos(
idcategoria int identity,
usuarios_idusuario int not null,
estados_idestado int not null,
nombre varchar(50) not null,
fecha_creacion datetime default getdate(),
constraint PK_categoriasproductos_categorias primary key (idcategoria),
constraint FK_categoriasproductos_usuarios foreign key (usuarios_idusuario) references Usuarios(idusuario),
constraint FK_categoriasproductos_estados foreign key (estados_idestado) references Estados(idestado)
);

create table Productos(
idproducto int identity,
categoriasproductos_idcategoria int not null,
usuarios_idusuario int not null,
estados_idestado int not null,
nombre varchar(50) unique not null,
marca varchar(50) not null,
codigo varchar(50) unique not null,
stock int not null,
precio decimal(5,2) not null,
foto varchar(250),
fecha_creacion datetime default getdate(),
constraint PK_productos primary key (idproducto),
constraint FK_productos_categoriasproductos foreign key (categoriasproductos_idcategoria) references CategoriasProductos(idcategoria),
constraint FK_productos_usuarios foreign key (usuarios_idusuario) references Usuarios(idusuario),
constraint FK_productos_estados foreign key (estados_idestado) references Estados(idestado)
);

create table MetodosPago(
idmetodo int identity,
estados_idestado int not null,
nombre varchar(30) not null,
);

create table Ordenes(
idorden int identity,
usuarios_idusuario int not null,
estados_idestado int not null,
clientes_idcliente int not null,
fecha_envio date,
fecha_entregada date,
total_orden decimal(5,2),
metodo_pago int not null,
nota varchar(200),
fecha_creacion datetime default getdate(),
constraint PK_orden primary key (idorden),
constraint FK_ordenes_usuarios foreign key (usuarios_idusuario) references Usuarios(idusuario),
constraint FK_ordenes_estados foreign key (estados_idestado) references Estados(idestado),
constraint FK_clientes_ordenes foreign key (clientes_idcliente) references Clientes(idcliente)
);

create table DetallesOrdenes(
iddetalle int identity,
ordenes_idorden int not null,
productos_idproducto int not null,
cantidad int not null,
descuento decimal(5,2),
subtotal decimal(5,2) not null,
nota varchar(200),
fecha_creacion datetime default getdate(),
constraint PK_detallesordenes primary key (iddetalle),
constraint FK_detallesordenes_ordenes foreign key (ordenes_idorden) references Ordenes(idorden),
constraint FK_detallesordenes_productos foreign key (productos_idproducto) references Productos(idproducto)
);



/******************** INSERCION DE DATOS PARA EJEMPLO Y PRUEBAS ********************/

-- Insertar datos en la tabla Estados
INSERT INTO Estados (nombre) VALUES
('Activo'),
('Inactivo'),
('Pendiente'),
('Autorizado'),
('Entregado');

-- Insertar datos en la tabla Roles
INSERT INTO Roles (estados_idestado, nombre, descripcion) VALUES
(1, 'Administrador', 'Gestiona el sistema'),
(1, 'Operador', 'Permiso para crear catalogos y aprobar despacho de ordenes'),
(1, 'Cliente', 'Permisos limitado a ver catalogos y realizar pedidos');

-- Insertar datos en la tabla Personas
INSERT INTO Personas (estados_idestado, cui, nombre, apellido, fecha_nacimiento, correo_electronico, telefono, direccion) VALUES
(1, 1234567890123, 'Juan', 'Perez', '1990-05-15', 'usuario1@correo.com', 55512345, 'Calle Principal 123'),
(1, 2345678901234, 'Maria', 'Lopez', '1985-03-22', 'maria.lopez@gmail.com', 55567890, 'Avenida Secundaria 456'),
(1, 3456789012345, 'Carlos', 'Garcia', '2000-07-30', 'carlos.garcia@gmail.com', 55511223, 'Boulevard Central 789'),
(1, 4567890123456, 'Ana', 'Martinez', '1995-06-10', 'ana.martinez@gmail.com', 55533445, 'Calle Ficticia 101'),
(1, 5678901234567, 'Pedro', 'Ramirez', '1988-11-20', 'pedro.ramirez@gmail.com', 55599887, 'Avenida Imaginaria 202'),
(1, 6789012345678, 'Lucia', 'Fernandez', '1993-08-15', 'lucia.fernandez@gmail.com', 55566778, 'Boulevard Inventado 303'),
(1, 7890123456789, 'Jorge', 'Torres', '1999-12-01', 'jorge.torres@gmail.com', 55577654, 'Calle Nueva 404'),
(1, 8901234567890, 'Laura', 'Hernandez', '1987-04-25', 'laura.hernandez@gmail.com', 55555432, 'Avenida Antigua 505'),
(1, 9012345678901, 'Sofia', 'Gutierrez', '1996-02-18', 'sofia.gutierrez@gmail.com', 55588765, 'Calle Moderna 606'),
(1, 1345678901234, 'Ricardo', 'Lopez', '1992-09-30', 'ricardo.lopez@gmail.com', 55522334, 'Boulevard Real 707'),
(1, 2456789012345, 'Carlos', 'Mendoza', '1990-02-14', 'carlos.mendoza@gmail.com', 55555678, 'Calle Principal 123'),
(1, 3567890123456, 'Sofia', 'López', '1985-09-30', 'sofia.lopez@gmail.com', 55555789, 'Avenida Central 101'),
(1, 4678901234567, 'Pedro', 'Gomez', '1992-07-05', 'pedro.gomez@gmail.com', 55555890, 'Calle de los Pinos 202'),
(1, 5789012345678, 'Ana', 'Ruiz', '1995-12-15', 'ana.ruiz@gmail.com', 55555901, 'Avenida del Sol 303'),
(1, 6890123456789, 'Miguel', 'Torres', '1983-11-20', 'miguel.torres@gmail.com', 55555012, 'Calle de la Luna 404');

-- Insertar datos en la tabla Clientes
INSERT INTO Clientes (personas_idpersona, estados_idestado, tipo_cliente, nit, razon_social, nombre_comercial, direccion_entrega) VALUES
(1, 1, 'Persona', '1234567890', NULL, NULL, 'Entrega 1'),
(2, 1, 'Empresa', '9876543210', 'TechCorp S.A.', 'TechCorp', 'Entrega 2'),
(3, 1, 'Persona', '3344556677', NULL, NULL, 'Entrega 3'),
(4, 1, 'Empresa', '1122734455', 'Industrias Lopez', 'LopezInd', 'Entrega 4'),
(5, 1, 'Persona', '5566778899', NULL, NULL, 'Entrega 5'),
(6, 1, 'Empresa', '6677889900', 'Comercial Ramirez', 'RamirezCom', 'Entrega 6'),
(7, 1, 'Persona', '7788990011', NULL, NULL, 'Entrega 7'),
(8, 1, 'Empresa', '8899001122', 'Fernandez Global', 'FGLOBAL', 'Entrega 8'),
(9, 1, 'Persona', '9900112233', NULL, NULL, 'Entrega 9'),
(10, 1, 'Empresa', '0011223344', 'Torres y Asociados', 'TYA', 'Entrega 10'),
(11, 1, 'Persona', '1122334455', NULL, NULL, 'Entrega 11'),
(12, 1, 'Empresa', '2233445566', 'Hernandez Supplies', 'HSUP', 'Entrega 12'),
(13, 1, 'Persona', '3348556677', NULL, NULL, 'Entrega 13'),
(14, 1, 'Empresa', '4455667788', 'Gutierrez Solutions', 'GSOL', 'Entrega 14'),
(15, 1, 'Persona', '5596778899', NULL, NULL, 'Entrega 15');

-- Insertar datos en la tabla Usuarios
INSERT INTO Usuarios (roles_idrol, estados_idestado, personas_idpersona, contrasena) VALUES
(1, 1, 1, 'password123'),
(2, 1, 2, 'password456'),
(3, 1, 3, 'password789'),
(3, 1, 4, 'password012'),
(3, 1, 5, 'password345'),
(3, 1, 6, 'password678'),
(3, 1, 7, 'password901'),
(3, 1, 8, 'password234'),
(3, 1, 9, 'password567'),
(3, 1, 10, 'password890'),
(3, 1, 11, 'password321'),
(3, 1, 12, 'password654'),
(3, 1, 13, 'password987'),
(3, 1, 14, 'password000'),
(3, 1, 15, 'password111');

-- Insertar datos en la tabla CategoriasProductos
INSERT INTO CategoriasProductos (usuarios_idusuario, estados_idestado, nombre) VALUES
(1, 1, 'Alimentos y Bebidas'),
(1, 1, 'Higiene Personal'),
(1, 1, 'Limpieza'),
(1, 1, 'Papel y Plástico'),
(1, 1, 'Otros');

-- Insertar datos en la tabla Productos
INSERT INTO Productos (categoriasproductos_idcategoria, usuarios_idusuario, estados_idestado, nombre, marca, codigo, stock, precio, foto) VALUES
(1, 1, 1, 'Pan', 'Bimbo', 'PAN001', 100, 1.50, 'pan.jpg'),
(1, 1, 1, 'Leche', 'Lala', 'LEC002', 0, 1.00, 'leche.jpg'),
(1, 2, 1, 'Cereal', 'Kellogs', 'CER003', 150, 2.50, 'cereal.jpg'),
(2, 1, 2, 'Jabón', 'Dove', 'JAB004', 300, 1.20, 'jabon.jpg'),
(2, 1, 1, 'Champú', 'Pantene', 'CHA005', 150, 3.50, 'shampoo.jpg'),
(3, 2, 1, 'Detergente', 'Ariel', 'DET006', 250, 4.00, 'detergente.jpg'),
(3, 1, 2, 'Limpiador', 'Fabuloso', 'LIM007', 100, 2.00, 'limpiador.jpg'),
(4, 2, 1, 'Papel Higiénico', 'Scott', 'PAP008', 500, 0.80, 'papel.jpg'),
(4, 1, 1, 'Bolsas de Basura', 'Hefty', 'BOL009', 0, 1.50, 'bolsas.jpg'),
(5, 1, 1, 'Encendedor', 'Bic', 'ENC010', 50, 0.50, 'encendedor.jpg');

-- Insertar datos en la tabla MetodosPago
INSERT INTO MetodosPago (estados_idestado, nombre) VALUES
(1, 'Efectivo'),
(1, 'Tarjeta de Debito'),
(1, 'Tarjeta de Credito'),
(1, 'Cupon');



/******************** STORED PROCEDURES ********************/

-- cada stored procedure lleva algunas validaciones para tener un poco mas de seguridad a la hora de la manipulacion de datos

/******************** STORED PROCEDURE ESTADOS ********************/

GO
-- INSERTAR --
create procedure sp_insertar_estado
	@nombre varchar(50)
as
begin
	begin transaction;
	
	-- verificar si el nombre ya existe
	if exists (select 1 from Estados where nombre = @nombre)
	begin
		rollback transaction;
		print 'Error: El nombre ya existe en otros registros';
		return;
	end;
	-- insertar registro si el nombre no existe
	insert into Estados
		(nombre)
	values
		(@nombre)

	-- Obtener el ID del registro recién insertado
    declare @idestado int = SCOPE_IDENTITY();

	-- confirmar transaccion
	commit transaction;
	print 'Registrado correctamente';


    -- Retornar los datos
    select * from Estados
    where idestado = @idestado;
end;

GO
-- ACTUALIZAR --
create procedure sp_actualizar_nombre_estado
	@idestado int,
	@nombre varchar(50)
as
begin
	begin transaction;

	-- verificar si el id existe
	if not exists(select 1 from Estados where idestado = @idestado)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- verificar si el nombre ya esta en uso por otro registro
	if exists (select 1 from Estados where nombre = @nombre and idestado <> @idestado)
	begin
		rollback transaction;
		print 'Error: El nombre ya existe en otros registros';
		return;
	end;

	-- insertar registro si el nombre no existe
	update Estados
	set
		nombre = @nombre
	where idestado = @idestado;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	-- Retornar los datos
    select * from Estados
    where idestado = @idestado;
end;
GO



/******************** STORED PROCEDURE ROLES ********************/

GO
-- INSERTAR --
create procedure sp_insertar_rol
	@idestado int,
	@nombre varchar(50),
	@descripcion varchar(100)
as
begin
	begin transaction;

	-- verificar si el nombre ya esta en uso por otro registro
	if exists (select 1 from Roles where nombre = @nombre)
	begin
		rollback transaction;
		print 'Error: El nombre ya existe en otros registros';
		return;
	end;

	-- insertar registro si el nombre no existe
	insert into	Roles
		(estados_idestado, nombre, descripcion)
	values
		(@idestado, @nombre, @descripcion);

	-- Obtener el ID del registro recién insertado
    declare @idrol int = SCOPE_IDENTITY();

	-- confirmar de la transaccion
	commit transaction;
	print 'Registrado correctamente';

    -- Retornar los datos
    select *
    from Roles
    where idrol = @idrol;

end;

GO
-- ACTUALIZAR --
create procedure sp_actualizar_rol
	@idrol int,
	@idestado int,
	@nombre varchar(50),
	@descripcion varchar(100)
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Roles where idrol = @idrol)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- verificar si el nombre ya esta en uso por otro registro
	if exists (select 1 from Roles where nombre = @nombre and idrol <> @idrol)
	begin
		rollback transaction;
		print 'Error: El nombre ya existe en los registros de la tabla';
		return;
	end;

	-- Actualizar registro si pasa las verificaciones
	update Roles
	set
		estados_idestado = @idestado,
		nombre = @nombre,
		descripcion = @descripcion
	where idrol = @idrol;



	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	-- Retornar los datos
    select *
    from Roles
    where idrol = @idrol;

end;

GO
-- ACTUALIZAR ESTADO DEL ROL --
create procedure sp_actualizar_estado_rol
@idrol int,
@idestado int

as
begin
	begin transaction;

	-- verificar si id existe en los registros
	if not exists (select 1 from Roles where idrol = @idrol)
	begin
		rollback transaction;
		print 'Error: el id especificado no existe en los registros';
		return;
	end;

	-- actualizar el estado si el id existe en los registros
	update Roles
	set
		estados_idestado = @idestado
	where idrol = @idrol;

	-- confirmar la transaccion
	commit transaction;
	print 'Estado actualizado correctamente';

	-- Retornar los datos
    select *
    from Roles
    where idrol = @idrol;

end;
GO



/******************** STORED PROCEDURE PERSONAS ********************/

GO
-- INSERTAR --
create procedure sp_insertar_persona
	@idestado int,
	@cui bigint,
	@nombre varchar(30),
	@apellido varchar(30),
	@fecha_nacimiento date,
	@correo_electronico varchar(50),
	@telefono numeric(8,0),
	@direccion varchar(100)
as
begin
	begin transaction;

	-- verificar si el correo existe en los registros
	if exists (select 1 from Personas where correo_electronico = @correo_electronico)
	begin
		rollback transaction;
		print 'Error: El correo ya existe en los registros';
		return;
	end;

		-- verificar si el cui existe en los registros
	if exists (select 1 from Personas where cui = @cui)
	begin
		rollback transaction;
		print 'Error: El cui ya existe en los registros';
		return;
	end;

	-- insertar registro si el correo no existe en los registros
	insert into Personas
		(estados_idestado, cui, nombre, apellido, fecha_nacimiento, correo_electronico, telefono, direccion)
	values
		(@idestado, @cui, @nombre, @apellido, @fecha_nacimiento, @correo_electronico,@telefono, @direccion);

	-- Obtener el ID del registro recién insertado
    declare @idpersona int = SCOPE_IDENTITY();

	-- confirmar transaccion
	commit transaction;
	print 'Registrado correctamente';

	 -- Retornar los datos insertados
    select *
    from Personas
    where idpersona = @idpersona;

end;

GO
-- ACTUALIZAR --
create procedure sp_actualizar_persona
	@idpersona int,
	@idestado int,
	@cui bigint,
	@nombre varchar(30),
	@apellido varchar(30),
	@fecha_nacimiento date,
	@correo_electronico varchar(50),
	@telefono numeric(8,0),
	@direccion varchar(100)
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Personas where idpersona = @idpersona)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- verificar si el nombre ya esta en uso por otro registro
	if exists (select 1 from Personas where correo_electronico = @correo_electronico and idpersona <> @idpersona)
	begin
		rollback transaction;
		print 'El correo ya existe en los registros de la tabla';
		return;
	end;

	-- Actualizar registro si pasa las verificaciones
	update Personas
	set
		estados_idestado = @idestado,
		cui = @cui,
		nombre = @nombre,
		apellido = @apellido,
		fecha_nacimiento = @fecha_nacimiento,
		correo_electronico = @correo_electronico,
		telefono = @telefono,
		direccion = @direccion
	where idpersona = @idpersona;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from Personas
    where idpersona = @idpersona;

end;

GO
-- ACTUALIZAR ESTADO DE LA PERSONA --
create procedure sp_actualizar_estado_persona
	@idpersona int,
	@idestado int
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Personas where idpersona = @idpersona)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- actualizar el estado si el id existe en los registros
	update Personas
	set
		estados_idestado = @idestado
	where idpersona = @idpersona;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from Personas
    where idpersona = @idpersona;

end;
GO



/******************** STORED PROCEDURE CLIENTES ********************/
GO
-- INSERTAR --
create procedure sp_insertar_cliente
	@idpersona int,
	@idestado int,
	@tipo_cliente varchar(20),
	@nit varchar(10),
	@razon_social varchar(245),
	@nombre_comercial varchar(50),
	@direccion_entrega varchar(100)
as
begin
	begin transaction;

	-- verificar si el nit existe en los registros
	if exists (select 1 from Clientes where nit = @nit)
	begin
		rollback transaction;
		print 'Error: El nit ya existe en los registros';
		return;
	end;

	-- insertar registro si el nit no existe en los registros
	insert into Clientes
		(personas_idpersona, estados_idestado, tipo_cliente, nit, razon_social, nombre_comercial, direccion_entrega)
	values
		(@idpersona, @idestado, @tipo_cliente, @nit, @razon_social, @nombre_comercial, @direccion_entrega);

	-- Obtener el ID del registro recién insertado
    declare @idcliente int = SCOPE_IDENTITY();

	-- confirmar transaccion
	commit transaction;
	print 'Registrado correctamente';

	 -- Retornar los datos insertados
    select *
    from Clientes
    where idcliente = @idcliente;

end;

GO
-- ACTUALIZAR --
create procedure sp_actualizar_cliente
	@idcliente int,
	@idpersona int,
	@idestado int,
	@tipo_cliente varchar(20),
	@nit varchar(10),
	@razon_social varchar(245),
	@nombre_comercial varchar(50),
	@direccion_entrega varchar(100)
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Clientes where idcliente = @idcliente)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- verificar si el nit ya esta en uso por otro registro
	if exists (select 1 from Clientes where nit = @nit and idcliente <> @idcliente)
	begin
		rollback transaction;
		print 'El nit ya existe en los registros de la tabla';
		return;
	end;

	-- Actualizar registro si pasa las verificaciones
	update Clientes
	set
		personas_idpersona = @idpersona,
		estados_idestado = @idestado,
		tipo_cliente = @tipo_cliente,
		nit = @nit,
		razon_social = @razon_social,
		nombre_comercial = @nombre_comercial,
		direccion_entrega = @direccion_entrega
	where idcliente = @idcliente;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from Clientes
    where idcliente = @idcliente;

end;

GO
-- ACTUALIZAR ESTADO DEL CLIENTE --
create procedure sp_actualizar_estado_cliente
	@idcliente int,
	@idestado int
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Clientes where idcliente = @idcliente)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- actualizar el estado si el id existe en los registros
	update Clientes
	set
		estados_idestado = @idestado
	where idcliente = @idcliente;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from Clientes
    where idcliente = @idcliente;

end;
GO



/******************** STORED PROCEDURE USUARIOS ********************/
GO
-- INSERTAR --
create procedure sp_insertar_usuario
	@idrol int,
	@idestado int,
	@idpersona int,
	@contrasena varchar(255)
as
begin
	begin transaction;

	-- verificar si la persona existe en los registros de usuarios
	if exists (select 1 from Usuarios where personas_idpersona = @idpersona)
	begin
		rollback transaction;
		print 'Error: La persona ya tiene usuario en los registros';
		return;
	end;

	-- insertar registro si la persona no existe en los registros de usuarios
	insert into Usuarios
		(roles_idrol, estados_idestado, personas_idpersona, contrasena)
	values
		(@idrol, @idestado, @idpersona, @contrasena);

	-- Obtener el ID del registro recién insertado
    declare @idusuario int = SCOPE_IDENTITY();

	-- confirmar transaccion
	commit transaction;
	print 'Registrado correctamente';

	 -- Retornar los datos insertados
    select idusuario, roles_idrol, estados_idestado, personas_idpersona
    from Usuarios
    where idusuario = @idusuario;

end;

GO
-- ACTUALIZAR --
create procedure sp_actualizar_usuario
	@idusuario int,
	@idrol int,
	@idestado int,
	@idpersona int,
	@contrasena varchar(255)
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Usuarios where idusuario = @idusuario)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- Actualizar registro si id existe
	update Usuarios
	set
		roles_idrol = @idrol,
		estados_idestado = @idestado,
		personas_idpersona = @idpersona,
		contrasena = @contrasena
	where idusuario = @idusuario;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select idusuario, roles_idrol, estados_idestado, personas_idpersona
    from Usuarios
    where idusuario = @idusuario;

end;

GO
-- ACTUALIZAR ESTADO DEL USUARIO --
create procedure sp_actualizar_estado_usuario
	@idusuario int,
	@idestado int
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Usuarios where idusuario = @idusuario)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- actualizar el estado si el id existe en los registros
	update Usuarios
	set
		estados_idestado = @idestado
	where idusuario = @idusuario;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select idusuario, roles_idrol, estados_idestado, personas_idpersona
    from Usuarios
    where idusuario = @idusuario;

end;
GO



/******************** STORED PROCEDURE CATEGORIASPRODUCTO ********************/
GO
-- INSERTAR --
create procedure sp_insertar_categoria_producto
	@idusuario int,
	@idestado int,
	@nombre varchar(50)
as
begin
	begin transaction;

	-- verificar si el nombre existe en los registros
	if exists (select 1 from CategoriasProductos where nombre = @nombre )
	begin
		rollback transaction;
		print 'Error: El nombre de la categoria ya existe en los registros';
		return;
	end;

	-- insertar registro si la categoria no existe en los registros
	insert into CategoriasProductos
		(usuarios_idusuario, estados_idestado, nombre)
	values
		(@idusuario, @idestado, @nombre);

		-- Obtener el ID del registro recién insertado
    declare @idcategoria int = SCOPE_IDENTITY();

	-- confirmar transaccion
	commit transaction;
	print 'Registrado correctamente';

	 -- Retornar los datos insertados
    select *
    from CategoriasProductos
    where idcategoria = @idcategoria;

end;

GO
-- ACTUALIZAR --
create procedure sp_actualizar_categoria_producto
	@idcategoria int,
	@idusuario int,
	@idestado int,
	@nombre varchar(50)
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from CategoriasProductos where idcategoria = @idcategoria)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- verificar si el nombre ya esta en uso por otro registro
	if exists (select 1 from CategoriasProductos where nombre = @nombre and idcategoria <> @idcategoria)
	begin
		rollback transaction;
		print 'El nombre de la categoria ya existe en los registros de la tabla';
		return;
	end;

	-- Actualizar registro pasa las verificaciones
	update CategoriasProductos
	set
		usuarios_idusuario = @idusuario,
		estados_idestado = @idestado,
		nombre = @nombre
	where idcategoria = @idcategoria;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from CategoriasProductos
    where idcategoria = @idcategoria;

end;

GO
-- ACTUALIZAR ESTADO DE LA CATEGORIA DE PRODUCTO --
create procedure sp_actualizar_estado_categoria_producto
	@idcategoria int,
	@idestado int
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from CategoriasProductos where idcategoria = @idcategoria)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- actualizar el estado si el id existe en los registros
	update CategoriasProductos
	set
		estados_idestado = @idestado
	where idcategoria = @idcategoria;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from CategoriasProductos
    where idcategoria = @idcategoria;

end;
GO



/******************** STORED PROCEDURE PRODUCTOS ********************/
GO
-- INSERTAR --
create procedure sp_insertar_producto
	@idcategoria int,
	@idusuario int,
	@idestado int,
	@nombre varchar(50),
	@marca varchar(50),
	@codigo varchar(50),
	@stock int,
	@precio decimal(5,2),
	@foto varchar(250)
as
begin
	begin transaction;

	-- verificar si el codigo o el nombre existe en los registros
	if exists (select 1 from Productos where codigo = @codigo or nombre = @nombre)
	begin
		rollback transaction;
		print 'Error: El codigo o nombre de producto ya existe en los registros';
		return;
	end;

	-- insertar registro si el correo no existe en los registros
	insert into Productos
		(categoriasproductos_idcategoria, usuarios_idusuario,estados_idestado, nombre, marca, codigo, stock, precio, foto)
	values
		(@idcategoria, @idusuario, @idestado, @nombre, @marca, @codigo, @stock, @precio, @foto);

	-- Obtener el ID del registro recién insertado
    declare @idproducto int = SCOPE_IDENTITY();

	-- confirmar transaccion
	commit transaction;
	print 'Registrado correctamente';

	 -- Retornar los datos insertados
    select *
    from Productos
    where idproducto = @idproducto;

end;

GO
-- ACTUALIZAR --
create procedure sp_actualizar_producto
	@idproducto int,
	@idcategoria int,
	@idusuario int,
	@idestado int,
	@nombre varchar(50),
	@marca varchar(50),
	@codigo varchar(50),
	@stock int,
	@precio decimal(5,2),
	@foto varchar(250)
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Productos where idproducto = @idproducto )
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- verificar si el codigo o nombre ya esta en uso por otro registro
	if exists (select 1 from Productos where (codigo = @codigo or nombre = @nombre) and idproducto <> @idproducto)
	begin
		rollback transaction;
		print 'Error: El codigo o el nombre ya existe en los registros de la tabla';
		return;
	end;

	-- Actualizar registro si pasa las verificaciones
	update Productos
	set
		categoriasproductos_idcategoria = @idcategoria,
		usuarios_idusuario = @idusuario,
		estados_idestado = @idestado,
		nombre = @nombre,
		marca = @marca,
		codigo = @codigo,
		stock = @stock,
		precio = @precio,
		foto = @foto
	where idproducto = @idproducto;		

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from Productos
    where idproducto = @idproducto;

end;

GO
-- ACTUALIZAR ESTADO DEL PRODUCTO --
create procedure sp_actualizar_estado_producto
	@idproducto int,
	@idestado int
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Productos where idproducto = @idproducto)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- actualizar el estado si el id existe en los registros
	update Productos
	set
		estados_idestado = @idestado
	where idproducto = @idproducto;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from Productos
    where idproducto = @idproducto;

end;
GO



/******************** STORED PROCEDURE METODO DE PAGO ********************/

GO
-- INSERTAR --
create procedure sp_insertar_metodo_pago
	@idestado int,
	@nombre varchar(50)
as
begin
	begin transaction;

	-- verificar si el nombre ya esta en uso por otro registro
	if exists (select 1 from MetodosPago where nombre = @nombre)
	begin
		rollback transaction;
		print 'Error: El nombre ya existe en otros registros';
		return;
	end;

	-- insertar registro si el nombre no existe
	insert into	MetodosPago
		(estados_idestado, nombre)
	values
		(@idestado, @nombre);

	-- Obtener el ID del registro recién insertado
    declare @idmetodo int = SCOPE_IDENTITY();

	-- confirmar de la transaccion
	commit transaction;
	print 'Registrado correctamente';

	 -- Retornar los datos insertados
    select *
    from MetodosPago
    where idmetodo = @idmetodo;

end;

GO
-- ACTUALIZAR --
create procedure sp_actualizar_metodo_pago
	@idmetodo int,
	@idestado int,
	@nombre varchar(50)
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from MetodosPago where idmetodo = @idmetodo)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- verificar si el nombre ya esta en uso por otro registro
	if exists (select 1 from MetodosPago where nombre = @nombre and idmetodo <> @idmetodo)
	begin
		rollback transaction;
		print 'Error: El nombre ya existe en los registros de la tabla';
		return;
	end;

	-- Actualizar registro si pasa las verificaciones
	update MetodosPago
	set
		estados_idestado = @idestado,
		nombre = @nombre
	where idmetodo = @idmetodo;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from MetodosPago
    where idmetodo = @idmetodo;

end;

GO
-- ACTUALIZAR ESTADO DEL METODO DE PAGO --
create procedure sp_actualizar_estado_metodo_pago
@idmetodo int,
@idestado int

as
begin
	begin transaction;

	-- verificar si id existe en los registros
	if not exists (select 1 from MetodosPago where idmetodo = @idmetodo)
	begin
		rollback transaction;
		print 'Error: el id especificado no existe en los registros';
		return;
	end;

	-- actualizar el estado si el id existe en los registros
	update MetodosPago
	set
		estados_idestado = @idestado
	where idmetodo = @idmetodo;

	-- confirmar la transaccion
	commit transaction;
	print 'Estado actualizado correctamente';

	 -- Retornar los datos insertados
    select *
    from MetodosPago
    where idmetodo = @idmetodo;

end;
GO



/******************** STORED PROCEDURE ORDENES Y DETALLES ********************/
GO


-- INSERTAR --

create procedure sp_insertar_orden_y_detalles
	@idusuario int,
	@idestado int,
	@idcliente int,
	@fecha_envio date,
	@fecha_entregada date,
	@metodo_pago int,
	@nota varchar(200),
	@detalles nvarchar(max) -- Informacion de los detalles

as
begin
	begin transaction
	
	begin try

		if not exists (select 1 from Clientes where idcliente = @idcliente)
		begin
			rollback transaction;
			print 'Error: El cliente no existe en los registros';
			return;
		end

		-- Validar que el JSON no esté vacío
        if @detalles is null or @detalles = ''
        begin
            rollback transaction;
            print 'Error: El parámetro detalles está vacío';
            return;
        end;

		-- insertar registro si pasa las verificaciones
		insert into Ordenes
			(usuarios_idusuario, estados_idestado, clientes_idcliente, fecha_envio, fecha_entregada, metodo_pago, nota)
		values
			(@idusuario, @idestado, @idcliente, @fecha_envio, @fecha_entregada, @metodo_pago, @nota);

		DECLARE @idorden INT;
		SET @idorden = SCOPE_IDENTITY();

		declare @total_orden_calculado decimal(10,2) = 0;

		-- Insertar en la tabla DetallesOrdenes

		    -- Insertar los detalles de la orden desde el JSON
    insert into DetallesOrdenes(ordenes_idorden, productos_idproducto, cantidad, descuento, subtotal, nota)
    select 
        @idorden as ordenes_idorden,
        productos_idproducto,
        cantidad,
        descuento,
        (cantidad * p.precio) - descuento as subtotal,
        nota
    from OPENJSON(@detalles)
    WITH (
        productos_idproducto int,
        cantidad int,
        descuento decimal(10, 2),
        subtotal decimal(10, 2),
        nota nvarchar(255)
    )as Detalle
    inner join Productos p on Detalle.productos_idproducto = p.idproducto;


        -- Calcular el total de la orden sumando los subtotales
        select @total_orden_calculado = sum(subtotal)
        from DetallesOrdenes
        where ordenes_idorden = @idorden;

        -- Actualizar el total de la orden en la tabla Ordenes
        update Ordenes
        set total_orden = @total_orden_calculado
        where idorden = @idorden;

		-- Confirmar la transacción
        commit transaction;

		-- Retornar los datos insertados
		select *
		from Ordenes
		where idorden = @idorden;

        print 'Orden y detalles registrados correctamente';
    end try
    begin catch
        -- En caso de error, deshacer la transacción
        rollback transaction;

        -- Lanzar el error
        throw;
    end catch
end;

GO

GO

create procedure sp_actualizar_orden_y_detalles
    @idorden int,
    @idusuario int,
    @idestado int,
    @idcliente int,
    @fecha_envio date,
    @fecha_entregada date,
    @metodo_pago int,
    @nota varchar(200),
    @detalles nvarchar(max) -- Información de los detalles en formato JSON
as
begin
    begin transaction;

    begin try
        -- Validar que la orden exista
        if not exists (select 1 from Ordenes where idorden = @idorden)
        begin
            rollback transaction;
            print 'Error: La orden no existe en los registros';
            return;
        end;

        -- Validar que el cliente exista
        if not exists (select 1 from Clientes where idcliente = @idcliente)
        begin
            rollback transaction;
            print 'Error: El cliente no existe en los registros';
            return;
        end;

        -- Validar que el JSON no esté vacío
        if @detalles is null or @detalles = ''
        begin
            rollback transaction;
            print 'Error: El parámetro detalles está vacío';
            return;
        end;

        -- Actualizar la orden principal
        update Ordenes
        set 
            usuarios_idusuario = @idusuario,
            estados_idestado = @idestado,
            clientes_idcliente = @idcliente,
            fecha_envio = @fecha_envio,
            fecha_entregada = @fecha_entregada,
            metodo_pago = @metodo_pago,
            nota = @nota
        where idorden = @idorden;

        -- Eliminar los detalles antiguos de la orden
        delete from DetallesOrdenes where ordenes_idorden = @idorden;

		    -- Insertar los detalles de la orden desde el JSON
    insert into DetallesOrdenes(ordenes_idorden, productos_idproducto, cantidad, descuento, subtotal, nota)
    select 
        @idorden as ordenes_idorden,
        productos_idproducto,
        cantidad,
        descuento,
        (cantidad * p.precio) - descuento as subtotal,
        nota
    from OPENJSON(@detalles)
    WITH (
        productos_idproducto int,
        cantidad int,
        descuento decimal(10, 2),
        subtotal decimal(10, 2),
        nota nvarchar(255)
    )as Detalle
    inner join Productos p on Detalle.productos_idproducto = p.idproducto;

		-- Recalcular el total de la orden
        declare @total_orden_calculado decimal(10,2) = 0;

        -- Calcular el total de la orden sumando los subtotales
        select @total_orden_calculado = sum(subtotal)
        from DetallesOrdenes
        where ordenes_idorden = @idorden;

        -- Actualizar el total de la orden en la tabla Ordenes
        update Ordenes
        set total_orden = @total_orden_calculado
        where idorden = @idorden;

        -- Confirmar la transacción
        commit transaction;

		-- Retornar los datos insertados
		select *
		from Ordenes
		where idorden = @idorden;

    end try
    begin catch
        -- Deshacer la transacción en caso de error
        rollback transaction;

        -- Lanzar el error para diagnóstico
        throw;
    end catch;
end;

GO

-- ACTUALIZAR ESTADO DE LA ORDEN --
create procedure sp_actualizar_estado_orden
	@idorden int,
	@idestado int
as
begin
	begin transaction;

	-- verificar si id existe
	if not exists (select 1 from Ordenes where idorden = @idorden)
	begin
		rollback transaction;
		print 'Error: El id especificado no existe';
		return;
	end;

	-- actualizar el estado si el id existe en los registros
	update Ordenes
	set
		estados_idestado = @idestado
	where idorden = @idorden;

	-- confirmar la transaccion
	commit transaction;
	print 'Actualizado correctamente';

		-- Retornar los datos insertados
		select *
		from Ordenes
		where idorden = @idorden

end;


GO

GO

-- Insertar datos en orden y detalles de orden

EXEC sp_insertar_orden_y_detalles
    @idusuario = 1,
    @idestado = 1, 
    @idcliente = 1,   
    @fecha_envio = '2024-12-22', 
    @fecha_entregada = '2024-12-23',
    @metodo_pago = 1, 
    @nota = 'Orden de prueba',
    @detalles = N'[{"productos_idproducto": 1, "cantidad": 2, "descuento": 2, "nota": "Producto A"}]' -- Detalles en formato JSON




GO

/************************* VISTAS SOLICITADAS *************************/

GO
-- PRODUCTOS ACTIVOS CON STOCK MAYOR A 0
create view vw_productos_activos as
select p.idproducto as id, p.nombre as 'nombre producto',  cp.nombre as categoria, p.marca, p.codigo, p.stock, p.precio, e.nombre as 'estado'
from Productos p 
inner join CategoriasProductos cp on p.categoriasproductos_idcategoria = cp.idcategoria
inner join Usuarios u on p.estados_idestado = u.idusuario
inner join Personas per on u.personas_idpersona = per.idpersona
inner join Estados e on p.estados_idestado = e.idestado
where stock > 0 and p.estados_idestado = 1;

GO
	-- LLAMAR A LA VISTA
-- select * from vw_productos_activos;


GO
-- TOTAL DE QUETZALES EN ORDENES INGRESADAS EN EL MES DE AGOSTO 2024
create view vw_total_quetzales_ordenes_mes_anio as
select month(fecha_entregada) as mes, year(fecha_entregada) as anio, sum(total_orden) as total
from Ordenes
group by year(fecha_entregada), month(fecha_entregada);

GO
	-- LLAMAR A LA VISTA
-- select total from vw_total_quetzales_ordenes_mes_anio where mes = 08 and anio = 2024;

GO
-- CLIENTES CON MAS ORDENES HISTORICO TOTAL
create view vw_top10_cliente_mas_ordenes as
select top 10 p.nombre as cliente, count(o.idorden) as 'total ordenes', sum(o.total_orden) as 'total consumos'
from Ordenes o
inner join Clientes c on o.clientes_idcliente = c.idcliente
inner join Personas p on c.personas_idpersona = p.idpersona
group by p.nombre
order by 'total ordenes' desc;

GO
	-- LLAMAR A LA VISTA
-- select * from vw_top10_cliente_mas_ordenes;


GO

-- TOP 10 PRODUCTOS MAS VENDIDOS
create view vw_top10_productos_mas_vendidos as
select top 10 p.nombre, sum(do.cantidad) as cantidad from DetallesOrdenes do
inner join Productos p on do.productos_idproducto = p.idproducto
group by do.productos_idproducto, p.nombre
order by cantidad desc;

GO
	-- LLAMAR A LA VISTA
-- select * from vw_top10_productos_mas_vendidos;




/*

-- PRUEBAS PARA EL USO DE LOS STORE PROCEDURE INLCUYENDO LOS DATOS NECESARIOS PARA INSERTAR DATOS, ACTUALIZAR DATOS Y ACTUALIZAR ESTADO

/************************* PRUEBAS DEL STORED PROCEDURE ESTADO *************************/

-- INSERTAR --
-- solo acepta nombres distintos a los ya existentes
exec sp_insertar_estado
	@nombre = 'Nuevo';


-- ACTUALIZAR --
-- actualizacion aceptada, id existente y nombre no existente
exec sp_actualizar_nombre_estado
	@idestado = 1,
	@nombre = 'Active';



/************************* PRUEBAS DEL STORED PROCEDURE ROLES *************************/

-- INSERTAR --
-- solo acepta nombres distintos a los ya existentes
exec sp_insertar_rol
@idestado = 1,
@nombre = 'Supervisor',
@descripcion = 'Acceso total al sistema';


-- ACTUALIZAR --
-- actualizacion aceptada, id existente y nombre no existente
exec sp_actualizar_rol
@idrol = 3,
@idestado = 2,
@nombre = 'Clientes',
@descripcion = 'Permisos limitados a ver catalogos y realizar pedidos';


-- ACTUALIZAR ESTADO DEL ROL --
-- actualizacion aceptada, id del rol existente
exec sp_actualizar_estado_rol
@idrol = 3, 
@idestado = 2;


/************************* PRUEBAS DEL STORED PROCEDURE PERSONAS *************************/

-- INSERTAR --
-- solo acepta correos distintos a los ya existentes
exec sp_insertar_persona
	@idestado = 1,
	@cui = 7901234467840,
	@nombre = 'Juan',
	@apellido = 'Lopez', 
	@fecha_nacimiento = '1998-03-25', 
	@correo_electronico = 'juanperez3@correo.com',
	@telefono = 35465768,
	@direccion = '13ave, 5ta calle';

-- ACTUALIZAR --
-- actualizacion aceptada, id existente y correo inexistente
exec sp_actualizar_persona
	@idpersona = 1, -- id existente en los registros
	@idestado = 1,
	@cui = 8012345678901,
	@nombre = 'Juan',
	@apellido = 'Lopez', 
	@fecha_nacimiento = '1998-03-25', 
	@correo_electronico = 'jlopez@correo.com', --correo inexistente en los registros
	@telefono = 35465768,
	@direccion = '13ave, 5ta calle';

-- ACTUALIZAR ESTADO DE LA PERSONA --
-- actualizacion aceptada, id de la persona existente
exec sp_actualizar_estado_persona
@idpersona = 3, 
@idestado = 2;


/************************* PRUEBAS DEL STORED PROCEDURE CLIENTES *************************/

-- INSERTAR --
-- solo acepta registrar nit nuevos
exec sp_insertar_cliente
	@idpersona = 1,
	@idestado = 1,
	@tipo_cliente = 'Persona',
	@nit = 34567856,
	@razon_social = null,
	@nombre_comercial = null,
	@direccion_entrega = '13ave 5ta calle';

-- ACTUALIZAR --
-- actualizacion correcta, id cliente existente y nit sin registrar
exec sp_actualizar_cliente
	@idcliente = 1,
	@idpersona = 1,
	@idestado = 1,
	@tipo_cliente = 'Persona',
	@nit = 34567854,
	@razon_social = null,
	@nombre_comercial = null,
	@direccion_entrega = '13ave 6ta calle';

-- ACTUALIZAR ESTADO DEL CLIENTE --
-- actualizacion aceptada, id del cliente existente
exec sp_actualizar_estado_cliente
@idcliente = 1, 
@idestado = 2;


/************************* PRUEBAS DEL STORED PROCEDURE USUARIOS *************************/

-- INSERTAR --
-- Solo acepta personas sin usuario
exec sp_insertar_usuario
	@idrol = 2,
	@idestado = 1,
	@idpersona = 16,
	@contrasena = '123abc';

-- ACTUALIZAR --
-- actualizacion aceptada, id de usuario existente
exec sp_actualizar_usuario
	@idusuario = 2,
	@idrol = 3,
	@idestado = 2,
	@idpersona = 2,
	@contrasena = '87654321';

-- ACTUALIZAR ESTADO DE USUARIO
-- actualizacion aceptada, id del usuario existente
exec sp_actualizar_estado_usuario
	@idusuario = 1,
	@idestado = 2;


/************************* PRUEBAS DEL STORED PROCEDURE CATEGORIAS PRODUCTOS *************************/

-- INSERTAR --
-- solo acepta nombres que no esten en los registros
exec sp_insertar_categoria_producto
	@idusuario = 2,
	@idestado = 1,
	@nombre = 'Lacteo';

-- ACTUALIZAR --
-- actualizacion aceptada, id de categoria existente y nombre no existente
exec sp_actualizar_categoria_producto
	@idcategoria = 2,
	@idusuario = 1,
	@idestado = 1,
	@nombre = 'Lacteos';

-- ACTUALIZAR ESTADO DE CATEGORIA PRODUCTO
-- actualizacion aceptada, id de la categoria existente
exec sp_actualizar_estado_categoria_producto
	@idcategoria = 1,
	@idestado = 1;


/************************* PRUEBAS DEL STORED PROCEDURE PRODUCTOS *************************/

-- INSERTAR --
-- solo acepta nombres y codigo que no esten en los registros
exec sp_insertar_producto
	@idcategoria = 1,
	@idusuario = 2,
	@idestado = 1,
	@nombre = 'Huevos',
	@marca = 'La Granja',
	@codigo = 'L0089',
	@stock = 25,
	@precio = 2.00,
	@foto = 'url';

-- ACTUALIZAR --
-- actualizacion aceptada, id existente y nombre y codigo no existente
exec sp_actualizar_producto
	@idproducto = 2,
	@idcategoria = 1,
	@idusuario = 2,
	@idestado = 1,
	@nombre = 'Quesos',
	@marca = 'DeliLacteos',
	@codigo = 'L0034',
	@stock = 10,
	@precio = 20.00,
	@foto = 'url';

-- ACTUALIZAR ESTADO DE PRODUCTO
-- actualizacion aceptada, id de la categoria existente
exec sp_actualizar_estado_producto
	@idproducto = 14,
	@idestado = 3;

*/


/************************* PRUEBAS DEL STORED PROCEDURE METODOS DE PAGO *************************/

/*
-- INSERTAR
exec sp_insertar_metodo_pago
	@idestado = 2,
	@nombre = 'Tarjetas';

-- ACTUALIZAR
exec sp_actualizar_metodo_pago
	@idmetodo = 1,
	@idestado = 2,
	@nombre = 'Tarjeta';

-- ACTUALIZAR ESTADO
exec sp_actualizar_estado_metodo_pago
	@idmetodo = 6,
	@idestado = 2;

*/

/************************* PRUEBAS DEL STORED PROCEDURE ORDENES Y DETALLES *************************/


/*

-- Llamada al procedimiento para insertar una nueva orden con detalles
EXEC sp_insertar_orden_y_detalles
    @idusuario = 1,
    @idestado = 1, 
    @idcliente = 1,   
    @fecha_envio = '2024-12-22', 
    @fecha_entregada = '2024-12-23',
    @metodo_pago = 1, 
    @nota = 'Orden de prueba',
    @detalles = N'[{"productos_idproducto": 1, "cantidad": 2, "descuento": 2, "nota": "Producto A"}]' -- Detalles en formato JSON
;

-- Llamada al procedimiento para insertar una nueva orden con detalles
EXEC sp_actualizar_orden_y_detalles
	@idorden =31,
    @idusuario = 1, 
    @idestado = 1, 
    @idcliente = 1, 
    @fecha_envio = '2024-12-22', 
    @fecha_entregada = '2024-12-23', 
    @metodo_pago = 1, 
    @nota = 'Orden de prueba',  
    @detalles = N'[{"productos_idproducto": 1, "cantidad": 5, "descuento": 2, "nota": "Producto A"}, {"productos_idproducto": 3, "cantidad": 2, "descuento": 3, "nota": "Producto A"}]' -- Detalles en formato JSON
;


-- ACTUALIZAR ESTADO
exec sp_actualizar_estado_orden
	@idorden = 6,
	@idestado = 1;


*/
