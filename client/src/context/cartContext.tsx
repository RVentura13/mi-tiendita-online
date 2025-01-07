import { createContext, Dispatch, useContext, useEffect, useState } from 'react';
import { CartItem } from '../types';

type CardContextType = {
	cart: CartItem[];
	setCart: Dispatch<React.SetStateAction<CartItem[]>>;
	addToCart: (item: CartItem) => void;
	removeItem: (idproducto: number) => void;
	incrementItem: (idproducto: number, stock: number) => void;
	decrementItem: (idproducto: number) => void;
	clearCart: () => void;
};

export const CartContext = createContext<CardContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
	const [cart, setCart] = useState<CartItem[]>(() => {
		const storedCart = localStorage.getItem('cart');
		return storedCart ? JSON.parse(storedCart) : [];
	});

	// Sincroniza el estado del carrito con localStorage
	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));
	}, [cart]);

	// Funcion para agregar items al carrito
	const addToCart = ({ idproducto, nombre, foto, stock, precio, estados_idestado }: CartItem) => {
		setCart((prevCart) => {
			const existingItem = cart.find((item) => item.idproducto === idproducto);
			if (existingItem) {
				return prevCart.map((item) => (item.idproducto === idproducto ? { ...item, quantity: item.quantity + 1 } : item));
			}
			return [...prevCart, { idproducto, nombre, foto, stock, precio, estados_idestado, quantity: 1 }];
		});
	};

	// Funcion para remover items del carrito
	const removeItem = (idproducto: number) => {
		setCart((prevCart) => {
			return prevCart.filter((item) => item.idproducto !== idproducto);
		});
	};

	const decrementItem = (idproducto: number) => {
		setCart((prevCart) => {
			return prevCart.map((item) => {
				if (item.idproducto === idproducto && item.quantity > 1) {
					return { ...item, quantity: item.quantity - 1 };
				}
				return item;
			});
		});
	};

	const incrementItem = (idproducto: number, stock: number) => {
		setCart((prevCart) => {
			return prevCart.map((item) => {
				if (item.idproducto === idproducto && item.quantity < stock) {
					return {
						...item,
						quantity: item.quantity + 1,
					};
				}
				return item;
			});
		});
	};

	const clearCart = () => {
		setCart([]);
	};

	return <CartContext.Provider value={{ cart, setCart, addToCart, removeItem, incrementItem, decrementItem, clearCart }}> {children} </CartContext.Provider>;
};

// Hook para usar el contexto
export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart debe ser usado dentro de un CartProvider');
	}
	return context;
};
