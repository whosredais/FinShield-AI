// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ShieldAlert, ShieldCheck, Activity, DollarSign, LayoutDashboard, List, LogOut, Search, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify'; // IMPORT DES NOTIFICATIONS
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role); 
        setUsername(decoded.sub);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        handleLogout();
      }
    }
  }, [token]);

  if (!token) return <Login />;

  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [distance, setDistance] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, fraud: 0, secureAmount: 0 });
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchTransactions = async () => {
    if (userRole !== 'ADMIN') return;
    try {
      const response = await axios.get('http://localhost:8081/api/transactions');
      const data = response.data;
      setTransactions(data);
      const total = data.length;
      const frauds = data.filter(t => t.fraud).length;
      const secure = data.filter(t => !t.fraud).reduce((acc, curr) => acc + curr.amount, 0);
      setStats({ total, fraud: frauds, secureAmount: secure });
    } catch (error) {
      console.error("Accès refusé ou erreur serveur");
    }
  };

  useEffect(() => { 
    if(userRole === 'ADMIN') fetchTransactions(); 
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8081/api/transactions', {
        amount: parseFloat(amount),
        distance: parseFloat(distance)
      });
      setAmount(''); setDistance('');
      // UTILISATION DE TOAST AU LIEU DE ALERT
      toast.success("Transaction envoyée pour analyse !");
      if(userRole === 'ADMIN') fetchTransactions();
    } catch (error) { 
      // UTILISATION DE TOAST POUR L'ERREUR AUSSI
      toast.error("Erreur lors de la transaction"); 
    } 
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    window.location.reload();
  };

  const pieData = [
    { name: 'Valides', value: stats.total - stats.fraud },
    { name: 'Fraudes', value: stats.fraud },
  ];
  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="app-layout">
      {/* AJOUT DU CONTENEUR DE NOTIFICATIONS */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />

      <aside className="sidebar glass-effect">
        <div className="logo-container">
          <div className="logo-icon"><ShieldCheck size={24} color="white"/></div>
          <h1>FinShield</h1>
        </div>
        
        <nav>
          <p className="nav-label">MENU</p>
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          
          {userRole === 'ADMIN' && (
            <button className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
              <List size={20} /> Historique Global
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div>
            <h2>{activeTab === 'dashboard' ? 'Espace de Travail' : 'Journal des Transactions'}</h2>
            <p className="date-display">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="user-profile">
            <div className={`avatar ${userRole === 'ADMIN' ? 'bg-primary' : 'bg-green'}`}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{username}</span>
                <span style={{fontSize: '0.75rem', color: '#94a3b8'}}>{userRole === 'ADMIN' ? 'Administrateur' : 'Employé'}</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            {/* ... Le reste du contenu du dashboard est identique ... */}
            {userRole === 'ADMIN' ? (
              <>
                <div className="kpi-card glass-effect">
                    <div className="kpi-icon blue"><Activity size={24} /></div>
                    <div><p className="kpi-label">Total Transactions</p><h3 className="kpi-value">{stats.total}</h3></div>
                </div>
                <div className="kpi-card glass-effect">
                    <div className="kpi-icon red"><ShieldAlert size={24} /></div>
                    <div><p className="kpi-label">Menaces Bloquées</p><h3 className="kpi-value">{stats.fraud}</h3></div>
                </div>
                <div className="kpi-card glass-effect">
                    <div className="kpi-icon green"><DollarSign size={24} /></div>
                    <div><p className="kpi-label">Volume Sécurisé</p><h3 className="kpi-value">{stats.secureAmount.toLocaleString('fr-FR')} €</h3></div>
                </div>
              </>
            ) : (
                <div className="card glass-effect" style={{gridColumn: 'span 3', textAlign: 'center', padding: '2rem'}}>
                    <h3>👋 Bonjour {username}</h3>
                    <p style={{color: '#94a3b8'}}>Vous êtes connecté au système de détection. Utilisez le scanner ci-dessous pour vérifier une transaction.</p>
                </div>
            )}

            <div className="card glass-effect form-section" style={{gridColumn: userRole === 'USER' ? 'span 3' : 'span 1'}}>
              <h3><Search size={20}/> Simulateur IA</h3>
              <form onSubmit={handleSubmit} className="simulation-form">
                <div className="form-group">
                  <label>Montant (€)</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ex: 500.00" required />
                </div>
                <div className="form-group">
                  <label>Distance (km)</label>
                  <input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="Ex: 12" required />
                </div>
                <button type="submit" disabled={loading} className="analyze-btn">
                  {loading ? 'Analyse en cours...' : 'Scanner la transaction'}
                </button>
              </form>
            </div>

            {userRole === 'ADMIN' && (
                <>
                <div className="card glass-effect chart-section">
                <h3>Répartition des Risques</h3>
                <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                    <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none'}} itemStyle={{color: '#fff'}}/>
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                </div>

                <div className="card glass-effect table-section full-width">
                <h3>Dernières Activités</h3>
                <table className="modern-table">
                    <thead><tr><th>ID</th><th>Montant</th><th>Distance</th><th>Score</th><th>Statut</th></tr></thead>
                    <tbody>
                    {transactions.slice(0, 5).map((t) => (
                        <tr key={t.id}>
                        <td>#{t.id}</td>
                        <td className="font-mono">{t.amount} €</td>
                        <td>{t.distance} km</td>
                        <td>{(t.fraudProbability * 100).toFixed(1)}%</td>
                        <td><span className={`status-badge ${t.isFraud ? 'status-fraud' : 'status-valid'}`}>{t.isFraud ? 'BLOQUÉ' : 'VALIDÉ'}</span></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                </>
            )}
          </div>
        )}

        {activeTab === 'transactions' && userRole === 'ADMIN' && (
          <div className="card glass-effect table-section">
            <table className="modern-table">
              <thead><tr><th>ID</th><th>Date</th><th>Montant</th><th>Distance</th><th>Risque</th><th>Statut</th></tr></thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>#{t.id}</td>
                    <td>{new Date().toLocaleTimeString()}</td>
                    <td className="font-mono">{t.amount} €</td>
                    <td>{t.distance} km</td>
                    <td className={t.isFraud ? 'text-danger' : 'text-success'}>{(t.fraudProbability * 100).toFixed(2)}%</td>
                    <td><span className={`status-badge ${t.isFraud ? 'status-fraud' : 'status-valid'}`}>{t.isFraud ? 'FRAUDE' : 'OK'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'transactions' && userRole !== 'ADMIN' && (
            <div className="card glass-effect" style={{textAlign: 'center', padding: '4rem', color: '#ef4444'}}>
                <Lock size={48} style={{marginBottom: '1rem'}}/>
                <h2>Accès Interdit</h2>
                <p>Seuls les administrateurs peuvent voir l'historique global.</p>
            </div>
        )}
      </main>
    </div>
  );
}

export default App;