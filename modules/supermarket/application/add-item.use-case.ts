import type {
  CreateShoppingItemInput,
  ShoppingItem,
} from '../domain/entities/shopping-list.entity';
import type { ShoppingListPort } from '../domain/ports/shopping-list.port';

export class AddItemUseCase {
  constructor(private readonly port: ShoppingListPort) {}

  async execute(
    listId: string,
    input: CreateShoppingItemInput,
  ): Promise<ShoppingItem> {
    if (!input.productName.trim()) {
      throw new Error('El nombre del producto es obligatorio');
    }
    if (input.unitPriceLocal <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }
    if (input.quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    return this.port.addItem(listId, {
      ...input,
      productName: input.productName.trim(),
    });
  }
}
