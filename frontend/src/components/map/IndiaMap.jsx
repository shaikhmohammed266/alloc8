import React, { useEffect, useRef } from 'react';
import { DISASTERS, SEV_COLOR, TYPE_EMOJI } from '../../utils/data';
import styles from './IndiaMap.module.css';

export default function IndiaMap({ onMarkerClick }) {
  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 580 620" xmlns="http://www.w3.org/2000/svg">
        {/* India outline */}
        <path
          d="M160,30L180,25L210,30L240,20L280,22L310,18L340,30L370,25L400,40L420,35L440,55L450,80L445,110L460,130L470,155L460,180L475,200L480,230L470,255L480,280L470,310L460,330L450,360L440,385L425,410L410,430L395,455L375,475L355,490L335,510L315,525L295,535L280,545L265,535L250,520L230,505L215,485L200,460L185,440L170,415L160,390L150,365L145,340L140,315L135,290L138,265L130,240L128,215L135,190L128,165L130,140L138,115L142,90L148,65L155,45Z"
          className={styles.mapFill}
        />
        {/* State grid lines */}
        <path
          d="M160,150L440,150M160,250L470,250M160,350L450,350M200,30L200,545M290,20L290,545M380,30L380,500"
          className={styles.mapLine}
        />
        {/* Disaster markers */}
        {DISASTERS.map((d, i) => (
          <DisasterMarker
            key={d.id}
            disaster={d}
            index={i}
            onClick={onMarkerClick}
          />
        ))}
      </svg>
    </div>
  );
}

function DisasterMarker({ disaster, index, onClick }) {
  const col = SEV_COLOR[disaster.severity];
  return (
    <g
      className={styles.marker}
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={() => onClick && onClick(disaster)}
    >
      <circle cx={disaster.x} cy={disaster.y} r="18" fill={col} opacity="0.10" className={styles.ring} />
      <circle cx={disaster.x} cy={disaster.y} r="10" fill={col} opacity="0.20" />
      <circle cx={disaster.x} cy={disaster.y} r="5.5" fill={col} />
      <title>{TYPE_EMOJI[disaster.type]} {disaster.type} — {disaster.location} ({disaster.severity})</title>
    </g>
  );
}
