'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RoleGuard } from '../../../../components/features/workspace/RoleGuard';
import Badge, { BadgeProps } from '../../../../components/ui/badge';
import Modal from '../../../../components/ui/dialog/Modal';
import LoadingSkeleton from '../../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../../components/ui/EmptyState';
import { userService } from '../../../../services/api/user.service';
import { User, SystemRole } from '../../../../types';
import { useUIStore } from '../../../../lib/store/useUIStore';
import { useMinDuration } from '../../../../hooks/useMinDuration';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import { toast } from 'sonner';

const ROLE_OPTIONS: SystemRole[] = ['ADMIN', 'RECRUITER', 'INTERVIEWER'];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Role Edit Modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<SystemRole>('RECRUITER');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Delete User Modal
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 250);
  const { start: startMinDuration, end: endMinDuration } = useMinDuration();
  const { showLoading, hideLoading } = useUIStore();

  const loadUsers = useCallback(
    async (isBackground = false) => {
      if (!isBackground) {
        startMinDuration();
        setLoading(true);
      }
      try {
        const queryRole = roleFilter === 'all' ? undefined : roleFilter;
        const res = await userService.getUsers({
          search: debouncedSearch || undefined,
          role: queryRole,
          page,
          limit: 10,
        });
        setUsers(res.data);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalUsers(res.meta?.total || res.data.length);
      } catch (err) {
        console.error('Failed to load users', err);
        toast.error('Failed to load users');
      } finally {
        if (!isBackground) {
          endMinDuration(() => setLoading(false));
        }
      }
    },
    [debouncedSearch, roleFilter, page, startMinDuration, endMinDuration]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, [loadUsers]);

  const handleOpenRoleModal = (user: User) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    setIsUpdatingRole(true);
    showLoading('Updating user role...');
    try {
      await userService.updateUserRole(editingUser.id, selectedRole);
      toast.success(`Role updated to ${selectedRole} for ${editingUser.fullName}`);
      setEditingUser(null);
      await loadUsers(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e.response?.data?.message || e.message || 'Failed to update role');
    } finally {
      hideLoading();
      setIsUpdatingRole(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    showLoading('Deleting user...');
    try {
      await userService.deleteUser(deletingUser.id);
      toast.success(`User ${deletingUser.fullName} deleted successfully`);
      setDeletingUser(null);
      await loadUsers(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e.response?.data?.message || e.message || 'Failed to delete user');
    } finally {
      hideLoading();
      setIsDeleting(false);
    }
  };

  const getRoleBadgeVariant = (role: string): BadgeProps['variant'] => {
    switch (role) {
      case 'ADMIN':
        return 'rejected';
      case 'RECRUITER':
        return 'interview';
      case 'INTERVIEWER':
        return 'screening';
      default:
        return 'applied';
    }
  };

  return (
    <RoleGuard>
      <header className="topbar bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="crumb text-slate-500 dark:text-zinc-400">
          Admin <span className="text-slate-300 dark:text-zinc-600 mx-1">/</span> <strong className="text-slate-900 dark:text-zinc-50 font-bold">User Management</strong>
        </div>
        <div className="text-xs text-slate-500 dark:text-zinc-400">
          Total users: <span className="font-semibold text-slate-800 dark:text-zinc-200">{totalUsers}</span>
        </div>
      </header>

      <section className="content">
        <div className="page-head">
          <div>
            <h1 className="text-2xl font-bold">User Governance</h1>
            <p>Govern platform-wide access, system roles, and account permissions.</p>
          </div>
        </div>

        <div className="toolbar flex flex-col sm:flex-row gap-3">
          <input
            className="input flex-1"
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="select animate-none sm:w-48"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="RECRUITER">Recruiter</option>
            <option value="INTERVIEWER">Interviewer</option>
          </select>
        </div>

        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : users.length > 0 ? (
          <div className="card pad">
            <div className="table-wrap overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 text-left text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    <th className="pb-3 px-3">User</th>
                    <th className="pb-3 px-3">System Role</th>
                    <th className="pb-3 px-3">Active Workspace</th>
                    <th className="pb-3 px-3">Joined Date</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-zinc-100">{u.fullName}</div>
                        <div className="text-xs text-slate-500 dark:text-zinc-400">{u.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={getRoleBadgeVariant(u.role)}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-600 dark:text-zinc-400">
                        {u.activeWorkspaceId ? (
                          <span className="font-mono text-xs">{u.activeWorkspaceId.slice(0, 8)}...</span>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-500 dark:text-zinc-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="btn text-xs px-2.5 py-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded border border-indigo-200 dark:border-indigo-900/50 transition-colors cursor-pointer"
                            onClick={() => handleOpenRoleModal(u)}
                          >
                            Edit Role
                          </button>
                          <button
                            className="btn text-xs px-2.5 py-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
                            onClick={() => setDeletingUser(u)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500">
                <div>
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn text-xs px-3 py-1 cursor-pointer"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <button
                    className="btn text-xs px-3 py-1 cursor-pointer"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="No users found"
            description="No system users matched the selected search or filter criteria."
          />
        )}
      </section>

      {/* Edit Role Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={`Edit Role: ${editingUser?.fullName}`}
      >
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Select the platform-level system role for <strong>{editingUser?.email}</strong>.
          </p>
          <div className="space-y-2">
            {ROLE_OPTIONS.map((r) => (
              <label
                key={r}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === r
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 dark:border-indigo-500'
                    : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/40'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-zinc-100">{r}</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                    {r === 'ADMIN' && 'Full control across all workspaces and system configuration.'}
                    {r === 'RECRUITER' && 'Can manage jobs, applications, candidates, and team invites.'}
                    {r === 'INTERVIEWER' && 'Can view assigned candidates and submit interview feedback.'}
                  </div>
                </div>
                <input
                  type="radio"
                  name="systemRole"
                  value={r}
                  checked={selectedRole === r}
                  onChange={() => setSelectedRole(r)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              className="btn cursor-pointer"
              onClick={() => setEditingUser(null)}
              disabled={isUpdatingRole}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn primary cursor-pointer"
              onClick={handleUpdateRole}
              disabled={isUpdatingRole}
            >
              {isUpdatingRole ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete User Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Confirm User Deletion"
      >
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Are you sure you want to delete user <strong>{deletingUser?.fullName}</strong> ({deletingUser?.email})?
            This will remove all associated workspace memberships and permissions.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              className="btn cursor-pointer"
              onClick={() => setDeletingUser(null)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn danger cursor-pointer"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </Modal>
    </RoleGuard>
  );
}