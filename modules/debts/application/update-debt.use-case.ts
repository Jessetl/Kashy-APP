import type { Debt, UpdateDebtInput } from '../domain/entities/debt.entity';
import type { DebtPort } from '../domain/ports/debt.port';

export class UpdateDebtUseCase {
  constructor(private readonly debtPort: DebtPort) {}

  async execute(id: string, data: UpdateDebtInput): Promise<Debt> {
    if (data.title !== undefined && !data.title.trim()) {
      throw new Error('El título no puede estar vacío');
    }

    if (data.amountUsd !== undefined && data.amountUsd <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    if (data.interestRatePct !== undefined && data.interestRatePct < 0) {
      throw new Error('La tasa de interés no puede ser negativa');
    }

    return this.debtPort.updateDebt(id, data);
  }
}
