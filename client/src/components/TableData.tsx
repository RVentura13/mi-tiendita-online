import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, IconButton } from '@mui/material';
import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import EditIcon from '@mui/icons-material/Edit';

// Definir el tipo correcto para las columnas
type Column = {
	id: string;
	label: string;
};

type TableDataProps = {
	columns: Column[];
	data: any[];
	handleEstado: (id: number, currentEstado: number) => void;
	handleEdit: (product: any) => void;
};

const imgNotFound = '/image-not-found.jpg';

export const TableData = ({ columns, data, handleEstado, handleEdit }: TableDataProps) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage] = useState(10);

	// Funciones para manejar el paginador
	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	return (
		<>
			<Paper sx={{ width: '100%' }}>
				<TableContainer component={Paper}>
					<Table
						sx={{ minWidth: 650 }}
						size='small'
						aria-label='table'
					>
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align='center'
										sx={{ color: '#1976d2' }}
									>
										{column.label}
									</TableCell>
								))}
								{/* Columna de acciones */}
								<TableCell
									key='acciones'
									align='center'
									sx={{ color: '#1976d2' }}
								>
									Acciones
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
								<TableRow
									key={index}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									{columns.map((column) => (
										<TableCell
											key={column.id}
											align='center'
										>
											{/* Si es una celda de foto, mostrar la imagen */}
											{column.id === 'foto' ? (
												<img
													src={item[column.id] ? item[column.id] : imgNotFound}
													height={50}
													alt='Foto del producto'
													onError={(e) => (e.currentTarget.src = imgNotFound)}
												/>
											) : // Si el valor es de 'precio' o 'subtotal', formateamos el valor
											column.id === 'precio' || column.id === 'subtotal' ? (
												formatCurrency(item[column.id])
											) : // Si la columna es 'estados_idestado', mostramos "Activo" o "Inactivo" dependiendo del valor
											column.id === 'estados_idestado' ? (
												item[column.id] === 1 ? (
													<span
														style={{
															padding: 4,
															borderRadius: 5,
															color: '#fff',
															backgroundColor: '#307e34',
														}}
													>
														Activo
													</span>
												) : item[column.id] === 2 ? (
													<span
														style={{
															padding: 4,
															borderRadius: 5,
															color: '#fff',
															backgroundColor: 'red',
														}}
													>
														Inactivo
													</span>
												) : (
													''
												)
											) : (
												item[column.id]
											)}
										</TableCell>
									))}
									{/* Columna de acciones con botones */}
									<TableCell align='center'>
										<IconButton
											onClick={() => handleEstado(item.id, item.estados_idestado)}
											aria-label='Cambiar Estado'
											color='primary'
										>
											<SyncAltIcon />
										</IconButton>
										<IconButton
											onClick={() => handleEdit(item)}
											aria-label='Editar'
											color='primary'
										>
											<EditIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<TablePagination
					rowsPerPageOptions={[10]}
					component='div'
					labelRowsPerPage={false}
					labelDisplayedRows={({ from, to, count }) => `${from} - ${to} de ${count !== -1 ? count : `más de ${to}`}`}
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
				/>
			</Box>
		</>
	);
};
