import type {
  CreateDebtInput,
  Debt,
  DebtFilters,
  UpdateDebtInput,
} from '../entities/debt.entity';

export interface DebtPort {
  createDebt(input: CreateDebtInput): Promise<Debt>;
  getDebts(filters?: DebtFilters): Promise<Debt[]>;
  getDebtById(id: string): Promise<Debt>;
  updateDebt(id: string, data: UpdateDebtInput): Promise<Debt>;
  deleteDebt(id: string): Promise<void>;
  markAsPaid(id: string): Promise<Debt>;
}
