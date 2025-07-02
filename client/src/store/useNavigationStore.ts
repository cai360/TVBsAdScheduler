import { create } from 'zustand';

interface NavigationState {
  currentPage: string;
  currentPath: string;
  breadcrumb: string[];
  expandedGroups: Set<string>;
  expandedSubGroups: Set<string>;
  setCurrentPage: (page: string, path: string, breadcrumb: string[]) => void;
  toggleGroup: (groupId: string) => void;
  toggleSubGroup: (subGroupId: string) => void;
  isGroupExpanded: (groupId: string) => boolean;
  isSubGroupExpanded: (subGroupId: string) => boolean;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentPage: 'dashboard',
  currentPath: '/',
  breadcrumb: ['首頁'],
  expandedGroups: new Set(),
  expandedSubGroups: new Set(),
  
  setCurrentPage: (page: string, path: string, breadcrumb: string[]) =>
    set({ currentPage: page, currentPath: path, breadcrumb }),
  
  toggleGroup: (groupId: string) =>
    set((state) => {
      const newExpanded = new Set(state.expandedGroups);
      if (newExpanded.has(groupId)) {
        newExpanded.delete(groupId);
      } else {
        newExpanded.add(groupId);
      }
      return { expandedGroups: newExpanded };
    }),
  
  toggleSubGroup: (subGroupId: string) =>
    set((state) => {
      const newExpanded = new Set(state.expandedSubGroups);
      if (newExpanded.has(subGroupId)) {
        newExpanded.delete(subGroupId);
      } else {
        newExpanded.add(subGroupId);
      }
      return { expandedSubGroups: newExpanded };
    }),
  
  isGroupExpanded: (groupId: string) => get().expandedGroups.has(groupId),
  isSubGroupExpanded: (subGroupId: string) => get().expandedSubGroups.has(subGroupId),
}));
