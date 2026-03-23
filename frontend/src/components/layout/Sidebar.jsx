import React from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ items, active, onSelect }) {
  return (
    <aside className={styles.sidebar}>
      {items.map(item => (
        <button
          key={item.id}
          className={`${styles.item} ${active === item.id ? styles.on : ''}`}
          onClick={() => onSelect(item.id)}
        >
          <span className={styles.ico}>{item.icon}</span>
          <span>{item.label}</span>
          {item.badge && <span className={styles.badge}>{item.badge}</span>}
        </button>
      ))}
    </aside>
  );
}
