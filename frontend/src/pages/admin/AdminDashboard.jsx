import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Card, { MetricCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Charts from '../../components/charts/Charts';
import { useAuth } from '../../context/AuthContext';
import { DISASTERS, USERS_LIST, TYPE_EMOJI, predictText, predictResources } from '../../utils/data';
import toast from 'react-hot-toast';
import styles from '../Dashboard.module.css';

const SIDEBAR_ITEMS = [
  { id:'overview',  icon:'📊', label:'Overview' },
  { id:'reports',   icon:'📋', label:'All Reports', badge: 7 },
  { id:'users',     icon:'👥', label:'Users' },
  { id:'analytics', icon:'📈', label:'Analytics' },
  { id:'ml',        icon:'🤖', label:'ML Predictor' },
  { id:'settings',  icon:'⚙',  label:'Settings' },
];

function MLPredictor() {
  const [text, setText] = useState('');
  const [textResult, setTextResult] = useState(null);
  const [resType, setResType] = useState('flood');
  const [resSev,  setResSev]  = useState('high');
  const [resResult, setResResult] = useState(null);

  const runText = () => {
    if (!text.trim()) { toast.error('Please enter some text'); return; }
    setTimeout(() => setTextResult(predictText(text)), 500);
  };
  const runRes = () => setResResult(predictResources(resType, resSev));

  return (
    <>
      <div className={styles.pageHeader}><h1>🤖 ML Predictor</h1><p>AI disaster classification (dummy mode)</p></div>
      <div className={styles.mlGrid}>
        <Card>
          <div className={styles.sectionTitle}>Text Classification</div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Enter tweet or report text</label>
            <textarea className={styles.textarea} value={text} onChange={e => setText(e.target.value)}
              placeholder="e.g. Heavy flooding in Assam, thousands displaced..." />
          </div>
          <Button variant="primary" onClick={runText}>Run Prediction →</Button>
          {textResult && (
            <div className={styles.mlResult}>
              <div className={styles.mlResultTitle}>🤖 Result</div>
              <div className={styles.mlResultRow}>
                Category: <strong style={{ color: textResult.isDisaster ? 'var(--red)' : 'var(--green)' }}>{textResult.type}</strong>
              </div>
              <div className={styles.mlResultRow}>
                Confidence: <strong style={{ color:'var(--amber)' }}>{textResult.confidence}%</strong>
              </div>
              <div className={styles.mlNote}>⚠ Dummy — real ML model coming soon</div>
            </div>
          )}
        </Card>

        <Card>
          <div className={styles.sectionTitle}>Resource Prediction</div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Disaster Type</label>
            <select className={styles.select} value={resType} onChange={e => setResType(e.target.value)}>
              {['flood','fire','earthquake','cyclone'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Severity</label>
            <select className={styles.select} value={resSev} onChange={e => setResSev(e.target.value)}>
              {['high','medium','low'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
          <Button variant="primary" onClick={runRes}>Predict Resources →</Button>
          {resResult && (
            <div className={styles.mlResult}>
              <div className={styles.mlResultTitle}>📦 Predicted Resources</div>
              <div className={styles.resGrid}>
                <div className={styles.resItem}><div className={styles.resVal} style={{ color:'var(--accent)' }}>{resResult.food}</div><div className={styles.resLbl}>Food Kits</div></div>
                <div className={styles.resItem}><div className={styles.resVal} style={{ color:'var(--red)' }}>{resResult.medical}</div><div className={styles.resLbl}>Medical Kits</div></div>
                <div className={styles.resItem}><div className={styles.resVal} style={{ color:'var(--green)' }}>{resResult.shelters}</div><div className={styles.resLbl}>Shelters</div></div>
              </div>
              <div className={styles.mlNote}>⚠ Dummy — real ML model coming soon</div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const [active, setActive]   = useState('overview');
  const [disasters, setDisasters] = useState(DISASTERS);
  const { user, logout } = useAuth();
  const handleLogout = () => { logout(); window.location.href = '/'; };

  const approve = (id) => { setDisasters(ds => ds.map(d => d.id===id ? {...d, status:'Resolved'} : d)); toast.success('Report resolved ✓'); };
  const remove  = (id) => { setDisasters(ds => ds.filter(d => d.id!==id)); toast.error('Report deleted'); };

  return (
    <div className={styles.layout}>
      <Sidebar items={SIDEBAR_ITEMS} active={active} onSelect={setActive} />
      <div className={styles.content}>

        {active === 'overview' && (
          <>
            <div className={styles.pageHeader}><h1>Admin Overview 🛡</h1><p>Platform-wide disaster management</p></div>
            <div className={styles.metricGrid}>
              <MetricCard label="Total Reports"   value="247"   color="var(--accent)" delta="↑ 12 today"    deltaType="up" />
              <MetricCard label="Active Disasters" value="18"   color="var(--red)"    delta="↑ 4 new"       deltaType="down" />
              <MetricCard label="Users"            value="1,682" color="var(--green)" delta="↑ 38 this week" deltaType="up" />
              <MetricCard label="Pending Review"   value="7"    color="var(--amber)"  delta="Needs action"   deltaType="flat" />
            </div>
            <div className={styles.grid2}>
              <Card>
                <div className={styles.sectionTitle}>Quick Actions</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[['📋','Review Pending Reports','reports'],['👥','Manage Users','users'],['📈','Analytics','analytics'],['🤖','ML Predictor','ml']].map(([ico,lbl,id]) => (
                    <Button key={id} variant="secondary" style={{ justifyContent:'flex-start' }} onClick={() => setActive(id)}>{ico} {lbl}</Button>
                  ))}
                </div>
              </Card>
              <Card>
                <div className={styles.sectionTitle}>Recent Activity</div>
                {[['var(--red)','New flood report — Mumbai','2 min ago'],['var(--green)','Report resolved — Chennai','15 min ago'],['var(--amber)','New volunteer registered','1 hr ago'],['var(--accent)','Resources allocated — Assam','2 hr ago']].map(([c,t,s],i) => (
                  <div key={i} style={{ display:'flex', gap:10, fontSize:13, marginBottom:10 }}>
                    <span style={{ color:c, flexShrink:0 }}>●</span>
                    <div><b>{t}</b> · <span style={{ color:'var(--text2)' }}>{s}</span></div>
                  </div>
                ))}
              </Card>
            </div>
          </>
        )}

        {active === 'reports' && (
          <>
            <div className={styles.pageHeader} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div><h1>📋 All Reports</h1><p>Manage and moderate disaster reports</p></div>
              <Button variant="secondary" size="sm">Export CSV</Button>
            </div>
            <Card>
              <table className={styles.table}>
                <thead><tr><th>ID</th><th>Type</th><th>Location</th><th>Severity</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {disasters.map(d => (
                    <tr key={d.id}>
                      <td><span className={styles.mono}>#{String(d.id).padStart(3,'0')}</span></td>
                      <td>{TYPE_EMOJI[d.type]} {d.type}</td>
                      <td style={{ fontSize:13 }}>{d.location}</td>
                      <td><Badge variant={d.severity}>{d.severity}</Badge></td>
                      <td style={{ color:'var(--text2)', fontSize:13 }}>{d.date}</td>
                      <td><Badge variant={d.status.toLowerCase()}>{d.status}</Badge></td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <Button variant="success" size="sm" onClick={() => approve(d.id)}>✓ Resolve</Button>
                          <Button variant="danger"  size="sm" onClick={() => remove(d.id)}>✕ Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {active === 'users' && (
          <>
            <div className={styles.pageHeader}><h1>👥 User Management</h1></div>
            <Card>
              {USERS_LIST.map(u => (
                <div key={u.id} className={styles.userRow}>
                  <div className={styles.uAvatar}>{u.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{u.name}</div>
                    <div style={{ fontSize:12, color:'var(--text2)' }}>{u.email} · Joined {u.joined}</div>
                  </div>
                  <Badge variant={u.role}>{u.role}</Badge>
                  {u.reports > 0 && <span style={{ fontSize:13, color:'var(--text2)' }}>{u.reports} reports</span>}
                  <Button variant="danger" size="sm" onClick={() => toast.error('User removed')}>Remove</Button>
                </div>
              ))}
            </Card>
          </>
        )}

        {active === 'analytics' && (
          <>
            <div className={styles.pageHeader}><h1>📈 Analytics</h1><p>Platform-wide disaster statistics</p></div>
            <Charts />
          </>
        )}

        {active === 'ml' && <MLPredictor />}

        {active === 'settings' && (
          <>
            <div className={styles.pageHeader}><h1>⚙ Settings</h1></div>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>{user?.name[0]}</div>
              <div><div className={styles.profileName}>{user?.name}</div><Badge variant="admin">Admin</Badge></div>
              <Button variant="secondary" style={{ marginLeft:'auto' }} onClick={handleLogout}>Logout</Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
