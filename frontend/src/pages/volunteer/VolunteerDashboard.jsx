import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Card, { MetricCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import IndiaMap from '../../components/map/IndiaMap';
import { useAuth } from '../../context/AuthContext';
import { TASKS } from '../../utils/data';
import toast from 'react-hot-toast';
import styles from '../Dashboard.module.css';

const SIDEBAR_ITEMS = [
  { id:'overview', icon:'📊', label:'Dashboard' },
  { id:'tasks',    icon:'✅', label:'Available Tasks', badge: 4 },
  { id:'mine',     icon:'🔄', label:'My Tasks' },
  { id:'map',      icon:'🗺', label:'Map View' },
  { id:'profile',  icon:'👤', label:'Profile' },
];

export default function VolunteerDashboard() {
  const [active, setActive] = useState('overview');
  const [tasks, setTasks]   = useState(TASKS);
  const { user, logout }    = useAuth();

  const handleLogout = () => { logout(); window.location.href = '/'; };

  const accept = (id) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status:'accepted' } : t));
    toast.success('Task accepted! 🚑');
  };

  const update = (id) => {
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t;
      const prog = Math.min(100, t.progress + 25);
      if (prog === 100) toast.success('Task completed! Great work 🎉');
      else toast.success(`Progress updated: ${prog}%`);
      return { ...t, progress: prog, status: prog === 100 ? 'completed' : t.status };
    }));
  };

  const available = tasks.filter(t => t.status === 'available');
  const mine      = tasks.filter(t => t.status === 'accepted');

  return (
    <div className={styles.layout}>
      <Sidebar items={SIDEBAR_ITEMS} active={active} onSelect={setActive} />
      <div className={styles.content}>

        {active === 'overview' && (
          <>
            <div className={styles.pageHeader}>
              <h1>Hello, {user.name} 🚑</h1>
              <p>You're making a difference — keep going!</p>
            </div>
            <div className={styles.metricGrid}>
              <MetricCard label="Tasks Completed" value="14"  color="var(--green)" delta="All time"   deltaType="up" />
              <MetricCard label="Active Task"      value="1"   color="var(--accent)" delta="In progress" deltaType="flat" />
              <MetricCard label="People Helped"    value="230" color="var(--amber)"  delta="Estimated"   deltaType="up" />
              <MetricCard label="Response Rate"    value="92%" color="var(--teal)"   delta="Top 10%"     deltaType="up" />
            </div>
            <div className={styles.successAlert}>
              <div className={styles.greenDot}></div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, color:'var(--green)' }}>New Task Available</div>
                <div style={{ fontSize:13, color:'var(--text2)', marginTop:2 }}>Food distribution in Kothrud — 2km away</div>
              </div>
              <Button variant="success" size="sm" onClick={() => setActive('tasks')}>View →</Button>
            </div>
          </>
        )}

        {active === 'tasks' && (
          <>
            <div className={styles.pageHeader}><h1>✅ Available Tasks</h1><p>Tasks waiting for a volunteer</p></div>
            {available.length === 0 && <div style={{ color:'var(--text2)', padding:16 }}>No available tasks right now.</div>}
            {available.map(t => (
              <div key={t.id} className={styles.taskCard}>
                <div className={styles.tcTop}>
                  <div>
                    <div className={styles.tcTitle}>🚨 {t.title}</div>
                    <div className={styles.tcSub}>📍 {t.location} · {t.km} away</div>
                  </div>
                  <Badge variant={t.type === 'Flood' || t.type === 'Fire' ? 'high' : 'medium'}>{t.type}</Badge>
                </div>
                <div style={{ fontSize:13, color:'var(--text2)', marginBottom:10 }}>👥 {t.people} people affected</div>
                <Button variant="success" size="sm" onClick={() => accept(t.id)}>Accept Task →</Button>
              </div>
            ))}
          </>
        )}

        {active === 'mine' && (
          <>
            <div className={styles.pageHeader}><h1>🔄 My Tasks</h1><p>Tasks you have accepted</p></div>
            {mine.length === 0 && <div style={{ color:'var(--text2)', padding:16 }}>No accepted tasks yet.</div>}
            {mine.map(t => (
              <div key={t.id} className={styles.taskCard}>
                <div className={styles.tcTop}>
                  <div>
                    <div className={styles.tcTitle}>🔄 {t.title}</div>
                    <div className={styles.tcSub}>📍 {t.location}</div>
                  </div>
                  <Badge variant="active">In Progress</Badge>
                </div>
                <div className={styles.progBar}>
                  <div className={styles.progFill} style={{ width: `${t.progress}%` }}></div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:13, color:'var(--text2)' }}>{t.progress}% complete</span>
                  <Button variant="primary" size="sm" onClick={() => update(t.id)}>Update +25% →</Button>
                </div>
              </div>
            ))}
          </>
        )}

        {active === 'map' && (
          <>
            <div className={styles.pageHeader}><h1>🗺 Disaster Locations</h1></div>
            <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
              <IndiaMap />
            </div>
          </>
        )}

        {active === 'profile' && (
          <>
            <div className={styles.pageHeader}><h1>👤 Profile</h1></div>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>{user.name[0]}</div>
              <div>
                <div className={styles.profileName}>{user.name}</div>
                <Badge variant="volunteer">Volunteer</Badge>
              </div>
              <Button variant="secondary" style={{ marginLeft:'auto' }} onClick={handleLogout}>Logout</Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
