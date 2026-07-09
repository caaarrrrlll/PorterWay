'use client';
import { useEffect, useState } from 'react';
import { OrderService } from '@/lib/services/api/orderService';
import Link from 'next/link';

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
      {/* Implementación de botón de nueva guía */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Envíos</h1>
        <Link 
          href="/orders/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-medium"
        >
          + Nueva Guía de Remisión
        </Link>
      </div>
      
      {loading ? (
        <p>Cargando órdenes...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
  <thead className="bg-gray-200 text-gray-900 border-b">
    <tr>
      <th className="p-4 font-bold">Código</th>
      <th className="p-4 font-bold">Título</th>
      <th className="p-4 font-bold">Zona</th>
      <th className="p-4 font-bold">Prioridad</th>
      <th className="p-4 font-bold">Estado</th>
      <th className="p-4 font-bold">Transportista Asignado</th>
    </tr>
  </thead>
  <tbody className="text-gray-800">
    {orders.map((order) => (
      <tr key={order.id} className="border-b hover:bg-gray-100 bg-white">
        <td className="p-4 font-medium text-blue-700 underline hover:text-blue-900">
          <Link href={`/orders/${order.id}`}>
            {order.code}
          </Link>
        </td>
        <td className="p-4">{order.title}</td>
        <td className="p-4">{order.zone}</td>
        <td className="p-4">
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            order.priority === 'High' ? 'bg-red-200 text-red-900' : 'bg-blue-200 text-blue-900'
          }`}>
            {order.priority}
          </span>
        </td>
        <td className="p-4 font-medium">{order.status}</td>
        <td className="p-4">
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