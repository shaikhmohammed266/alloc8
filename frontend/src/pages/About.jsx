import React from 'react';
import styles from './About.module.css';

const CARDS = [
  { icon:'🎯', title:'Mission', body:'Leverage AI and real-time data to accelerate disaster response, saving lives through smart resource allocation across India.' },
  { icon:'🤖', title:'ML Models', body:'Tweet Detector (BERT/NLP), Image Classifier (CNN/ResNet), Resource Predictor. Trained on Kaggle NLP + CrisisMMD datasets.', tags:['PyTorch','HuggingFace','BERT','ResNet50'] },
  { icon:'🏗', title:'Tech Stack', body:'React + CSS Modules frontend, Python FastAPI backend, PostgreSQL database, containerized ML inference services.', tags:['React','FastAPI','PostgreSQL','Docker'] },
  { icon:'👥', title:'User Roles', body:'Citizens report disasters with photos and location. Volunteers accept and complete field tasks. Admins manage and analyse everything.' },
  { icon:'📡', title:'API Endpoints', mono:['POST /auth/register','POST /auth/login','POST /report-disaster','GET /disasters','POST /predict-disaster','GET /analytics'] },
  { icon:'🔒', title:'Security', body:'JWT authentication, role-based access control, bcrypt password hashing and rate-limiting on report submissions.' },
];

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>About DisasterAI</h2>
        <p>Building smarter disaster response for India</p>
      </div>
      <div className={styles.grid}>
        {CARDS.map(c => (
          <div key={c.title} className={styles.card}>
            <div className={styles.cardIco}>{c.icon}</div>
            <h3>{c.title}</h3>
            {c.body && <p>{c.body}</p>}
            {c.mono && (
              <div className={styles.mono}>
                {c.mono.map(m => <div key={m}>{m}</div>)}
              </div>
            )}
            {c.tags && (
              <div className={styles.tags}>
                {c.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
