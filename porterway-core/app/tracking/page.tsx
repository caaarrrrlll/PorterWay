'use client';
import { useState } from 'react';
import { OrderService } from '@/lib/services/api/orderService';

interface TrackedOrder {
  code: string;
  title: string;
  status: string;
  zone: string;
  priority: string;
  createdAt: string;
}

export default function TrackingPage() {
  const [trackingCode, setTrackingCode] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await OrderService.trackOrderByCode(trackingCode);
      setOrder(data);
    } catch (err) {
      setError('No se encontró ninguna guía con ese código. Verifica el formato (Ej: ORD-123456).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Rastreo de Paquetes</h1>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <input
            type="text"
            required
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value.trim())}
            placeholder="Ingresa el Tracking ID (Ej: ORD-987654)"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-gray-800 text-white p-3 rounded font-medium hover:bg-gray-900 disabled:bg-gray-400"
          >
            {loading ? 'Buscando...' : 'Rastrear Envío'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        {order && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-lg">
            <h2 className="text-lg font-bold mb-4 border-b border-blue-200 pb-2">Resultados de Trazabilidad</h2>
            <div className="space-y-3 text-sm">
              <p><strong>Código de Guía:</strong> {order.code}</p>
              <p><strong>Descripción:</strong> {order.title}</p>
              <p><strong>Zona de Entrega:</strong> {order.zone}</p>
              <p><strong>Estado Actual:</strong> 
                <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded font-bold">
                  {order.status}
                </span>
              </p>
              <p><strong>Fecha de Creación:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}