import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { Cart } from '../components/Cart';
import ClientInfo from '../components/ClientInfo';
import { DynamicSelect } from '../components/SelectDynamic';
import { useEffect, useState } from 'react';
import { CartItem, clienteTypes, metodosPagoTypes } from '../types';
import { useCart } from '../context/cartContext';
import { Link } from 'react-router-dom';
import { getMetodosPago } from '../api/MetodosPagoApi';
import { getClientes } from '../api/ClientesApi';
import { useAuth } from '../context/authContext';
import { createOrden } from '../api/OrdenesApi';
import { toast } from 'react-toastify';

export const CartPage = () => {
	const { cart, clearCart } = useCart();
	const { idpersona, idusuario } = useAuth();

	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [cliente, setCliente] = useState<clienteTypes | null>();
	const [options, setOptions] = useState<metodosPagoTypes[]>([]);

	// Llamado a la api para traer los metodos de pago desde la base de datos
	const fetchDataClientes = async () => {
		const data = await getClientes(idpersona);
		setCliente(data);
	};

	// Llamado a la api para traer los metodos de pago desde la base de datos
	const fetchDataMetodosPago = async () => {
		const data = await getMetodosPago();
		setOptions(data);
	};

	// Manejo del select
	const handleChange = (id: number) => {
		setSelectedId(id); // Actualiza el id seleccionado
	};

	useEffect(() => {
		fetchDataMetodosPago();
		fetchDataClientes();
	}, [cart]);

	const prepareDataForStoredProcedure = ({ cart, cliente, selectedId }: { cart: CartItem[]; cliente: clienteTypes; selectedId: number }) => {
		const detalles = cart.map((item) => ({
			productos_idproducto: item.idproducto,
			cantidad: item.quantity,
			descuento: 0,
		}));

		return {
			usuarios_idusuario: idusuario,
			estados_idestado: 3,
			clientes_idcliente: cliente.idcliente,
			fecha_envio: '2024-07-15',
			fecha_entregada: '2024-07-20',
			metodo_pago: selectedId,
			nota: 'Orden de prueba', // Nota general de la orden
			detalles,
		};
	};

	// Llamada al preparar y enviar la orden
	const handleConfirmOrder = async () => {
		if (!cliente) {
			toast.error('Información del cliente no disponible');
			return;
		}
		if (selectedId === null) {
			toast.error('Debes seleccionar un método de pago');
			return;
		}

		const preparedData = prepareDataForStoredProcedure({ cart, cliente, selectedId });
		await createOrden(preparedData);
	};

	return (
		<Container
			sx={{
				width: '100%',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				display: 'flex',
				flexWrap: 'wrap',
				gap: 2,
				justifyContent: 'center',
				alignItems: 'center',
				marginY: 10,
			}}
		>
			<Typography
				variant='h2'
				color='primary'
				align='center'
			>
				Finalizar Compra
			</Typography>
			<Paper sx={{ width: '100%', padding: 2, display: 'flex', gap: 2, flexDirection: 'column', justifyContent: 'center' }}>
				<Cart />
				<Typography
					variant='h4'
					gutterBottom
				>
					Detalles del Cliente
				</Typography>
				<Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', paddingX: 10 }}>
					<ClientInfo cliente={cliente!} />

					<Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2 }}>
						<DynamicSelect
							options={options}
							selectedId={selectedId}
							onChange={handleChange}
							label='Forma de pago'
							valueKey='idmetodo'
							labelKey='nombre'
						/>

						<Button
							component={Link}
							to={'/'}
							onClick={() => {
								handleConfirmOrder();
								clearCart();
							}}
							variant='contained'
							color='primary'
							disabled={!selectedId}
							sx={{ width: '100%' }}
						>
							Confirmar Pedido
						</Button>

						<Button
							component={Link}
							to={'/'}
							onClick={clearCart}
							variant='contained'
							color='error'
							sx={{ width: '100%' }}
						>
							Cancelar Pedido
						</Button>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};
