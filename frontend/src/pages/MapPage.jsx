import React, { useState } from 'react';
import IndiaMap from '../components/map/IndiaMap';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { DISASTERS, TYPE_EMOJI } from '../utils/data';
import styles from './MapPage.module.css';

export default function MapPage() {
  const [selected, setSelected] = useState(null);
  const active = DISASTERS.filter(d => d.status === 'Active');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>🗺 Disaster Map</h1>
        <p>Real-time disaster locations across India</p>
      </div>

      <div className={styles.layout}>
        {/* Map */}
        <div className={styles.mapWrap}>
          <div className={styles.mapCard}>
            <div className={styles.mapBar}>
              <div className={styles.legend}>
                {[['var(--red)','High'],['var(--amber)','Medium'],['var(--green)','Low']].map(([c,l]) => (
                  <span key={l} className={styles.legItem}>
                    <span className={styles.dot} style={{ background: c }}></span>{l}
                  </span>
                ))}
              </div>
            </div>
            <IndiaMap onMarkerClick={setSelected} />
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {selected && (
            <Card style={{ marginBottom: 16, borderColor: 'var(--accent)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontSize: 28 }}>{TYPE_EMOJI[selected.type]}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>{selected.type}</div>
                  <div style={{ color:'var(--text2)', fontSize: 13, marginTop: 2 }}>{selected.location}</div>
                </div>
                <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
              </div>
              <div style={{ display:'flex', gap: 8, marginTop: 12 }}>
                <Badge variant={selected.severity}>{selected.severity}</Badge>
                <Badge variant={selected.status.toLowerCase()}>{selected.status}</Badge>
              </div>
              <div style={{ fontSize: 13, color:'var(--text2)', marginTop: 8 }}>Reported: {selected.date}</div>
            </Card>
          )}

          <Card>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>
              Active Disasters <span style={{ color:'var(--red)', fontFamily:'monospace' }}>({active.length})</span>
            </div>
            <div className={styles.dList}>
              {active.map(d => (
                <div key={d.id} className={`${styles.dItem} ${selected?.id === d.id ? styles.dItemActive : ''}`}
                  onClick={() => setSelected(d)}>
                  <span style={{ fontSize: 20 }}>{TYPE_EMOJI[d.type]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{d.type}</div>
                    <div style={{ fontSize: 12, color:'var(--text2)' }}>{d.location}</div>
                  </div>
                  <Badge variant={d.severity}>{d.severity}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <div className={styles.aiCard}>
            <div className={styles.aiTitle}>🤖 AI Prediction</div>
            <p>High flood risk detected in coastal Odisha and Kerala over the next 48 hours based on current weather patterns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
