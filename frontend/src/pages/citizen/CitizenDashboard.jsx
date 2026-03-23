import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Card, { MetricCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import IndiaMap from '../../components/map/IndiaMap';
import { useAuth } from '../../context/AuthContext';
import { DISASTERS, TYPE_EMOJI } from '../../utils/data';
import toast from 'react-hot-toast';
import styles from '../Dashboard.module.css';

const SIDEBAR_ITEMS = [
  { id:'overview',  icon:'📊', label:'Dashboard' },
  { id:'report',    icon:'📝', label:'Report Disaster' },
  { id:'myreports', icon:'📋', label:'My Reports', badge: 3 },
  { id:'map',       icon:'🗺', label:'Disaster Map' },
  { id:'profile',   icon:'👤', label:'Profile' },
];

const MY_REPORTS = [
  { type:'Flood',  location:'Hadapsar, Pune', sev:'medium', status:'Resolved', date:'Mar 15', desc:'Waterlogging on main road' },
  { type:'Fire',   location:'Kothrud, Pune',  sev:'high',   status:'Active',   date:'Mar 17', desc:'Building fire on 3rd floor' },
  { type:'Storm',  location:'Baner, Pune',    sev:'low',    status:'Pending',  date:'Mar 19', desc:'Wind damage to power lines' },
];

function Overview({ user }) {
  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Hello, {user.name} 👋</h1>
        <p>Here's what's happening in your area</p>
      </div>

      <div className={styles.metricGrid}>
        <MetricCard label="My Reports"      value="3"   color="var(--accent)" delta="↑ 1 this week" deltaType="up" />
        <MetricCard label="Active Disasters" value="18"  color="var(--red)"    delta="↑ 4 today"    deltaType="down" />
        <MetricCard label="Nearby Alerts"    value="2"   color="var(--amber)"  delta="In your district" deltaType="flat" />
        <MetricCard label="Reports Resolved" value="2/3" color="var(--green)"  delta="Resolved"     deltaType="up" />
      </div>

      <div className={styles.sectionTitle}>⚠ Active Alerts Near You</div>
      {[
        { title:'Flash Flood Warning — Pune District',  sub:'2 hours ago · Stay on higher ground' },
        { title:'Heavy Rainfall Alert — Maharashtra',   sub:'6 hours ago · Red alert in effect'   },
      ].map((a, i) => (
        <div key={i} className={styles.alertItem}>
          <div className={styles.alertDot}></div>
          <div>
            <div className={styles.alertTitle}>{a.title}</div>
            <div className={styles.alertSub}>{a.sub}</div>
          </div>
        </div>
      ))}

      <div className={styles.sectionTitle} style={{ marginTop: 28 }}>Recent Reports</div>
      <Card>
        <table className={styles.table}>
          <thead><tr><th>Type</th><th>Location</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {MY_REPORTS.map((r, i) => (
              <tr key={i}>
                <td>{TYPE_EMOJI[r.type]} {r.type}</td>
                <td>{r.location}</td>
                <td><Badge variant={r.status.toLowerCase()}>{r.status}</Badge></td>
                <td style={{ color:'var(--text2)', fontSize:13 }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function ReportDisaster({ user }) {
  const [form, setForm] = useState({ type:'', severity:'', description:'' });
  const [locSet, setLocSet] = useState(false);

  const submit = () => {
    if (!form.type || !form.severity || !form.description) {
      toast.error('Please fill all required fields'); return;
    }
    toast.success('Disaster reported! AI is analyzing it 🤖');
    setForm({ type:'', severity:'', description:'' });
    setLocSet(false);
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>📝 Report Disaster</h1>
        <p>Our AI will analyze and classify your report instantly</p>
      </div>
      <Card style={{ maxWidth: 620 }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Disaster Type *</label>
          <select className={styles.select} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="">Select type...</option>
            {['Flood','Fire','Earthquake','Cyclone','Landslide','Drought','Other'].map(t => (
              <option key={t} value={t}>{TYPE_EMOJI[t] || '⚠'} {t}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Severity *</label>
          <select className={styles.select} value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
            <option value="">Select severity...</option>
            <option value="high">🔴 High — Immediate danger</option>
            <option value="medium">🟡 Medium — Moderate impact</option>
            <option value="low">🟢 Low — Minor impact</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Location</label>
          <div className={styles.mapPicker} onClick={() => { setLocSet(true); toast.success('Location set: Pune, Maharashtra'); }}>
            <p>{locSet ? '✅ Pune, Maharashtra (selected)' : '📍 Click to set location on map'}</p>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description *</label>
          <textarea
            className={styles.textarea}
            placeholder="Describe the disaster situation, affected area, number of people..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Upload Image</label>
          <div className={styles.uploadZone} onClick={() => document.getElementById('imgInput').click()}>
            <div style={{ fontSize: 28 }}>📷</div>
            <p>Click to upload image (PNG/JPG)</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Up to 10MB</p>
          </div>
          <input type="file" id="imgInput" style={{ display:'none' }} accept="image/*"
            onChange={e => toast.success(`Image uploaded: ${e.target.files[0].name}`)} />
        </div>
        <div style={{ display:'flex', gap: 12 }}>
          <Button variant="primary" onClick={submit}>Submit Report →</Button>
          <Button variant="secondary" onClick={() => { setForm({ type:'', severity:'', description:'' }); setLocSet(false); }}>Clear</Button>
        </div>
      </Card>
    </>
  );
}

function MyReports() {
  return (
    <>
      <div className={styles.pageHeader}><h1>📋 My Reports</h1><p>All your submitted disaster reports</p></div>
      {MY_REPORTS.map((r, i) => (
        <div key={i} className={styles.taskCard}>
          <div className={styles.tcTop}>
            <div>
              <div className={styles.tcTitle}>{TYPE_EMOJI[r.type]} {r.type} — {r.location}</div>
              <div className={styles.tcSub}>{r.date} · {r.desc}</div>
            </div>
            <Badge variant={r.sev}>{r.sev}</Badge>
          </div>
          <Badge variant={r.status.toLowerCase()}>{r.status}</Badge>
        </div>
      ))}
    </>
  );
}

function Profile({ user, onLogout }) {
  const [name, setName] = useState(user.name);
  return (
    <>
      <div className={styles.pageHeader}><h1>👤 Profile</h1></div>
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>{user.name[0]}</div>
        <div>
          <div className={styles.profileName}>{user.name}</div>
          <Badge variant="citizen">Citizen</Badge>
        </div>
        <Button variant="secondary" style={{ marginLeft:'auto' }} onClick={onLogout}>Logout</Button>
      </div>
      <Card style={{ maxWidth: 460 }}>
        <div className={styles.formGroup}><label className={styles.label}>Name</label>
          <input className={styles.input} value={name} onChange={e => setName(e.target.value)} /></div>
        <div className={styles.formGroup}><label className={styles.label}>Email</label>
          <input className={styles.input} value={user.email} disabled /></div>
        <div className={styles.formGroup}><label className={styles.label}>Location</label>
          <input className={styles.input} defaultValue="Pune, Maharashtra" /></div>
        <Button variant="primary" onClick={() => toast.success('Profile saved ✓')}>Save Changes</Button>
      </Card>
    </>
  );
}

export default function CitizenDashboard() {
  const [active, setActive] = useState('overview');
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); window.location.href = '/'; };

  return (
    <div className={styles.layout}>
      <Sidebar items={SIDEBAR_ITEMS} active={active} onSelect={setActive} />
      <div className={styles.content}>
        {active === 'overview'  && <Overview user={user} />}
        {active === 'report'    && <ReportDisaster user={user} />}
        {active === 'myreports' && <MyReports />}
        {active === 'map'       && (
          <><div className={styles.pageHeader}><h1>🗺 Disaster Map</h1></div>
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
            <IndiaMap />
          </div></>
        )}
        {active === 'profile'   && <Profile user={user} onLogout={handleLogout} />}
      </div>
    </div>
  );
}
