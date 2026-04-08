import type {
  CreateShoppingItemInput,
  CreateShoppingListInput,
  ShoppingItem,
  ShoppingList,
} from '../entities/shopping-list.entity';

export interface ShoppingListPort {
  createList(input: CreateShoppingListInput): Promise<ShoppingList>;
  getActiveLists(): Promise<ShoppingList[]>;
  getListById(id: string): Promise<ShoppingList>;
  updateList(
    id: string,
    data: Partial<Pick<ShoppingList, 'name' | 'storeName' | 'ivaEnabled'>>,
  ): Promise<ShoppingList>;
  deleteList(id: string): Promise<void>;
  completeList(id: string): Promise<ShoppingList>;
  addItems(
    listId: string,
    inputs: CreateShoppingItemInput[],
  ): Promise<ShoppingItem[]>;
  updateItem(
    listId: string,
    itemId: string,
    data: Partial<CreateShoppingItemInput>,
  ): Promise<ShoppingItem>;
  deleteItem(listId: string, itemId: string): Promise<void>;
  toggleItemPurchased(listId: string, itemId: string): Promise<ShoppingItem>;
}
