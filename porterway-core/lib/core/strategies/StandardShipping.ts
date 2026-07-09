import { IShippingCostStrategy } from './IShippingCostStrategy';

export class StandardShipping implements IShippingCostStrategy {
  calculateCost(weightKg: number): number {
    return weightKg * 2.50; // Tarifa base estándar
  }
}