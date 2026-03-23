import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CitizenDashboard   from './citizen/CitizenDashboard';
import VolunteerDashboard from './volunteer/VolunteerDashboard';
import AdminDashboard     from './admin/AdminDashboard';

export default function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'admin')     return <AdminDashboard />;
  if (user.role === 'volunteer') return <VolunteerDashboard />;
  return <CitizenDashboard />;
}
