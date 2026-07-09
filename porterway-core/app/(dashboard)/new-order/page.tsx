'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from '@/styles/dashboard.module.scss';

const DynamicRoutingMap = dynamic(() => import('@/components/RoutingMap'), { 
  ssr: false, 
  loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando mapa...</div> 
});

const CATALOG = {
  'Mudanzas': { 'Mesa': 20, 'Silla': 5, 'Cama': 40, 'Sofá': 50 },
  'Paquetería': { 'Caja Pequeña': 2, 'Caja Mediana': 8, 'Caja Grande': 15 },
  'Comida': { 'Catering': 25, 'Almuerzos': 12, 'Bebidas': 10 }
};

const TARIFA_BASE = 0.5;

export default function NewOrderPage() {
  const router = useRouter();
  const [distance, setDistance] = useState(0);
  const [porters, setPorters] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    title: '', // Ahora se llenará con el ítem seleccionado
    zone: '',
    porterId: '',
    category: '',
    weight: 0,
    quantity: 1,
    price: 0
  });

  useEffect(() => {
    fetch('/api/orders?purpose=next-code')
      .then(res => res.json())
      .then(data => setFormData(prev => ({ ...prev, code: data.code })));
  }, []);

  useEffect(() => {
    const calculatedPrice = (formData.weight * formData.quantity * distance) * TARIFA_BASE;
    setFormData(prev => ({ ...prev, price: Math.max(0, calculatedPrice) }));
  }, [formData.weight, formData.quantity, distance]);

  useEffect(() => {
    if (formData.zone) {
      fetch(`/api/users/porters?zone=${encodeURIComponent(formData.zone)}`)
        .then(res => res.json())
        .then(data => setPorters(data.success ? data.data : []));
    }
  }, [formData.zone]);

  // Esta función ahora también llena el título automáticamente
  const handleItemSelect = (itemName: string, weight: number) => {
    setFormData(prev => ({ ...prev, item: itemName, weight: weight, title: itemName }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryMap: Record<string, number> = { 'Mudanzas': 1, 'Paquetería': 2, 'Comida': 3 };
    
    const payload = {
      code: formData.code,
      title: formData.title || "Nuevo Pedido",
      zone: formData.zone,
      porterId: formData.porterId ? parseInt(formData.porterId) : null,
      categoryId: categoryMap[formData.category] || 1,
      totalWeight: formData.weight * formData.quantity,
      priority: 'Media'
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Pedido registrado exitosamente");
      router.push('/dashboard');
    } else {
      alert("Error al registrar");
    }
  };

  return (
    <div className={styles.dashboard__content} style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Cargar Nuevo Pedido</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <form className={styles.dashboard__card} onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
             <label style={{ fontWeight: 'bold' }}>Código de Pedido</label>
             <input className={styles['dashboard__form-input']} value={formData.code} readOnly />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontWeight: 'bold' }}>Zona</label>
              <select className={styles['dashboard__form-select']} onChange={(e) => setFormData({...formData, zone: e.target.value})}>
                 <option value="">Selecciona zona...</option>
                 <optgroup label="Norte">
                   <option value="La Mariscal">La Mariscal</option>
                   <option value="Iñaquito y La Carolina">Iñaquito y La Carolina</option>
                   <option value="González Suárez">González Suárez</option>
                 </optgroup>
                 <optgroup label="Centro">
                   <option value="Centro Histórico">Centro Histórico</option>
                   <option value="La Ronda">La Ronda</option>
                 </optgroup>
                 <optgroup label="Sur">
                   <option value="Solanda y La Magdalena">Solanda y La Magdalena</option>
                   <option value="Quitumbe">Quitumbe</option>
                 </optgroup>
                 <optgroup label="Valles">
                   <option value="Cumbayá">Cumbayá</option>
                   <option value="Valle de los Chillos">Valle de los Chillos</option>
                 </optgroup>
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>Categoría</label>
              <select className={styles['dashboard__form-select']} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="">Selecciona...</option>
                {Object.keys(CATALOG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Campo editable para el Título */}
          <div style={{ marginBottom: '1.5rem' }}>
             <label style={{ fontWeight: 'bold' }}>Título del Envío</label>
             <input className={styles['dashboard__form-input']} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej: Envío de Mesa" />
          </div>

          {formData.category && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.8rem', color: '#7f8c8d', marginBottom: '10px' }}>Sugerencias:</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {Object.entries(CATALOG[formData.category as keyof typeof CATALOG] || {}).map(([name, weight]) => (
                  <button type="button" key={name} className={styles['dashboard__action-button']} onClick={() => handleItemSelect(name, weight)}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
             <div>
               <label style={{ fontWeight: 'bold' }}>Peso (kg)</label>
               <input type="number" className={styles['dashboard__form-input']} value={formData.weight || ''} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value) || 0})} />
             </div>
             <div>
               <label style={{ fontWeight: 'bold' }}>Cantidad</label>
               <input type="number" className={styles['dashboard__form-input']} value={formData.quantity || ''} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
             </div>
          </div>

          <label style={{ fontWeight: 'bold' }}>Asignar Transportista:</label>
          <select className={styles['dashboard__form-select']} onChange={(e) => setFormData({...formData, porterId: e.target.value})} style={{ marginBottom: '1.5rem' }}>
            <option value="">{formData.zone ? "Seleccionar..." : "Primero elige zona"}</option>
            {porters.map((p: any) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
          </select>

          <div style={{ background: '#2c3e50', color: 'white', padding: '1.5rem', textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Precio Estimado</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${formData.price.toFixed(2)}</div>
          </div>

          <button type="submit" className={styles['dashboard__action-button']} style={{ marginTop: '20px', width: '100%', padding: '15px' }}>
            Registrar Pedido
          </button>
        </form>

        {/* MAPA */}
        <div>
          <div className={styles.dashboard__card} style={{ height: '400px', padding: 0, overflow: 'hidden' }}>
            <DynamicRoutingMap onRouteSet={(dist: number) => setDistance(dist)} />
          </div>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ margin: 0 }}>Distancia: <span style={{ color: '#2980b9' }}>{distance.toFixed(2)} km</span></h3>
          </div>
        </div>
      </div>
    </div>
  );
}