import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../context/cartContext';
import { useState } from 'react';

type productProps = {
	idproducto: number;
	nombre: string;
	marca: string;
	stock: number;
	precio: number;
	foto: string;
	estados_idestado: number;
};

const imgNotFound = '/image-not-found.jpg';

export const CardProduct = ({ idproducto, nombre, marca, stock, precio, foto, estados_idestado }: productProps) => {
	const { addToCart } = useCart();

	const [imageSrc, setImageSrc] = useState(foto || imgNotFound);

	const handleError = () => {
		setImageSrc(imgNotFound); // Cambia la imagen a la predeterminada si ocurre un error
	};

	return (
		<Card sx={{ width: 350, height: 550, position: 'relative' }}>
			<Typography
				color='error'
				variant='h6'
				sx={{ position: 'absolute', top: 0, right: 10 }}
			>
				{stock <= 0 && 'Sin Existencia'}
			</Typography>
			<CardMedia
				component='img'
				alt='foto del producto'
				sx={{
					width: '100%',
					height: 350,
					objectFit: 'cover',
				}}
				image={imageSrc}
				onError={handleError} // Maneja el error de carga de la imagen
			/>
			<CardContent>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Typography
						gutterBottom
						variant='h5'
						component='div'
					>
						{nombre}
					</Typography>
					<Typography>{`Existencia: ${stock}`}</Typography>
				</Box>
				<Typography
					variant='body1'
					sx={{ color: 'text.secondary' }}
				>
					{marca}
				</Typography>
			</CardContent>
			<CardActions sx={{ display: 'flex', justifyContent: 'space-between', margin: 1 }}>
				<Typography
					color='primary'
					variant='h5'
				>
					{formatCurrency(precio)}
				</Typography>

				<Button
					onClick={() => addToCart({ idproducto, nombre, foto, stock, precio, quantity: 1, estados_idestado })}
					size='small'
					variant='contained'
					disabled={stock <= 0 || estados_idestado === 2}
				>
					Comprar
				</Button>
			</CardActions>
		</Card>
	);
};
