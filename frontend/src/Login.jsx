import { useState } from 'react';
import axios from 'axios';
import { Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import './App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isRegistering 
      ? 'http://localhost:8081/api/auth/register' 
      : 'http://localhost:8081/api/auth/authenticate';

    try {
      const response = await axios.post(endpoint, { username, password });
      const token = response.data.token;
      
      // Sauvegarde et rechargement pour forcer l'entrée propre
      localStorage.setItem('token', token);
      window.location.reload(); 
      
    } catch (err) {
      setError("Identifiants incorrects ou serveur indisponible.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Cercles d'arrière-plan pour l'effet Glassmorphism */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>

      <div className="card login-card glass-effect">
        <div className="login-header">
          <div className="logo-pulse">
            <ShieldCheck size={40} color="#646cff" />
          </div>
          <h2>{isRegistering ? 'Création de compte' : 'Espace Sécurisé'}</h2>
          <p className="subtitle">FinShield AI Protection</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Utilisateur</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Ex: AdminReda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>Mot de passe</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="loader"></span>
            ) : (
              <>
                {isRegistering ? "S'inscrire" : "Accéder au Dashboard"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="footer-switch">
          <p>
            {isRegistering ? "Déjà membre ?" : "Nouveau venu ?"}
            <span onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? " Se connecter" : " Créer un compte"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}