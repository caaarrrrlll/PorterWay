'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard.module.scss';

const VEHICLE_OPTIONS = [
  'Moto',
  'Auto',
  'Camioneta',
  'Furgon',
  'Camion',
];

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

export default function NewUserPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      vehicleType: VEHICLE_OPTIONS[0],
      zone: ZONE_OPTIONS[0],
      roleCode: 'PORTER',
    });
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

      setMessage('Usuario registrado correctamente.');
      resetForm();
    } catch {
      setError('Error de conexion con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboard__content}>
      <h1 style={{ marginBottom: '1rem' }}>Registrar Nuevo Usuario</h1>
      <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
        Crea un nuevo transportista con su vehiculo, zona y credenciales de acceso.
      </p>

      <form className={styles.dashboard__form} onSubmit={handleSubmit}>
        <div className={styles['dashboard__form-group']}>
          <label>Nombre</label>
          <input
            className={styles['dashboard__form-input']}
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />
        </div>

        <div className={styles['dashboard__form-group']}>
          <label>Apellido</label>
          <input
            className={styles['dashboard__form-input']}
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
        </div>

        <div className={styles['dashboard__form-group']}>
          <label>Nombre de usuario</label>
          <input
            className={styles['dashboard__form-input']}
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
          />
        </div>

        <div className={styles['dashboard__form-group']}>
          <label>Correo electronico</label>
          <input
            type="email"
            className={styles['dashboard__form-input']}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>

        <div className={styles['dashboard__form-group']}>
          <label>Contrasena</label>
          <input
            type="password"
            className={styles['dashboard__form-input']}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />
        </div>

        <div className={styles['dashboard__form-group']}>
          <label>Tipo de vehiculo</label>
          <select
            className={styles['dashboard__form-select']}
            value={formData.vehicleType}
            onChange={(e) => handleChange('vehicleType', e.target.value)}
            required
          >
            {VEHICLE_OPTIONS.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>
        </div>

        <div className={styles['dashboard__form-group']}>
          <label>Zona donde vive</label>
          <select
            className={styles['dashboard__form-select']}
            value={formData.zone}
            onChange={(e) => handleChange('zone', e.target.value)}
            required
          >
            {ZONE_OPTIONS.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className={styles['dashboard__form-group']}>
          <label>Rol</label>
          <select
            className={styles['dashboard__form-select']}
            value={formData.roleCode}
            onChange={(e) => handleChange('roleCode', e.target.value)}
          >
            <option value="PORTER">Transportista</option>
            <option value="SUPERVISOR">Supervisor</option>
          </select>
        </div>

        {message ? <p style={{ color: '#16a34a' }}>{message}</p> : null}
        {error ? <p style={{ color: '#dc2626' }}>{error}</p> : null}

        <button
          type="submit"
          className={styles['dashboard__action-button']}
          style={{ backgroundColor: '#2c3e50', color: 'white', padding: '12px' }}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </form>
    </div>
  );
}
