import React from 'react';
import styles from './Button.module.css';

export default function Button({
  children, variant = 'primary', size = 'md',
  onClick, type = 'button', fullWidth, disabled, style
}) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.full : '',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
