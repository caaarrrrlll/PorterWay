export const OrderService = {
  createOrder: async (orderData: any) => {
    const response = await fetch('/api/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Error al crear la orden');
    return response.json();
  },

  getOrderById: async (id: number) => {
    const response = await fetch(`/api/v1/orders/${id}`);
    if (!response.ok) throw new Error('Orden no encontrada');
    return response.json();
  },

  updateOrderStatus: async (id: number, status: string) => {
    const response = await fetch(`/api/v1/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado');
    return response.json();
  },

  assignPorterToOrder: async (id: number, porterId: number) => {
    const response = await fetch(`/api/v1/orders/${id}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ porterId }),
    });
    if (!response.ok) throw new Error('Error al asignar transportista');
    return response.json();
  },

  getAllOrders: async () => {
    const response = await fetch('/api/v1/orders');
    if (!response.ok) throw new Error('Error al obtener las órdenes');
    return response.json();
  },

  trackOrderByCode: async (code: string) => {
    const response = await fetch(`/api/v1/orders/track/${code}`);
    if (!response.ok) throw new Error('Orden no encontrada');
    return response.json();
  }
  
};