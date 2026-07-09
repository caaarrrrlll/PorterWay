'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from '@/styles/dashboard.module.scss';

// Importamos el mapa dinámicamente
const DynamicMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando mapa logístico...</div>
});

interface Order {
  id: number;
  code: string;
  title: string;
  status: string;
  porterId: number | null;
  porter?: {
    firstName: string;
    lastName: string;
  };
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showMyOrders, setShowMyOrders] = useState(false);

  useEffect(() => {
    // Leemos la sesión asegurando compatibilidad con la clave que establecimos en el Login
    const storedUser = localStorage.getItem('porterway_session') || localStorage.getItem('porterway_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {}
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (json.success) setOrders(json.data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: { 'Content-Type': 'application/json' }
    });
    fetchOrders(); 
  };

  // Filtramos estrictamente para que solo queden los pedidos del usuario activo
  const myOrders = orders.filter(order => order.porterId === currentUser?.id);

  return (
    <div className={styles.dashboard__content}>
      {/* Mapa de Operaciones */}
      <div className={styles.dashboard__card} style={{ height: '75vh', marginBottom: '1rem', padding: 0, overflow: 'hidden', position: 'relative' }}>
        <DynamicMap />
      </div>

      {/* Botón central para desplegar los envíos */}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <button 
          className={styles['dashboard__action-button']} 
          style={{ 
            backgroundColor: showMyOrders ? '#e74c3c' : '#2c3e50', 
            color: 'white', 
            padding: '12px 24px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          onClick={() => setShowMyOrders(!showMyOrders)}
        >
          {showMyOrders ? 'Ocultar mis envíos' : 'Mostrar mis envíos'}
        </button>
      </div>

      {/* La tabla solo se renderiza si presionaste el botón */}
      {showMyOrders && (
        <div className={styles.dashboard__card}>
          <h2 style={{ marginBottom: '1rem', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            Envíos asignados a: {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Usuario sin identificar'}
          </h2>
          
          <table className={styles.dashboard__table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No tienes envíos asignados actualmente.</td>
                </tr>
              ) : (
                myOrders.map((order) => (
                   <tr key={order.id}>
                    <td>{order.code}</td>
                    <td>{order.title}</td>
                    <td>
                      <span className={`${styles['status-badge']} ${styles[`status-badge--${order.status.toLowerCase().replace(' ', '-')}`]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {/* Como esta tabla ya es exclusiva del perfil activo, los botones siempre están activos */}
                      <button className={styles['dashboard__action-button']} onClick={() => updateStatus(order.id, 'In Transit')}>En Ruta</button>
                      <button className={styles['dashboard__action-button']} onClick={() => updateStatus(order.id, 'Completed')}>Completar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  );
}