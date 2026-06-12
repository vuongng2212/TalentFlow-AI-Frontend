import { api } from '@/lib/api-client';
import { Workspace, WorkspaceMember, WorkspaceInvitation, WorkspaceMemberRole } from '@/types';

export interface CreateWorkspacePayload {
  name: string;
  isBusiness?: boolean;
}

export interface UpdateWorkspacePayload {
  name?: string;
  isBusiness?: boolean;
}

export interface AddMemberPayload {
  email: string;
  role?: WorkspaceMemberRole;
}

export interface CreateInvitationPayload {
  email: string;
  role?: WorkspaceMemberRole;
}

export const workspaceService = {
  /**
   * GET /workspaces — List all workspaces the current user belongs to
   */
  listMyWorkspaces: async (): Promise<Workspace[]> => {
    return api.get<Workspace[]>('/workspaces');
  },

  /**
   * GET /workspaces/:id — Get a single workspace with member count + caller's role
   */
  getWorkspace: async (workspaceId: string): Promise<Workspace> => {
    return api.get<Workspace>(`/workspaces/${workspaceId}`);
  },

  /**
   * POST /workspaces — Create a new workspace.
   * Caller automatically becomes OWNER with activeWorkspaceId set.
   */
  createWorkspace: async (payload: CreateWorkspacePayload): Promise<Workspace> => {
    return api.post<Workspace>('/workspaces', payload);
  },

  /**
   * PATCH /workspaces/:id — Update workspace name or plan (OWNER/ADMIN only)
   */
  updateWorkspace: async (
    workspaceId: string,
    payload: UpdateWorkspacePayload,
  ): Promise<Workspace> => {
    return api.patch<Workspace>(`/workspaces/${workspaceId}`, payload);
  },

  /**
   * GET /workspaces/:id/members — List active members of a workspace
   */
  listMembers: async (workspaceId: string): Promise<WorkspaceMember[]> => {
    return api.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`);
  },

  /**
   * POST /workspaces/:id/members — Add an existing user directly (no email invite)
   */
  addMember: async (
    workspaceId: string,
    payload: AddMemberPayload,
  ): Promise<WorkspaceMember> => {
    return api.post<WorkspaceMember>(`/workspaces/${workspaceId}/members`, payload);
  },

  /**
   * DELETE /workspaces/:id/members/:userId — Remove a member (OWNER/ADMIN only)
   */
  removeMember: async (workspaceId: string, userId: string): Promise<void> => {
    return api.delete<void>(`/workspaces/${workspaceId}/members/${userId}`);
  },

  /**
   * POST /workspaces/:id/invitations — Send email invitation token (Business only)
   */
  createInvitation: async (
    workspaceId: string,
    payload: CreateInvitationPayload,
  ): Promise<WorkspaceInvitation> => {
    return api.post<WorkspaceInvitation>(
      `/workspaces/${workspaceId}/invitations`,
      payload,
    );
  },

  /**
   * POST /workspaces/invitations/accept — Accept invitation via token
   */
  acceptInvitation: async (token: string): Promise<{ workspaceId: string; workspaceName: string; role: string }> => {
    return api.post('/workspaces/invitations/accept', { token });
  },
};