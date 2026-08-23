import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Passwords must be at least 8 characters'),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(8, 'Passwords must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['Recruiter', 'Admin'], {
      message: 'Please select a role',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const workspaceSettingsSchema = z.object({
  workspaceName: z.string().min(2, 'Workspace name must be at least 2 characters'),
  companyDomain: z.string().min(1, 'Company domain is required'),
  allowRoleToggles: z.boolean().default(true),
});

export const userInvitationSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  role: z.enum(['Recruiter', 'Admin'], {
    message: 'Please select a role',
  }),
});

export const filterStateSchema = z.object({
  query: z.string().optional(),
  status: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.string(),
    end: z.string(),
  }).nullable().optional(),
  savedViewId: z.string().nullable().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type WorkspaceSettingsInput = z.infer<typeof workspaceSettingsSchema>;
export type UserInvitationInput = z.infer<typeof userInvitationSchema>;
