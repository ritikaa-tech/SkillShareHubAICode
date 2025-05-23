import React from 'react';
import UserTable from '../components/admin/UserTable';
import AdminStats from '../components/admin/AdminStats';

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <AdminStats />
      <h2 className="text-xl font-semibold mt-8">Manage Users</h2>
      <UserTable />
    </div>
  );
};

export default AdminDashboard;
