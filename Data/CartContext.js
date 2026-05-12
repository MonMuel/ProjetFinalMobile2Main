import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart([]);
  }, [user?.nom]);

  const addToCart = (produit) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === produit.id);
      if (existing) {
        return prev.map((item) =>
          item.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      }
      return [...prev, { ...produit, quantite: 1 }];
    });
  };

  const retirerDuPanier = (id) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (!existing) {
        return prev;
      }
      if (existing.quantite <= 1) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantite: item.quantite - 1 } : item
      );
    });
  };

  const viderPanier = () => setCart([]);

  const totalPanier = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.prix) * item.quantite, 0),
    [cart]
  );

  const value = {
    cart,
    totalPanier,
    addToCart,
    retirerDuPanier,
    viderPanier,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit etre utilise dans CartProvider');
  }
  return context;
}

