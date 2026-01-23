import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldAlert, ShieldCheck, Activity, DollarSign, LayoutDashboard, List } from 'lucide-react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, fraud: 0, secureAmount: 0 });
  
  // --- NOUVEAU : État pour savoir quelle page afficher ---
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/transactions');
      const data = response.data;
      setTransactions(data);
      
      const total = data.length;
      const frauds = data.filter(t => t.fraud).length;
      const secure = data.filter(t => !t.fraud).reduce((acc, curr) => acc + curr.amount, 0);
      
      setStats({ total, fraud: frauds, secureAmount: secure });
    } catch (error) {
      console.error("Erreur backend:", error);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8081/api/transactions', {
        amount: parseFloat(amount),
        distance: parseFloat(distance)
      });
      setAmount(''); setDistance('');
      fetchTransactions();
    } catch (error) { alert("Erreur API"); } 
    finally { setLoading(false); }
  };

  const pieData = [
    { name: 'Valides', value: stats.total - stats.fraud },
    { name: 'Fraudes', value: stats.fraud },
  ];
  const COLORS = ['#00C49F', '#FF4D4D'];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <ShieldCheck size={28} color="#646cff" />
          <h2>FinShield</h2>
        </div>
        <nav>
          {/* --- BOUTONS ACTIFS --- */}
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`} 
            onClick={() => setActiveTab('transactions')}
          >
            <List size={20} /> Transactions
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        {/* --- VUE DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <>
            <header>
              <h1>Vue d'ensemble</h1>
              <p>Surveillance des transactions en temps réel</p>
            </header>

            <div className="kpi-grid">
              <div className="card kpi">
                <div className="icon-bg blue"><Activity size={24} /></div>
                <div><h3>Total Transactions</h3><p className="value">{stats.total}</p></div>
              </div>
              <div className="card kpi">
                <div className="icon-bg red"><ShieldAlert size={24} /></div>
                <div><h3>Fraudes Détectées</h3><p className="value">{stats.fraud}</p></div>
              </div>
              <div className="card kpi">
                <div className="icon-bg green"><DollarSign size={24} /></div>
                <div><h3>Volume Sécurisé</h3><p className="value">{stats.secureAmount.toLocaleString()} €</p></div>
              </div>
            </div>

            <div className="content-grid">
              <div className="left-column">
                <div className="card form-card">
                  <h3>⚡ Simulation Rapide</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <input type="number" placeholder="Montant (€)" value={amount} onChange={e => setAmount(e.target.value)} required />
                      <input type="number" placeholder="Distance (km)" value={distance} onChange={e => setDistance(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={loading}>{loading ? 'Analyse...' : 'Scanner la transaction'}</button>
                  </form>
                </div>

                <div className="card chart-card">
                  <h3>Répartition des Risques</h3>
                  <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="legend"><span>🟢 Valides</span><span>🔴 Fraudes</span></div>
                </div>
              </div>

              <div className="card table-card">
                <h3>Dernières Transactions</h3>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Montant</th><th>Distance</th><th>Score IA</th><th>Statut</th></tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 5).map((t) => (
                        <tr key={t.id}>
                          <td>#{t.id}</td>
                          <td>{t.amount} €</td>
                          <td>{t.distance} km</td>
                          <td>{(t.fraudProbability * 100).toFixed(1)}%</td>
                          <td><span className={`badge ${t.isFraud ? 'badge-fraud' : 'badge-valid'}`}>{t.isFraud ? 'REFUSÉ' : 'OK'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- VUE TRANSACTIONS (Pleine Page) --- */}
        {activeTab === 'transactions' && (
          <>
            <header>
              <h1>Historique Complet</h1>
              <p>Liste détaillée de toutes les opérations</p>
            </header>

            <div className="card table-card" style={{ marginTop: '20px' }}>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Date</th><th>Montant</th><th>Distance</th><th>Risque Calculé</th><th>Décision</th></tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id}>
                        <td>#{t.id}</td>
                        {/* On ajoute une fausse date pour faire joli si pas dispo */}
                        <td>{t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : 'Maintenant'}</td>
                        <td>{t.amount} €</td>
                        <td>{t.distance} km</td>
                        <td>{(t.fraudProbability * 100).toFixed(2)}%</td>
                        <td>
                          <span className={`badge ${t.isFraud ? 'badge-fraud' : 'badge-valid'}`}>
                            {t.isFraud ? 'FRAUDE DÉTECTÉE' : 'APPROUVÉE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default App;