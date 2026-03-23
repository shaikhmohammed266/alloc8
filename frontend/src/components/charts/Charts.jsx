import React from 'react';
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import Card from '../ui/Card';
import styles from './Charts.module.css';

const freqData = [
  { month:'Oct', reports:28 },
  { month:'Nov', reports:35 },
  { month:'Dec', reports:22 },
  { month:'Jan', reports:41 },
  { month:'Feb', reports:38 },
  { month:'Mar', reports:53 },
];

const typeData = [
  { name:'Flood', value:38 },
  { name:'Fire', value:22 },
  { name:'Earthquake', value:15 },
  { name:'Cyclone', value:18 },
  { name:'Other', value:7 },
];

const sevData = [
  { name:'High', count:68 },
  { name:'Medium', count:112 },
  { name:'Low', count:67 },
];

const resData = [
  { month:'Oct', food:120, medical:80, shelters:30 },
  { month:'Nov', food:180, medical:110, shelters:45 },
  { month:'Dec', food:90,  medical:65,  shelters:20 },
  { month:'Jan', food:240, medical:160, shelters:60 },
  { month:'Feb', food:210, medical:145, shelters:55 },
  { month:'Mar', food:310, medical:195, shelters:80 },
];

const PIE_COLORS = ['#4f7cff','#ff4f6d','#ffb347','#2dd4bf','#3dd68c'];
const SEV_COLORS = ['#ff4f6d','#ffb347','#3dd68c'];

const axisStyle  = { fill:'var(--text2)', fontSize:12 };
const gridStyle  = { stroke:'var(--border)', strokeOpacity:0.7 };
const ttStyle    = { background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text)' };

export default function Charts() {
  return (
    <div className={styles.grid}>

      <Card>
        <h3 className={styles.chartTitle}>Disaster Frequency (Monthly)</h3>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={freqData}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis dataKey="month" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={ttStyle} />
            <Bar dataKey="reports" fill="var(--accent)" radius={[5,5,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className={styles.chartTitle}>Disaster Types</h3>
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie data={typeData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
              dataKey="value" paddingAngle={4}>
              {typeData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={ttStyle} />
            <Legend
              formatter={(value) => <span style={{ color:'var(--text2)', fontSize:12 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className={styles.chartTitle}>Severity Distribution</h3>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={sevData}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis dataKey="name" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={ttStyle} />
            <Bar dataKey="count" radius={[6,6,0,0]}>
              {sevData.map((_, i) => <Cell key={i} fill={SEV_COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className={styles.chartTitle}>Resource Demand</h3>
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={resData}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis dataKey="month" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={ttStyle} />
            <Legend formatter={(v) => <span style={{ color:'var(--text2)', fontSize:12 }}>{v}</span>} />
            <Line type="monotone" dataKey="food"     stroke="#4f7cff" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="medical"  stroke="#2dd4bf" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="shelters" stroke="#3dd68c" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

    </div>
  );
}
