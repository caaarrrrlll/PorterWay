'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OrderService } from '@/lib/services/api/orderService';

interface OrderDetail {
  id: number;
  code: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  zone: string;
  totalWeight: number;
  porterId?: number | null;
  porter?: { firstName: string; lastName: string };
}

export default function OrderDetailPage() {
  const rawParams = useParams();
  const { id } = rawParams as { id: string }; // Desestructuración directa para cliente
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para los formularios
  const [newStatus, setNewStatus] = useState('');
  const [porterIdInput, setPorterIdInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const data = await OrderService.getOrderById(Number(id));
      setOrder(data);
      setNewStatus(data.status);
    } catch (error) {
      console.error(error);
      alert("Error al cargar la orden");
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await OrderService.updateOrderStatus(Number(id), newStatus);
      fetchOrderDetails(); 
    } catch (error: any) {
      if (error.status === 409) {
        alert("Acción inválida: No se puede modificar el estado de una orden finalizada.");
      } else {
        alert("Error al actualizar el estado.");
      }
    }
  };

  const handleAssignPorter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await OrderService.assignPorterToOrder(Number(id), Number(porterIdInput));
      setPorterIdInput('');
      fetchOrderDetails(); 
    } catch (error: any) {
      if (error.status === 409) {
        alert("Acción inválida: No se puede asignar un transportista a una orden cerrada o en progreso.");
      } else {
        alert("Error al asignar transportista.");
      }
    }
  };

  if (loading) return <div className="p-6">Cargando detalles...</div>;
  if (!order) return <div className="p-6">No se encontró la orden</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Detalle de Orden: {order.code}</h1>
        <button onClick={() => router.back()} className="text-blue-400 hover:text-blue-300 underline">Volver al listado</button>
      </div>

      {/* Se añade text-gray-900 en el grid para que todo el texto de las tarjetas sea oscuro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">
        
        {/* Panel de Información */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="font-bold text-lg mb-4 border-b border-gray-300 pb-2">Información General</h2>
          <div className="flex flex-col gap-2">
            <p><strong>Título:</strong> {order.title}</p>
            <p><strong>Descripción:</strong> {order.description}</p>
            <p><strong>Zona:</strong> {order.zone}</p>
            <p><strong>Peso:</strong> {order.totalWeight} kg</p>
            <p><strong>Prioridad:</strong> {order.priority}</p>
            <p>
              <strong>Estado Actual:</strong> 
              <span className="bg-gray-200 px-2 py-1 rounded text-sm font-bold ml-2 text-black">{order.status}</span>
            </p>
            <p><strong>Transportista:</strong> {order.porter ? `${order.porter.firstName} ${order.porter.lastName}` : 'Sin asignar'}</p>
          </div>
        </div>

        {/* Panel de Acciones */}
        <div className="flex flex-col gap-6">
          
          {/* Formulario: Asignar Transportista */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="font-bold text-lg mb-4 border-b border-gray-300 pb-2">Asignar Transportista</h2>
            <form onSubmit={handleAssignPorter} className="flex flex-col gap-3">
              <label className="text-sm font-medium">ID del Transportista (User ID)</label>
              <input 
                type="number" 
                required
                value={porterIdInput}
                onChange={(e) => setPorterIdInput(e.target.value)}
                placeholder="Ej: 7" 
                className="border border-gray-300 p-2 rounded bg-white text-black" 
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium mt-2">
                Asignar
              </button>
              <p className="text-xs text-gray-500 mt-1">* Solo válido si el estado es 'Open'.</p>
            </form>
          </div>

          {/* Formulario: Cambiar Estado */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="font-bold text-lg mb-4 border-b border-gray-300 pb-2">Actualizar Estado</h2>
            <form onSubmit={handleUpdateStatus} className="flex flex-col gap-3">
              <label className="text-sm font-medium">Nuevo Estado</label>
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
                className="border border-gray-300 p-2 rounded bg-white text-black"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
              <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700 font-medium mt-2">
                Guardar Estado
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}