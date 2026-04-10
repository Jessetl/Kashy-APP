import type { CreateDebtInput, Debt } from '../domain/entities/debt.entity';
import type { DebtPort } from '../domain/ports/debt.port';

export class CreateDebtUseCase {
  constructor(private readonly debtPort: DebtPort) {}

  async execute(input: CreateDebtInput): Promise<Debt> {
    if (!input.title.trim()) {
      throw new Error('El título es requerido');
    }

    if (input.amountUsd <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    if (input.interestRatePct !== undefined && input.interestRatePct < 0) {
      throw new Error('La tasa de interés no puede ser negativa');
    }

    return this.debtPort.createDebt(input);
  }
}
