import { AppRoutes } from './routes/Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/cartContext';

import './index.css';

export const App = () => {
	return (
		<>
			<AuthProvider>
				<CartProvider>
					<AppRoutes />
					<ToastContainer />
				</CartProvider>
			</AuthProvider>
		</>
	);
};
