# 🛡️ FinShield AI - Système de Détection de Fraude Distribué

FinShield est une plateforme bancaire démonstratrice utilisant une architecture **Microservices**. Elle combine la robustesse de **Java Spring Boot** pour les transactions financières et la puissance de **Python (Scikit-Learn)** pour l'analyse prédictive de fraude en temps réel.

## 🚀 Architecture Technique

Le projet est divisé en deux microservices autonomes communiquant via API REST :

1.  **Core Banking Service (Java 21 + Spring Boot 3)**
    * Gère les transactions, les utilisateurs et la persistance des données.
    * Communique de manière synchrone avec le service d'IA pour valider chaque transaction.
    * Base de données : H2 (In-Memory) pour le développement, extensible vers MySQL/PostgreSQL.

2.  **Fraud Detection Service (Python + FastAPI)**
    * Expose un modèle de Machine Learning (Random Forest) via une API haute performance.
    * Analyse les patterns de transactions (Montant, Distance, Heure) pour calculer un score de risque.
    * Précision du modèle actuel : > 99%.

## 🛠️ Stack Technologique

* **Backend :** Java 21, Spring Boot 3 (Web, Data JPA), Lombok.
* **AI/ML :** Python 3.x, FastAPI, Scikit-learn, Pandas, Joblib.
* **Outils :** Maven, Git, REST Template.

## 📦 Installation et Lancement

### Prérequis
* Java 17 ou 21 installé.
* Python 3.9+ installé.

### 1. Lancer le Service IA (Python)
```bash
cd fraud-detection-service
pip install pandas scikit-learn joblib fastapi uvicorn
# Entraîner le modèle (si nécessaire)
python train_model.py
# Lancer l'API
uvicorn main:app --reload

### 2. Lancer le Core Banking (Java)
Bash

cd core-banking-service/core-banking
./mvnw spring-boot:run
L'API Java sera accessible sur http://localhost:8081.

🧪 Exemple d'Utilisation (API)
POST /api/transactions

JSON

{
  "amount": 950,
  "distance": 80
}
Réponse (Fraude détectée) :

JSON

{
    "status": "REJECTED_FRAUD",
    "fraud": true,
    "fraudProbability": 0.99
}