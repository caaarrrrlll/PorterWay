export interface IShippingCostStrategy {
  calculateCost(weightKg: number): number;
}