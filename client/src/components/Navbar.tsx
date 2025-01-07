import { Link, useNavigate } from 'react-router-dom';

import { AppBar, Avatar, Box, Button, Container, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useContext, useEffect, useRef, useState } from 'react';

import { deleteCookie } from '../utils/cookies';
import { AuthContext } from '../context/authContext';
import { Cart } from './Cart';
import { useCart } from '../context/cartContext';
import { CartItem } from '../types';

export const Navbar = () => {
	// Estados globales
	const { role, email, idusuario, setRole, setEmail, setIdusuario, setIdpersona } = useContext(AuthContext);
	const { cart, clearCart } = useCart();

	const cartRef = useRef<HTMLDivElement>(null);

	// Obtener el total de los articulos del carrito
	const getTotalItems = (cart: CartItem[]): number => {
		return cart.reduce((total, item) => total + item.quantity, 0);
	};

	// Estados para funciones de botones del menu
	const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	// Abrir o cerrar el carrito
	const toggleCart = () => {
		setIsOpen((prev) => !prev);
	};

	// Cierra el carrito si el clic es fuera de la caja
	const handleClickOutside = (event: MouseEvent) => {
		if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	// Para redirigir la ruta
	const navigate = useNavigate();

	// Array para los menus
	const configurables = ['Usuarios', 'Productos', 'Categorias'];
	const userProfileMenu = ['Cerrar sesion'];

	// Abre el submenú
	const handleSubMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setSubMenuAnchorEl(event.currentTarget);
	};

	// Cierra el submenú
	const handleMenuClose = () => {
		setSubMenuAnchorEl(null);

		// Mover el foco de vuelta al elemento que abrió el menú
		if (subMenuAnchorEl) {
			subMenuAnchorEl.focus();
		}
	};

	// Abre el Drawer
	const toggleDrawer = (open: boolean) => {
		setDrawerOpen(open);
	};

	// Cierra el Drawer
	const closeDrawer = () => {
		setDrawerOpen(false);
	};

	// Abrir menu del perfil del usuario
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	// Cerrar menu del perfil del usuario
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const logout = () => {
		deleteCookie('authToken');
		localStorage.removeItem('userInfo');
		localStorage.removeItem('cart');
		clearCart();
		setRole(null);
		setEmail(null);
		setIdusuario(null);
		setIdpersona(null);
		navigate('/login');
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside); // Limpia el listener al desmontar
		};
	}, [isOpen]);

	return (
		<>
			<AppBar
				position='sticky'
				color='primary'
				sx={{ display: 'flex', justifyContent: 'center', height: 96 }}
			>
				<Container>
					<Toolbar>
						<Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
							{/* Icono de la marca */}
							<Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
								{
									<Link
										to={'/'}
										style={{ textDecoration: 'none' }}
									>
										<Box sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', flexGrow: 1 }}>
											<Box
												component='img'
												src='/logotipo.png'
												alt='Logo'
												sx={{
													borderRadius: 50,
													height: 50,
													marginRight: 1,
												}}
											/>
											<Typography
												component='div'
												color='#fff'
												sx={{ fontSize: 16, display: { xs: 'none', sm: 'flex' } }}
											>
												MI TIENDITA ONLINE
											</Typography>
										</Box>
									</Link>
								}
							</Box>
							{/* Botones de navegación */}
							<Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
								<Typography
									color='inherit'
									component={Link}
									to='/'
									sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: 16, marginRight: 2, textTransform: 'uppercase' }}
								>
									Inicio
								</Typography>

								<Typography
									color='inherit'
									component={Link}
									to={`/ordenes?idusuario=${idusuario}`}
									sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: 16, marginRight: 2, textTransform: 'uppercase' }}
								>
									Ordenes
								</Typography>
								{role !== 'Cliente' && (
									<Typography
										color='inherit'
										onClick={handleSubMenuOpen}
										sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: 16, marginRight: 2, textTransform: 'uppercase', ':hover': { cursor: 'pointer' } }}
									>
										Configurables
										<ArrowDropDownIcon sx={{ fontSize: 20, marginLeft: 1 }} />
									</Typography>
								)}
								<Menu
									anchorEl={subMenuAnchorEl}
									open={Boolean(subMenuAnchorEl)}
									onClose={handleMenuClose}
								>
									{configurables.map((opcion) => (
										<MenuItem
											key={opcion}
											onClick={handleMenuClose}
											component={Link}
											to={`/${opcion.replace(/\s+/g, '').toLowerCase()}`}
											sx={{ textTransform: 'uppercase', ':hover': { background: '#1976d2', color: '#fff' } }}
										>
											{opcion}
										</MenuItem>
									))}
								</Menu>
							</Box>

							{/* Boton de carrito */}
							<Box
								ref={cartRef}
								sx={{ position: 'relative' }}
							>
								<IconButton
									onClick={toggleCart}
									sx={{ marginX: 2 }}
								>
									<ShoppingCartIcon sx={{ color: '#fff', fontSize: 30 }} />
								</IconButton>

								{getTotalItems(cart) !== 0 && <Box sx={{ position: 'absolute', top: 0, right: 15, backgroundColor: 'red', borderRadius: 50, paddingX: 0.5 }}>{getTotalItems(cart)} </Box>}

								{isOpen && (
									<Box
										sx={{
											position: 'absolute',
											top: '100%', // Posiciona el componente debajo del botón
											right: 0,
											backgroundColor: 'white',
											boxShadow: 3,
											padding: 2,
											zIndex: 10,
										}}
									>
										{/* Este es el componente que aparece al hacer clic */}
										<Cart />

										{getTotalItems(cart) !== 0 && (
											<Link
												style={{ textDecoration: 'none', color: '#fff', textTransform: 'uppercase' }}
												to={'/cartpage'}
											>
												<Button
													onClick={toggleCart}
													variant='contained'
													color='primary'
												>
													Confirmar pedido
												</Button>
											</Link>
										)}
									</Box>
								)}
							</Box>

							{/* Boton del usuario */}
							<Box sx={{ flexGrow: 0 }}>
								<Tooltip title='Opciones de usuario'>
									<IconButton
										onClick={handleOpenUserMenu}
										sx={{ p: 0 }}
									>
										<Avatar
											alt={email}
											src='/static/images/avatar/2.jpg'
										/>
									</IconButton>
								</Tooltip>
								<Menu
									sx={{ mt: '45px' }}
									id='menu-appbar'
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									{userProfileMenu.map((userMenu) => (
										<MenuItem
											key={userMenu}
											onClick={() => {
												handleCloseUserMenu();
												if (userMenu.toLowerCase() === 'cerrar sesion') {
													logout();
												}
											}}
										>
											<Typography sx={{ textAlign: 'center', textTransform: 'uppercase' }}>{userMenu}</Typography>
										</MenuItem>
									))}
								</Menu>
							</Box>
							{/* Botón para el Drawer en pantallas pequeñas */}
							<IconButton
								color='inherit'
								aria-label='open menu'
								onClick={() => toggleDrawer(true)}
								sx={{ display: { xs: 'flex', sm: 'none' } }}
							>
								<MenuIcon />
							</IconButton>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			{/* Drawer para pantallas pequeñas */}
			<Drawer
				anchor='right'
				open={drawerOpen}
				onClose={closeDrawer}
			>
				<Box
					component={Link}
					to={'/'}
					sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 8 }}
				>
					<Box
						component='img'
						src='/logotipo.png'
						alt='Logo'
						sx={{
							borderRadius: 50,
							height: 100,
							marginRight: 1,
							paddingBottom: 1,
						}}
						onClick={closeDrawer}
					/>
					<Typography
						variant='h4'
						color='primary'
						onClick={closeDrawer}
					>
						MI TIENDITA ONLINE
					</Typography>
				</Box>
				<List sx={{ width: 350, padding: 4 }}>
					<ListItemButton
						component={Link}
						to='/'
						onClick={closeDrawer}
						sx={{ textDecoration: 'none', textTransform: 'uppercase', ':hover': { cursor: 'pointer', background: '#1976d2', color: '#fff' } }}
					>
						<ListItemText
							primary='Inicio'
							sx={{ textDecoration: 'none', textTransform: 'uppercase', width: '100%' }}
						/>
					</ListItemButton>
					<ListItemButton
						component={Link}
						to='/about'
						onClick={closeDrawer}
						sx={{ textDecoration: 'none', textTransform: 'uppercase', ':hover': { cursor: 'pointer', background: '#1976d2', color: '#fff' } }}
					>
						<ListItemText
							primary='Acerca de'
							sx={{ textDecoration: 'none', textTransform: 'uppercase' }}
						/>
					</ListItemButton>
					<ListItemButton
						onClick={handleSubMenuOpen}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'start',
							textDecoration: 'none',
							textTransform: 'uppercase',
							':hover': { cursor: 'pointer', background: '#1976d2', color: '#fff' },
						}}
					>
						<ListItemText
							primary='Configurables'
							sx={{ textDecoration: 'none', textTransform: 'uppercase', ':hover': { cursor: 'pointer', background: '#1976d2', color: '#fff' } }}
						/>
						<ListItemIcon>
							<ArrowDropDownIcon />
						</ListItemIcon>
					</ListItemButton>
					<Menu
						anchorEl={subMenuAnchorEl}
						open={Boolean(subMenuAnchorEl)}
						onClose={handleMenuClose}
						sx={{ width: 300 }}
					>
						<MenuItem
							onClick={() => {
								handleMenuClose();
								closeDrawer();
							}}
							component={Link}
							to='/categories'
							sx={{ textDecoration: 'none', textTransform: 'uppercase', ':hover': { cursor: 'pointer', background: '#1976d2', color: '#fff' } }}
						>
							Categorías
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleMenuClose();
								closeDrawer();
							}}
							component={Link}
							to='/products'
							sx={{ textDecoration: 'none', textTransform: 'uppercase', ':hover': { cursor: 'pointer', background: '#1976d2', color: '#fff' } }}
						>
							Productos
						</MenuItem>
					</Menu>
				</List>
			</Drawer>
		</>
	);
};
