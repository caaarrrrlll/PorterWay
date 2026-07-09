'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/login.module.scss';

const VEHICLE_OPTIONS = ['Moto', 'Auto', 'Camioneta', 'Furgon', 'Camion'];
const ZONE_OPTIONS = [
  'La Mariscal',
  'Centro Historico',
  'La Ronda',
  'San Juan',
  'La Floresta',
  'Bologna',
  'Inaquito',
  'Cumbaya',
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    vehicleType: VEHICLE_OPTIONS[0],
    zone: ZONE_OPTIONS[0],
    roleCode: 'PORTER',
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error || 'No se pudo registrar el usuario.');
        return;
      }

      setMessage('Usuario registrado correctamente. Ahora puedes iniciar sesion.');
      setTimeout(() => {
        router.push('/login');
      }, 900);
    } catch {
      setError('Error de conexion con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__card} style={{ maxWidth: '520px' }}>
        <h1 className={styles.login__title}>Registrar Usuario</h1>

        {message ? <p style={{ color: '#16a34a', marginBottom: '12px' }}>{message}</p> : null}
        {error ? <p style={{ color: '#dc2626', marginBottom: '12px' }}>{error}</p> : null}

        <form className={styles.login__form} onSubmit={handleSubmit}>
          <input
            className={styles.login__input}
            placeholder="Nombre"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />

          <input
            className={styles.login__input}
            placeholder="Apellido"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />

          <input
            className={styles.login__input}
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
          />

          <input
            type="email"
            className={styles.login__input}
            placeholder="Correo electronico"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />

          <input
            type="password"
            className={styles.login__input}
            placeholder="Contrasena"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />

          <select
            className={styles.login__input}
            value={formData.vehicleType}
            onChange={(e) => handleChange('vehicleType', e.target.value)}
            required
          >
            {VEHICLE_OPTIONS.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                Tipo de vehiculo: {vehicle}
              </option>
            ))}
          </select>

          <select
            className={styles.login__input}
            value={formData.zone}
            onChange={(e) => handleChange('zone', e.target.value)}
            required
          >
            {ZONE_OPTIONS.map((zone) => (
              <option key={zone} value={zone}>
                Zona: {zone}
              </option>
            ))}
          </select>

          <button type="submit" className={styles.login__button} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear usuario'}
          </button>
        </form>
      </div>
    </div>
  );
}
