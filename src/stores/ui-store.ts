import { create } from 'zustand';

// ============================================================
// UI Store — 글로벌 UI 상태 관리
// ============================================================

interface ModalState {
  id: string;
  props?: Record<string, unknown>;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface UIState {
  // 사이드바
  sidebarOpen: boolean;

  // 모달
  activeModal: ModalState | null;

  // 토스트
  toasts: Toast[];

  // 사이드바 액션
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // 모달 액션
  openModal: (id: string, props?: Record<string, unknown>) => void;
  closeModal: () => void;

  // 토스트 액션
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  // 초기값
  sidebarOpen: true,
  activeModal: null,
  toasts: [],

  // 사이드바
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // 모달
  openModal: (id, props) => set({ activeModal: { id, props } }),
  closeModal: () => set({ activeModal: null }),

  // 토스트
  addToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));
