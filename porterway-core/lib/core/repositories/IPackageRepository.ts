// lib/core/repositories/IPackageRepository.ts
export interface IPackageRepository {
  getById(id: string): Promise<any>;
  save(pkg: any): Promise<any>;
  update(id: string, status: string): Promise<any>;
}