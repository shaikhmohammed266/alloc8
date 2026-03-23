import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IndiaMap from '../components/map/IndiaMap';
import { TYPE_EMOJI, DISASTERS } from '../utils/data';
import styles from './Home.module.css';

function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 30);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.round(start));
      if (start >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

function StatCard({ label, value, color, suffix = '' }) {
  const count = useCounter(parseInt(value));
  return (
    <div className={styles.statCard}>
      <div className={styles.statNum} style={{ color }}>{count.toLocaleString()}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function MarkerTooltip({ disaster, onClose }) {
  if (!disaster) return null;
  return (
    <div className={styles.tooltip}>
      <button className={styles.tooltipClose} onClick={onClose}>✕</button>
      <div className={styles.tooltipIcon}>{TYPE_EMOJI[disaster.type]}</div>
      <div className={styles.tooltipType}>{disaster.type}</div>
      <div className={styles.tooltipLoc}>{disaster.location}</div>
      <div className={styles.tooltipMeta}>
        <span className={`${styles.tooltipSev} ${styles[disaster.severity]}`}>{disaster.severity}</span>
        <span className={`${styles.tooltipSta} ${styles['sta_' + disaster.status.toLowerCase()]}`}>{disaster.status}</span>
      </div>
    </div>
  );
}

export default function Home({ onLoginClick }) {
  const navigate = useNavigate();
  const [activeMarker, setActiveMarker] = useState(null);

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}></div>
        <div className={styles.heroGlow}></div>

        <div className={`${styles.liveBadge} anim-fade-up`}>
          <span className={styles.pulseDot}></span>
          Live disaster monitoring · India
        </div>

        <h1 className={`${styles.heroTitle} anim-fade-up delay-1`}>
          AI <span className={styles.grad}>Disaster Resource</span><br />Allocation Platform
        </h1>

        <p className={`${styles.heroSub} anim-fade-up delay-2`}>
          Real-time disaster detection, citizen reporting and intelligent<br />
          resource allocation powered by machine learning.
        </p>

        <div className={`${styles.heroBtns} anim-fade-up delay-3`}>
          <button className={styles.btnPrimary} onClick={() => navigate('/map')}>
            🗺 View Disaster Map
          </button>
          <button className={styles.btnOutline} onClick={onLoginClick}>
            Report Disaster
          </button>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className={styles.statsStrip}>
        <StatCard label="Total Disasters"    value={247}  color="var(--accent)" />
        <StatCard label="Active Emergencies" value={18}   color="var(--red)" />
        <StatCard label="Volunteers"         value={1340} color="var(--green)" />
        <StatCard label="Response Rate"      value={89}   color="var(--amber)" suffix="%" />
      </div>

      {/* ── MAP ── */}
      <section className={styles.mapSection}>
        <div className={styles.secHeader}>
          <h2>🇮🇳 Live Disaster Map</h2>
          <p>Current disaster events across India — click any marker for details</p>
        </div>
        <div className={styles.mapCard}>
          <div className={styles.mapBar}>
            <span className={styles.barLabel}>Severity:</span>
            <div className={styles.legend}>
              <span><span className={styles.dot} style={{ background:'var(--red)' }}></span>High</span>
              <span><span className={styles.dot} style={{ background:'var(--amber)' }}></span>Medium</span>
              <span><span className={styles.dot} style={{ background:'var(--green)' }}></span>Low</span>
            </div>
            <span className={styles.barCount}>{DISASTERS.filter(d => d.status === 'Active').length} active</span>
          </div>
          <div style={{ position: 'relative' }}>
            <IndiaMap onMarkerClick={setActiveMarker} />
            {activeMarker && (
              <div className={styles.tooltipWrap}>
                <MarkerTooltip disaster={activeMarker} onClose={() => setActiveMarker(null)} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.howSection}>
        <div className={styles.secHeader}>
          <h2>How It Works</h2>
          <p>Three simple steps from disaster report to resource allocation</p>
        </div>
        <div className={styles.stepsGrid}>
          {[
            { num:'01', icon:'📡', bg:'rgba(79,124,255,.15)', title:'Report Disaster',
              desc:'Citizens submit reports with location, images and severity. AI validates authenticity in real-time.' },
            { num:'02', icon:'🤖', bg:'rgba(124,79,255,.15)', title:'AI Detection',
              desc:'ML models classify disaster type, estimate severity and predict resource requirements automatically.' },
            { num:'03', icon:'🚑', bg:'rgba(45,212,191,.15)', title:'Help Allocated',
              desc:'Food, medical kits and shelters are allocated optimally. Volunteers dispatched to affected zones.' },
          ].map(s => (
            <div key={s.num} className={styles.stepCard}>
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepIco} style={{ background: s.bg }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
