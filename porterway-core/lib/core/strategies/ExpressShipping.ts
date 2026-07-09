import { IShippingCostStrategy } from './IShippingCostStrategy';

export class ExpressShipping implements IShippingCostStrategy {
  calculateCost(weightKg: number): number {
    return weightKg * 5.50; // Tarifa base express
  }
}