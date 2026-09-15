import { create } from 'zustand';
import { MapBounds } from '../types/map';

interface MapState {
  selectedPropertyId: string | null;
  hoveredPropertyId: string | null;
  searchAsIMove: boolean;
  mapBounds: MapBounds | null;
  setSelectedPropertyId: (id: string | null) => void;
  setHoveredPropertyId: (id: string | null) => void;
  setSearchAsIMove: (enabled: boolean) => void;
  setMapBounds: (bounds: MapBounds | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedPropertyId: null,
  hoveredPropertyId: null,
  searchAsIMove: false,
  mapBounds: null,
  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
  setHoveredPropertyId: (id) => set({ hoveredPropertyId: id }),
  setSearchAsIMove: (enabled) => set({ searchAsIMove: enabled }),
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
}));
