import { create } from 'zustand';

interface MarketplaceState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  page: number;
  limit: number;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: 1000,
  page: 1,
  limit: 6,
  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ search: '', category: '', minPrice: 0, maxPrice: 1000, page: 1 }),
}));
