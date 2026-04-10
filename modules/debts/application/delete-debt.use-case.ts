import type { DebtPort } from '../domain/ports/debt.port';

export class DeleteDebtUseCase {
  constructor(private readonly debtPort: DebtPort) {}

  async execute(id: string): Promise<void> {
    return this.debtPort.deleteDebt(id);
  }
}
