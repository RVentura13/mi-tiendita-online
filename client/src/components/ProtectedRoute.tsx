import { Navigate, Outlet } from 'react-router-dom';

type ProtectedProps = {
	role: string;
	allowedRoles: string[]; // Lista de roles permitidos
	redirectTo?: string;
};

export const ProtectedRoute = ({ role, allowedRoles, redirectTo = '/login' }: ProtectedProps) => {
	if (!allowedRoles.includes(role)) {
		return (
			<Navigate
				to={redirectTo}
				replace
			/>
		);
	}

	return <Outlet />;
};
