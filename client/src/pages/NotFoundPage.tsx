import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
				textAlign: 'center',
			}}
		>
			<Typography
				variant='h1'
				color='error'
				sx={{ fontSize: '6rem' }}
			>
				404
			</Typography>
			<Typography
				variant='h4'
				sx={{ mb: 2 }}
			>
				La página que buscas no existe.
			</Typography>
			<Button
				variant='contained'
				color='primary'
				component={Link}
				to='/'
			>
				Volver al Inicio
			</Button>
		</Box>
	);
};
