'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/styles/dashboard.module.scss';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'porterway_session=; path=/; max-age=0';
    localStorage.removeItem('porterway_user');
    localStorage.removeItem('porterway_session');
    router.push('/login');
    router.refresh();
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.dashboard__sidebar} style={{ backgroundColor: '#2c3e50', padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <h2 style={{ color: 'white', marginBottom: '30px' }}>PorterWay</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/dashboard" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 'bold' }}>Inicio</Link>
          <Link href="/rankings" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 'bold' }}>Rankings Core</Link>
          <Link href="/new-order" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 'bold' }}>Cargar Pedido</Link>
        </nav>

        <button
          type="button"
          style={{ 
            marginTop: 'auto', 
            backgroundColor: '#e74c3c', 
            color: 'white', 
            padding: '10px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </aside>

      <main className={styles.dashboard__content} style={{ padding: '20px', flex: 1 }}>
        {children}
      </main>
    </div>
  );
}