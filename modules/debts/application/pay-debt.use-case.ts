import type { Debt } from '../domain/entities/debt.entity';
import type { DebtPort } from '../domain/ports/debt.port';

export class PayDebtUseCase {
  constructor(private readonly debtPort: DebtPort) {}

  async execute(id: string): Promise<Debt> {
    return this.debtPort.markAsPaid(id);
  }
}
