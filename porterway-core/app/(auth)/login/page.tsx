'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/styles/login.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(''); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email && password) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();

        if (data.success) {
          document.cookie = "porterway_session=true; path=/; max-age=86400"; 

          localStorage.setItem('porterway_user', JSON.stringify(data.user)); 

          router.push('/dashboard');
        }else {
          setError(data.error);
        }
      } catch (err) {
        setError('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__card}>
        <h1 className={styles.login__title}>PorterWay</h1>
        {error && <p className={styles.login__error}>{error}</p>}
        <form className={styles.login__form} onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className={styles.login__input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password" 
            placeholder="Contraseña" 
            className={styles.login__input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className={styles.login__button}>
            Iniciar Sesión
          </button>

          <Link href="/register" className={styles.login__buttonSecondary}>
            Registrar usuario
          </Link>
        </form>
      </div>
    </div>
  );
}