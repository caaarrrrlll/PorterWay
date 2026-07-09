'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/dashboard.module.scss';

interface PorterRanking {
  porterId: number;
  firstName: string;
  lastName: string;
  totalOrders: number;
  finalEfficiencyScore: number;
}

// --- Componente de Filtro de Rango de Fechas ---
export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/rankings?startDate=${startDate}&endDate=${endDate}`);
  };

  return (
    <form onSubmit={handleFilter} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-6 items-end">
      <div className="flex flex-col">
        <label className="text-sm font-bold text-gray-700 mb-1">Fecha Inicio</label>
        <input 
          type="date" 
          value={startDate || ''} 
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded" 
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-bold text-gray-700 mb-1">Fecha Fin</label>
        <input 
          type="date" 
          value={endDate || ''} 
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded" 
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 h-[42px]">
        Aplicar Filtros
      </button>
    </form>
  );
}

// --- Contenido Principal ---
function RankingsContent() {
  const searchParams = useSearchParams();
  const [porters, setPorters] = useState<PorterRanking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedZone, setSelectedZone] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('0'); 

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  useEffect(() => {
    fetchRankings();
  }, [selectedZone, selectedCategory, startDate, endDate]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      let url = `/api/core/rankings?categoryId=${selectedCategory}&zone=${selectedZone}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const res = await fetch(url);
      const json = await res.json();
      
      if (json.success) {
        setPorters(json.topPorters);
      } else {
        setPorters([]);
      }
    } catch (error) {
      console.error("Error al cargar rankings:", error);
      setPorters([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboard__content}>
      <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Rankings de Eficiencia Global</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>Visualiza el desempeño de tus recursos en toda la ciudad o filtra por sectores específicos.</p>

      <DateRangeFilter />

      <div className={styles.dashboard__form} style={{ flexDirection: 'row', gap: '2rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <div className={styles['dashboard__form-group']} style={{ flex: 1 }}>
          <label style={{ fontWeight: 'bold', color: '#2c3e50' }}>Zona Operativa</label>
          <select 
            className={styles['dashboard__form-select']} 
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            <option value="Todas">🌍 Todas las Zonas</option>
            
            <optgroup label="Centro Histórico y Tradicional">
              <option value="Centro Histórico">Centro Histórico</option>
              <option value="La Ronda">La Ronda</option>
              <option value="San Juan">San Juan</option>
              <option value="La Floresta">La Floresta</option>
            </optgroup>
            
            <optgroup label="Norte (Comercial y Residencial)">
              <option value="La Mariscal">La Mariscal</option>
              <option value="Iñaquito y La Carolina">Iñaquito y La Carolina</option>
              <option value="González Suárez">González Suárez</option>
              <option value="Quito Tenis">Quito Tenis</option>
              <option value="Carcelén y Ponciano">Carcelén y Ponciano</option>
            </optgroup>

            <optgroup label="Sur (Residencial e Industrial)">
              <option value="Solanda y La Magdalena">Solanda y La Magdalena</option>
              <option value="El Recreo">El Recreo</option>
              <option value="Quitumbe">Quitumbe</option>
            </optgroup>

            <optgroup label="Valles Aledaños">
              <option value="Cumbayá">Cumbayá</option>
              <option value="Tumbaco">Tumbaco</option>
              <option value="Valle de los Chillos">Valle de los Chillos</option>
            </optgroup>
          </select>
        </div>

        <div className={styles['dashboard__form-group']} style={{ flex: 1 }}>
          <label style={{ fontWeight: 'bold', color: '#2c3e50' }}>Categoría de Carga</label>
          <select 
            className={styles['dashboard__form-select']} 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="0">📦 Todas las Categorías</option>
            <option value="1">Mudanzas (Pesada)</option>
            <option value="2">Paquetería (Ligera)</option>
            <option value="3">Comida / Restaurantes</option>
          </select>
        </div>
      </div>

      <div className={styles.dashboard__card}>
        {loading ? (
          <p>Cargando datos del sistema logístico...</p>
        ) : porters.length === 0 ? (
          <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>No hay registros disponibles para estos filtros.</p>
        ) : (
          <table className={styles.dashboard__table}>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Transportista</th>
                <th>Entregas Completadas</th>
                <th>Eficiencia Core</th>
              </tr>
            </thead>
            <tbody>
              {porters.map((porter, index) => (
                <tr key={porter.porterId}>
                  <td>#{index + 1}</td>
                  <td>{porter.firstName} {porter.lastName}</td>
                  <td>{porter.totalOrders}</td>
                  <td className={styles['dashboard__table-score']}>
                    {porter.finalEfficiencyScore}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// --- Página Principal (Wrapper con Suspense) ---
export default function RankingsPage() {
  return (
    <Suspense fallback={<div>Cargando página...</div>}>
      <RankingsContent />
    </Suspense>
  );
}