import { useContext } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthContext } from '../context/authContext';
import { CartPage } from '../pages/CartPage';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { NotFoundPage } from '../pages/NotFoundPage';
import { Ordenes } from '../pages/Ordenes';
import { Products } from '../pages/Products';
import { Usuarios } from '../pages/Usuarios';
import { Categories } from '../pages/Categories';

export const AppRoutes = () => {
	const { role } = useContext(AuthContext);
	const Layout = () => {
		const location = useLocation();

		return (
			<>
				{/* Verifica si es la ruta del login para no mostrar el navbar */}
				{location.pathname !== '/login' && <Navbar />}

				{/* Rutas del sistema */}

				<Routes>
					{/* Ruta públicas */}
					<Route
						path='/login'
						element={<Login />}
					/>
					{/* Rutas privadas */}
					<Route
						element={
							<ProtectedRoute
								role={role}
								allowedRoles={['Administrador', 'Operador', 'Cliente']}
							/>
						}
					>
						<Route
							path='/'
							element={<Home />}
						/>
						<Route
							path='/cartpage'
							element={<CartPage />}
						/>

						<Route
							path='/ordenes'
							element={<Ordenes />}
						/>
					</Route>
					<Route
						element={
							<ProtectedRoute
								role={role}
								allowedRoles={['Administrador', 'Operador']}
							/>
						}
					>
						<Route
							path='/productos'
							element={<Products />}
						/>
						<Route
							path='/usuarios'
							element={<Usuarios />}
						/>
						<Route
							path='/categorias'
							element={<Categories />}
						/>
					</Route>
					{/* Ruta para 404 */}
					<Route
						path='*'
						element={<NotFoundPage />}
					/>
				</Routes>
			</>
		);
	};

	return (
		<BrowserRouter>
			<Layout />
		</BrowserRouter>
	);
};
