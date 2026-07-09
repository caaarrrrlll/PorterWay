'use client';
import { useEffect, useState } from 'react';
import { OrderService } from '@/lib/services/api/orderService';

interface Order {
  id: number;
  code: string;
  title: string;
  status: string;
  priority: string;
  zone: string;
  porter?: { firstName: string; lastName: string };
}

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestión de Envíos</h1>
      
      {loading ? (
        <p>Cargando órdenes...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b">
                <th className="p-4">Código</th>
                <th className="p-4">Título</th>
                <th className="p-4">Zona</th>
                <th className="p-4">Prioridad</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Transportista Asignado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{order.code}</td>
                  <td className="p-4">{order.title}</td>
                  <td className="p-4">{order.zone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="p-4">{order.status}</td>
                  <td className="p-4 text-gray-500">
                    {order.porter ? `${order.porter.firstName} ${order.porter.lastName}` : 'Sin asignar'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}