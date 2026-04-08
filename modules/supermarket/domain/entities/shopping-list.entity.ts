/** Estado de una lista de compras */
export type ShoppingListStatus = 'active' | 'completed';

/** Producto dentro de una lista de compras */
export interface ShoppingItem {
  id: string;
  listId: string;
  productName: string;
  category: string;
  unitPriceLocal: number;
  quantity: number;
  totalLocal: number;
  unitPriceUsd: number | null;
  totalUsd: number | null;
  isPurchased: boolean;
  createdAt: string;
}

/** Lista de compras */
export interface ShoppingList {
  id: string;
  userId: string | null;
  name: string;
  storeName: string | null;
  status: ShoppingListStatus;
  ivaEnabled: boolean;
  totalLocal: number;
  totalUsd: number;
  exchangeRateSnapshot: number | null;
  items: ShoppingItem[];
  createdAt: string;
  completedAt: string | null;
}

/** Datos para crear un producto */
export interface CreateShoppingItemInput {
  productName: string;
  unitPriceLocal: number;
  quantity: number;
  category: string;
  unitPriceUsd?: number;
}

/** Datos para crear una lista */
export interface CreateShoppingListInput {
  name: string;
  storeName?: string;
}

/** Categorias predefinidas de productos */
export const PRODUCT_CATEGORIES = [
  { key: 'COMIDA', label: 'Comida', icon: 'utensils' },
  { key: 'FRUTAS', label: 'Frutas', icon: 'apple' },
  { key: 'CARNES', label: 'Carnes', icon: 'beef' },
  { key: 'BEBIDAS', label: 'Bebidas', icon: 'cup-soda' },
  { key: 'LIMPIEZA', label: 'Limpieza', icon: 'spray-can' },
  { key: 'HIGIENE', label: 'Higiene', icon: 'shower-head' },
  { key: 'OTROS', label: 'Otros', icon: 'ellipsis' },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]['key'];
