'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderService } from '@/lib/services/api/orderService';

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    zone: '',
    priority: 'Low',
    categoryId: 1,
    totalWeight: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await OrderService.createOrder(formData);
      router.push('/orders'); // Redirige a la tabla principal
    } catch (error) {
      console.error(error);
      alert('Error al crear la orden. Asegúrate de que el Category ID exista en la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'categoryId' || name === 'totalWeight' ? Number(value) : value
    }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Nueva Guía de Remisión</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col gap-4 text-black">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full border p-2 rounded bg-white text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded bg-white text-black" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Zona</label>
            <input type="text" name="zone" required value={formData.zone} onChange={handleChange} className="w-full border p-2 rounded bg-white text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prioridad</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border p-2 rounded bg-white text-black">
              <option value="Low">Baja (Low)</option>
              <option value="Medium">Media (Medium)</option>
              <option value="High">Alta (High)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Peso Total (kg)</label>
            <input type="number" step="0.1" name="totalWeight" required value={formData.totalWeight} onChange={handleChange} className="w-full border p-2 rounded bg-white text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ID de Categoría</label>
            <input type="number" name="categoryId" required value={formData.categoryId} onChange={handleChange} className="w-full border p-2 rounded bg-white text-black" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="mt-4 bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? 'Guardando...' : 'Crear Orden'}
        </button>
      </form>
    </div>
  );
}