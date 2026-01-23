# 🛡️ FinShield AI - Intelligent Fraud Detection System

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-green?style=for-the-badge&logo=spring)
![Python](https://img.shields.io/badge/Python-3.9-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

**FinShield AI** is a full-stack microservices application designed to detect credit card fraud in real-time. It combines a robust **Java Spring Boot** backend, a **React** dashboard, and a **Python AI** engine trained on real-world banking data.

---

## 🚀 Architecture

The project follows a decoupled **Microservices Architecture**:

1.  **Frontend (React + Vite):** A modern dashboard for bank administrators to simulate transactions and view analytics.
2.  **Core Banking Service (Java Spring Boot):** Handles transaction processing, data persistence (H2 Database), and communicates with the AI service.
3.  **Fraud Detection Service (Python FastAPI):** A dedicated AI service running a **Random Forest** model (Scikit-Learn) trained on the Kaggle *Credit Card Fraud Detection* dataset.

### 🔄 Workflow
1. User submits a transaction via the **React Dashboard**.
2. **Java Backend** receives the request and forwards data to **Python AI**.
3. **Python AI** predicts the fraud probability (0% to 100%) and returns the verdict.
4. **Java Backend** saves the transaction with the status (`APPROVED` or `REJECTED_FRAUD`).
5. **Frontend** updates the UI in real-time.

---

## 📸 Screenshots

| Dashboard View |

| ![alt text](image.png) |

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Recharts (Data Viz), Lucide-React (Icons), CSS Grid.
* **Backend:** Java 21, Spring Boot 3 (Web, Data JPA), REST Template, H2 Database.
* **AI/ML:** Python 3.9, FastAPI, Scikit-Learn, Pandas, Joblib.
* **DevOps:** Docker, Docker Compose, Nginx.

---

## 📦 Installation & Setup

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/FinShield-AI.git](https://github.com/whosredais/FinShield-AI.git)
cd FinShield-AI
```
### 2. Run with Docker (The Magic Command) 🐳

Build and start all services (Frontend, Java, Python) with a single command:

```bash
docker-compose up --build
```
Wait until you see the logs:

"Started CoreBankingApplication" (Java API)

"Uvicorn running" (Python API)

## 🖥️ Access the Application

Once Docker is running, access the services via your browser:

Frontend Dashboard	   http://localhost:5173         START HERE - The main user interface
Java API	             http://localhost:8081	       Core Banking API (Swagger/Endpoints)
Python API	           http://localhost:8000	       Fraud Detection Engine (FastAPI Docs)

---
## 🧠 The AI Model (Dataset)

The model included (real_fraud_model.pkl) is pre-trained using the Random Forest algorithm on the Kaggle Credit Card Fraud Detection Dataset.

Want to re-train the model?
Due to GitHub file size limits, the raw CSV dataset is not included in this repo.

Download creditcard.csv from Kaggle

Place it in the fraud-detection-service/ folder

Run the training script (requires Python installed locally):
```bash
cd fraud-detection-service
pip install pandas scikit-learn joblib
python train_kaggle.py
```
---

## 🧪 Testing Scenarios

Use the Dashboard simulation form to test the AI:

✅ Scenario 1: Normal Transaction
Amount: 50 €

Distance: 5 km

Result: APPROVED 🟢

❌ Scenario 2: Suspicious Transaction
Amount: 10,000 € (High value)

Distance: 100 km (Unusual location)

Result: REJECTED 🔴 (Depending on model probability)

---
## 👨‍💻 Author

Full Stack Developer & AI Enthusiast

LinkedIn Profile : https://www.linkedin.com/in/mohamed-reda-boujir-a62087294/

---
