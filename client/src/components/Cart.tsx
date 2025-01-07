import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from 'react';
import { useCart } from '../context/cartContext';
import { CartItem } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

const imgNotFound = '/image-not-found.jpg';

export const Cart = () => {
	const { cart, removeItem, incrementItem, decrementItem } = useCart();
	const [page, setPage] = useState(0);
	const [rowsPerPage] = useState(5);

	// Obtener el total de todos los items del carrito
	const getTotal = (cart: CartItem[]): number => {
		return cart.reduce((total, item) => total + item.precio * item.quantity, 0);
	};

	// Funciones para manejar el paginador
	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	return (
		<>
			{cart.length === 0 ? (
				<Typography
					align='center'
					variant='h6'
					color='primary'
					sx={{ width: 200 }}
				>
					El carrito está vacío
				</Typography>
			) : (
				<>
					<Paper sx={{ width: '100%' }}>
						<TableContainer component={Paper}>
							<Table
								sx={{ minWidth: 650 }}
								size='small'
								aria-label='a dense table'
							>
								<TableHead>
									<TableRow>
										<TableCell
											align='center'
											sx={{ color: '#1976d2' }}
										>
											Producto{' '}
										</TableCell>
										<TableCell
											align='center'
											sx={{ color: '#1976d2' }}
										>
											Foto
										</TableCell>
										<TableCell
											align='center'
											sx={{ color: '#1976d2' }}
										>
											Precio c/u
										</TableCell>
										<TableCell
											align='center'
											sx={{ color: '#1976d2' }}
										>
											Cantidad
										</TableCell>
										<TableCell
											align='center'
											sx={{ color: '#1976d2' }}
										>
											Subtotal
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{cart.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
										<TableRow
											key={item.idproducto}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell
												component='th'
												scope='row'
												align='center'
											>
												{item.nombre}
											</TableCell>
											<TableCell align='center'>
												<img
													src={item.foto ? item.foto : imgNotFound}
													height={50}
													alt='Foto del producto'
													onError={(e) => (e.currentTarget.src = imgNotFound)}
												/>
											</TableCell>
											<TableCell align='center'>{formatCurrency(item.precio)}</TableCell>

											<TableCell align='center'>
												<IconButton
													aria-label='Decrementar'
													onClick={() => decrementItem(item.idproducto)}
													color='info'
												>
													<RemoveIcon />
												</IconButton>

												{item.quantity}

												<IconButton
													aria-label='Incrementar'
													onClick={() => incrementItem(item.idproducto, item.stock)}
													color='info'
												>
													<AddIcon />
												</IconButton>
											</TableCell>

											<TableCell align='center'>{formatCurrency(item.precio * item.quantity)}</TableCell>
											<TableCell align='center'>
												<IconButton
													aria-label='Eliminar'
													onClick={() => removeItem(item.idproducto)}
													color='error'
												>
													<DeleteIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<Typography
							variant='h5'
							color='primary'
						>
							{`Total: ${formatCurrency(getTotal(cart))}`}
						</Typography>
						<TablePagination
							rowsPerPageOptions={[0]}
							component='div'
							labelRowsPerPage={false}
							labelDisplayedRows={({ from, to, count }) => `${from} - ${to} de ${count !== -1 ? count : `más de ${to}`}`}
							count={cart.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
						/>
					</Box>
				</>
			)}
		</>
	);
};
