import { create } from 'zustand';

export type ModalType =
  | 'upload-cv'
  | 'create-job'
  | 'edit-job'
  | 'edit-candidate'
  | 'schedule-interview';

export interface ModalState {
  activeModal: ModalType | null;
  modalData: unknown;
  openModal: (modal: ModalType, data?: unknown) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalData: null,
  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));
