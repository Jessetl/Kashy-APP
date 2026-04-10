import type { Debt, DebtFilters } from '../domain/entities/debt.entity';
import type { DebtPort } from '../domain/ports/debt.port';

export class GetDebtsUseCase {
  constructor(private readonly debtPort: DebtPort) {}

  async execute(filters?: DebtFilters): Promise<Debt[]> {
    return this.debtPort.getDebts(filters);
  }
}
