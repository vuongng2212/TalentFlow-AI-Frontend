import { api, PaginatedData } from '@/lib/api-client';
import { EmailTemplate } from '@/types';

export interface CreateEmailTemplatePayload {
  name: string;
  subject: string;
  body: string;
}

export interface UpdateEmailTemplatePayload {
  subject?: string;
  body?: string;
}

export const emailTemplateService = {
  /**
   * GET /email-templates — List all email templates in the current workspace
   */
  getEmailTemplates: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedData<EmailTemplate>> => {
    return api.get<PaginatedData<EmailTemplate>>('/email-templates', params);
  },

  /**
   * GET /email-templates/:id — Get a single email template by ID
   */
  getEmailTemplateById: async (id: string): Promise<EmailTemplate> => {
    return api.get<EmailTemplate>(`/email-templates/${id}`);
  },

  /**
   * POST /email-templates — Create a new email template
   */
  createEmailTemplate: async (payload: CreateEmailTemplatePayload): Promise<EmailTemplate> => {
    return api.post<EmailTemplate>('/email-templates', payload);
  },

  /**
   * PATCH /email-templates/:id — Update an email template
   */
  updateEmailTemplate: async (
    id: string,
    payload: UpdateEmailTemplatePayload,
  ): Promise<EmailTemplate> => {
    return api.patch<EmailTemplate>(`/email-templates/${id}`, payload);
  },

  /**
   * DELETE /email-templates/:id — Delete an email template
   */
  deleteEmailTemplate: async (id: string): Promise<void> => {
    return api.delete<void>(`/email-templates/${id}`);
  },
};
