import React from 'react';
import styles from './Card.module.css';

export default function Card({ children, className = '', style, hover }) {
  return (
    <div className={`${styles.card} ${hover ? styles.hover : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function MetricCard({ label, value, delta, deltaType, color }) {
  return (
    <div className={styles.metric}>
      <span className={styles.mLabel}>{label}</span>
      <span className={styles.mValue} style={{ color: color || 'var(--accent)' }}>{value}</span>
      {delta && (
        <span className={`${styles.mDelta} ${styles[deltaType]}`}>{delta}</span>
      )}
    </div>
  );
}
