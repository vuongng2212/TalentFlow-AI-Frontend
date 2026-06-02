'use client';

import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/api/user.service';
import { User } from '../../../types';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/badge';

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers({ limit: 50 });
      setUsers(res.data);
    } catch (e) {
      console.error('Failed to load team', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          Workspace / <strong>Team Directory</strong>
        </div>
        <button className="btn primary" onClick={() => alert('Invite flow to be implemented')} style={{ cursor: 'pointer' }}>
          Invite Member
        </button>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">Team Directory</h1>
            <p>Manage workspace members and their roles.</p>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : users.length > 0 ? (
          <div className="card overflow-hidden">
            <div className="table-wrap">
              <table className="density-tight">
                <thead>
                  <tr className="bg-surface-2/50 border-b border-border">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="group cursor-pointer">
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar sm w-6 h-6 text-[10px]">{user.fullName?.charAt(0) || '?'}</div>
                          <span className="font-bold text-text-1 group-hover:text-primary transition-colors">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="text-text-2">{user.email}</td>
                      <td>
                        <Badge variant={user.role === 'ADMIN' ? 'offer' : 'interview'}>{user.role}</Badge>
                      </td>
                      <td className="text-text-4 font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No team members found"
            description="Invite colleagues to collaborate on hiring."
            action={{ label: 'Invite Member', onClick: () => alert('Invite flow to be implemented') }}
          />
        )}
      </section>
    </>
  );
}