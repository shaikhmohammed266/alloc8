// ============================================================
//  Mock data – replace fetch calls with real API endpoints
// ============================================================

export const DISASTERS = [
  { id:1, type:'Flood',      location:'Mumbai, Maharashtra',   severity:'high',   status:'Active',   x:270, y:258, date:'Mar 17' },
  { id:2, type:'Fire',       location:'Delhi, NCR',            severity:'high',   status:'Active',   x:232, y:148, date:'Mar 18' },
  { id:3, type:'Earthquake', location:'Chennai, Tamil Nadu',   severity:'medium', status:'Resolved', x:298, y:413, date:'Mar 15' },
  { id:4, type:'Cyclone',    location:'Bhubaneswar, Odisha',   severity:'high',   status:'Active',   x:348, y:293, date:'Mar 19' },
  { id:5, type:'Flood',      location:'Guwahati, Assam',       severity:'medium', status:'Active',   x:412, y:153, date:'Mar 16' },
  { id:6, type:'Landslide',  location:'Shimla, HP',            severity:'low',    status:'Resolved', x:208, y:114, date:'Mar 14' },
  { id:7, type:'Drought',    location:'Jaipur, Rajasthan',     severity:'medium', status:'Pending',  x:192, y:208, date:'Mar 13' },
  { id:8, type:'Fire',       location:'Kolkata, WB',           severity:'low',    status:'Active',   x:382, y:228, date:'Mar 17' },
];

export const TASKS = [
  { id:1, title:'Food Distribution',  location:'Kothrud, Pune',      type:'Flood',   km:'2km',  people:150, status:'available', progress:0  },
  { id:2, title:'Medical Aid',        location:'Hadapsar, Pune',     type:'Fire',    km:'5km',  people:80,  status:'available', progress:0  },
  { id:3, title:'Shelter Setup',      location:'Baner, Pune',        type:'Storm',   km:'8km',  people:200, status:'accepted',  progress:40 },
  { id:4, title:'Search & Rescue',    location:'Viman Nagar, Pune',  type:'Flood',   km:'12km', people:50,  status:'available', progress:0  },
  { id:5, title:'Supply Delivery',    location:'Magarpatta, Pune',   type:'Cyclone', km:'6km',  people:320, status:'available', progress:0  },
];

export const USERS_LIST = [
  { id:1, name:'Admin User',   email:'admin@demo.com',     role:'admin',    reports:0, joined:'Jan 2024' },
  { id:2, name:'Priya Sharma', email:'citizen@demo.com',   role:'citizen',  reports:3, joined:'Feb 2024' },
  { id:3, name:'Rahul Mehta',  email:'volunteer@demo.com', role:'volunteer',reports:0, joined:'Feb 2024' },
  { id:4, name:'Anjali Singh', email:'anjali@demo.com',    role:'citizen',  reports:5, joined:'Mar 2024' },
  { id:5, name:'Karan Patel',  email:'karan@demo.com',     role:'volunteer',reports:0, joined:'Mar 2024' },
];

export const TYPE_EMOJI = {
  Flood:'🌊', Fire:'🔥', Earthquake:'🌍', Cyclone:'🌀',
  Landslide:'⛰', Drought:'☀', Storm:'⛈', Other:'⚠',
};

export const SEV_COLOR = {
  high: '#ff4f6d',
  medium: '#ffb347',
  low: '#3dd68c',
};

// Dummy ML predictions
export const predictText = (text) => {
  const keywords = /flood|fire|quake|cyclone|rain|damage|rescue|help|emergency/i;
  const isDisaster = keywords.test(text);
  const types = ['Flood', 'Fire', 'Earthquake', 'Cyclone'];
  return {
    isDisaster,
    type: isDisaster ? types[Math.floor(Math.random() * types.length)] : 'Non-disaster',
    confidence: (75 + Math.random() * 20).toFixed(1),
  };
};

export const predictResources = (type, severity) => {
  const mult = severity === 'high' ? 3 : severity === 'medium' ? 2 : 1;
  const base = {
    flood:{ food:500, medical:200, shelters:100 },
    fire: { food:200, medical:150, shelters:50  },
    earthquake:{ food:800, medical:400, shelters:200 },
    cyclone:{ food:600, medical:300, shelters:150 },
  };
  const b = base[type] || base.flood;
  return { food: b.food*mult, medical: b.medical*mult, shelters: b.shelters*mult };
};
