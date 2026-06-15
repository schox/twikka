import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Brand } from '@/contexts/BrandContext';

export interface SelectedBrandState {
  selectedBrand: Brand | null;
  setSelectedBrand: (brand: Brand | null) => void;
  autoSelectSingleBrand: (brands: Brand[]) => void;
  reset: () => void;
}

export const useSelectedBrandStore = create<SelectedBrandState>()(
  subscribeWithSelector((set, get) => ({
    selectedBrand: null,

    setSelectedBrand: (brand: Brand | null) => {
      set({ selectedBrand: brand });
    },

    autoSelectSingleBrand: (brands: Brand[]) => {
      const current = get().selectedBrand;

      // If no brand is selected and there's exactly one brand, auto-select it
      if (!current && brands.length === 1) {
        set({ selectedBrand: brands[0] });
      }
      // If current selected brand is not in the brands list, reset selection
      else if (current && !brands.some(brand => brand.id === current.id)) {
        set({ selectedBrand: brands.length === 1 ? brands[0] : null });
      }
    },

    reset: () => {
      set({ selectedBrand: null });
    },
  })),
);
