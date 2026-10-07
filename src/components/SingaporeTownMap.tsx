import React, { useState, useMemo, useRef } from 'react';
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Check,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';
import { HDB_TOWNS, RegionFilter, TownInfo } from '../types/hdb';
import singaporeMapBackdrop from '../assets/images/singapore_map_backdrop_1791360917965.jpg';

interface TownGeoData {
  id: string;
  name: string;
  region: 'East' | 'North-East' | 'Central' | 'West' | 'North';
  maturity: 'Mature' | 'Non-Mature';
  center: [number, number];
  labelPos: [number, number];
  path: string;
}

const TOWN_GEO_MAP: Record<string, TownGeoData> = {
  WOODLANDS: {
    id: 'WOODLANDS',
    name: 'Woodlands',
    region: 'North',
    maturity: 'Non-Mature',
    center: [430, 115],
    labelPos: [430, 118],
    path: 'M 370 85 L 470 65 L 490 125 L 445 165 L 380 155 Z',
  },
  SEMBAWANG: {
    id: 'SEMBAWANG',
    name: 'Sembawang',
    region: 'North',
    maturity: 'Non-Mature',
    center: [515, 105],
    labelPos: [515, 108],
    path: 'M 470 65 L 555 60 L 565 115 L 520 150 L 490 125 Z',
  },
  YISHUN: {
    id: 'YISHUN',
    name: 'Yishun',
    region: 'North',
    maturity: 'Non-Mature',
    center: [545, 170],
    labelPos: [545, 173],
    path: 'M 490 125 L 520 150 L 565 115 L 610 140 L 595 210 L 525 210 L 445 165 Z',
  },
  PUNGGOL: {
    id: 'PUNGGOL',
    name: 'Punggol',
    region: 'North-East',
    maturity: 'Non-Mature',
    center: [685, 150],
    labelPos: [685, 153],
    path: 'M 645 110 L 735 120 L 740 180 L 675 190 L 640 150 Z',
  },
  SENGKANG: {
    id: 'SENGKANG',
    name: 'Sengkang',
    region: 'North-East',
    maturity: 'Non-Mature',
    center: [665, 210],
    labelPos: [665, 213],
    path: 'M 640 150 L 675 190 L 725 185 L 715 240 L 635 240 L 605 200 Z',
  },
  'ANG MO KIO': {
    id: 'ANG MO KIO',
    name: 'Ang Mo Kio',
    region: 'North-East',
    maturity: 'Mature',
    center: [525, 245],
    labelPos: [525, 248],
    path: 'M 490 210 L 565 210 L 585 235 L 570 275 L 480 265 L 470 230 Z',
  },
  HOUGANG: {
    id: 'HOUGANG',
    name: 'Hougang',
    region: 'North-East',
    maturity: 'Non-Mature',
    center: [625, 270],
    labelPos: [625, 273],
    path: 'M 585 235 L 635 240 L 675 240 L 670 290 L 600 295 L 580 265 Z',
  },
  SERANGOON: {
    id: 'SERANGOON',
    name: 'Serangoon',
    region: 'North-East',
    maturity: 'Mature',
    center: [565, 305],
    labelPos: [565, 308],
    path: 'M 540 270 L 580 265 L 600 295 L 585 335 L 535 325 L 530 285 Z',
  },
  'PASIR RIS': {
    id: 'PASIR RIS',
    name: 'Pasir Ris',
    region: 'East',
    maturity: 'Mature',
    center: [785, 195],
    labelPos: [785, 198],
    path: 'M 735 155 L 830 155 L 845 215 L 780 230 L 740 180 Z',
  },
  TAMPINES: {
    id: 'TAMPINES',
    name: 'Tampines',
    region: 'East',
    maturity: 'Mature',
    center: [790, 275],
    labelPos: [790, 278],
    path: 'M 740 230 L 780 230 L 845 215 L 845 290 L 780 315 L 735 285 Z',
  },
  BEDOK: {
    id: 'BEDOK',
    name: 'Bedok',
    region: 'East',
    maturity: 'Mature',
    center: [735, 340],
    labelPos: [735, 343],
    path: 'M 685 295 L 735 285 L 780 315 L 800 365 L 705 380 L 675 345 Z',
  },
  'MARINE PARADE': {
    id: 'MARINE PARADE',
    name: 'Marine Parade',
    region: 'East',
    maturity: 'Mature',
    center: [695, 395],
    labelPos: [695, 398],
    path: 'M 640 370 L 705 380 L 770 375 L 760 410 L 645 405 Z',
  },
  GEYLANG: {
    id: 'GEYLANG',
    name: 'Geylang',
    region: 'Central',
    maturity: 'Mature',
    center: [635, 350],
    labelPos: [635, 353],
    path: 'M 590 325 L 645 320 L 685 295 L 675 345 L 640 370 L 595 370 Z',
  },
  'KALLANG/WHAMPOA': {
    id: 'KALLANG/WHAMPOA',
    name: 'Kallang/Whampoa',
    region: 'Central',
    maturity: 'Mature',
    center: [560, 365],
    labelPos: [560, 368],
    path: 'M 535 325 L 590 325 L 595 370 L 585 405 L 540 400 L 525 360 Z',
  },
  BISHAN: {
    id: 'BISHAN',
    name: 'Bishan',
    region: 'Central',
    maturity: 'Mature',
    center: [500, 295],
    labelPos: [500, 298],
    path: 'M 475 265 L 540 270 L 530 285 L 535 325 L 480 325 L 465 290 Z',
  },
  'TOA PAYOH': {
    id: 'TOA PAYOH',
    name: 'Toa Payoh',
    region: 'Central',
    maturity: 'Mature',
    center: [505, 345],
    labelPos: [505, 348],
    path: 'M 480 325 L 535 325 L 525 360 L 480 360 L 470 340 Z',
  },
  'CENTRAL AREA': {
    id: 'CENTRAL AREA',
    name: 'Central Area',
    region: 'Central',
    maturity: 'Mature',
    center: [560, 430],
    labelPos: [560, 433],
    path: 'M 540 400 L 585 405 L 595 440 L 545 455 L 525 430 Z',
  },
  'BUKIT MERAH': {
    id: 'BUKIT MERAH',
    name: 'Bukit Merah',
    region: 'Central',
    maturity: 'Mature',
    center: [495, 430],
    labelPos: [495, 433],
    path: 'M 470 390 L 525 390 L 540 400 L 525 430 L 505 465 L 450 450 L 455 410 Z',
  },
  QUEENSTOWN: {
    id: 'QUEENSTOWN',
    name: 'Queenstown',
    region: 'Central',
    maturity: 'Mature',
    center: [430, 415],
    labelPos: [430, 418],
    path: 'M 410 375 L 470 390 L 455 410 L 450 450 L 395 435 L 400 390 Z',
  },
  'BUKIT TIMAH': {
    id: 'BUKIT TIMAH',
    name: 'Bukit Timah',
    region: 'Central',
    maturity: 'Mature',
    center: [440, 335],
    labelPos: [440, 338],
    path: 'M 415 290 L 475 265 L 465 290 L 480 325 L 470 390 L 410 375 L 405 330 Z',
  },
  'CHOA CHU KANG': {
    id: 'CHOA CHU KANG',
    name: 'Choa Chu Kang',
    region: 'West',
    maturity: 'Non-Mature',
    center: [320, 245],
    labelPos: [320, 248],
    path: 'M 270 205 L 360 195 L 380 245 L 340 275 L 275 260 Z',
  },
  'BUKIT PANJANG': {
    id: 'BUKIT PANJANG',
    name: 'Bukit Panjang',
    region: 'West',
    maturity: 'Non-Mature',
    center: [410, 235],
    labelPos: [410, 238],
    path: 'M 360 195 L 445 165 L 470 230 L 415 290 L 380 245 Z',
  },
  'BUKIT BATOK': {
    id: 'BUKIT BATOK',
    name: 'Bukit Batok',
    region: 'West',
    maturity: 'Non-Mature',
    center: [365, 305],
    labelPos: [365, 308],
    path: 'M 340 275 L 380 245 L 415 290 L 405 330 L 365 350 L 330 320 Z',
  },
  CLEMENTI: {
    id: 'CLEMENTI',
    name: 'Clementi',
    region: 'West',
    maturity: 'Mature',
    center: [375, 385],
    labelPos: [375, 388],
    path: 'M 350 350 L 405 330 L 410 375 L 395 435 L 340 410 Z',
  },
  'JURONG EAST': {
    id: 'JURONG EAST',
    name: 'Jurong East',
    region: 'West',
    maturity: 'Non-Mature',
    center: [310, 360],
    labelPos: [310, 363],
    path: 'M 280 315 L 340 315 L 350 350 L 340 410 L 285 395 L 275 345 Z',
  },
  'JURONG WEST': {
    id: 'JURONG WEST',
    name: 'Jurong West',
    region: 'West',
    maturity: 'Non-Mature',
    center: [220, 345],
    labelPos: [220, 348],
    path: 'M 160 295 L 270 280 L 280 315 L 275 345 L 285 395 L 210 415 L 155 370 Z',
  },
};

const REGION_STYLES: Record<string, { fill: string; stroke: string; activeFill: string; badge: string }> = {
  East: {
    fill: 'rgba(16, 185, 129, 0.22)',
    stroke: '#10B981',
    activeFill: '#059669',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  'North-East': {
    fill: 'rgba(99, 102, 241, 0.22)',
    stroke: '#6366F1',
    activeFill: '#4F46E5',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  Central: {
    fill: 'rgba(245, 158, 11, 0.22)',
    stroke: '#F59E0B',
    activeFill: '#D97706',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  West: {
    fill: 'rgba(59, 130, 246, 0.22)',
    stroke: '#3B82F6',
    activeFill: '#2563EB',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  North: {
    fill: 'rgba(20, 184, 166, 0.22)',
    stroke: '#14B8A6',
    activeFill: '#0D9488',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
  },
};

interface SingaporeTownMapProps {
  selectedTown: string;
  onSelectTown: (townId: string) => void;
  selectedRegion: RegionFilter;
  onSelectRegion: (region: RegionFilter) => void;
  activeFlatLabel: string;
}

export function SingaporeTownMap({
  selectedTown,
  onSelectTown,
  selectedRegion,
  onSelectRegion,
  activeFlatLabel,
}: SingaporeTownMapProps) {
  const [hoveredTownId, setHoveredTownId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'split'>('map');
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTown = useMemo(() => {
    return HDB_TOWNS.find((t) => t.id === selectedTown);
  }, [selectedTown]);

  const hoveredTown = useMemo(() => {
    if (!hoveredTownId) return null;
    return HDB_TOWNS.find((t) => t.id === hoveredTownId) || null;
  }, [hoveredTownId]);

  const filteredTowns = useMemo(() => {
    return HDB_TOWNS.filter((t) => {
      const matchRegion = selectedRegion === 'ALL' || t.region === selectedRegion;
      const matchQuery =
        !searchQuery.trim() ||
        t.label.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchRegion && matchQuery;
    });
  }, [selectedRegion, searchQuery]);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.9), 1.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const regions: RegionFilter[] = ['ALL', 'East', 'North-East', 'Central', 'West', 'North'];

  return (
    <div className="bg-white rounded-3xl border border-black/[0.06] p-5 sm:p-7 space-y-5">
      {/* Header Bar: Title, Active Selection, View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0071E3]/10 text-[#0071E3]">
              <Compass className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-[#1D1D1F]">
              Interactive Singapore HDB Map
            </h2>
          </div>
          <p className="text-xs text-[#6E6E73] mt-1">
            Tap any segregated HDB town on Singapore island to instantly analyze{' '}
            <span className="font-medium text-[#1D1D1F]">{activeFlatLabel.toLowerCase()}s</span>
          </p>
        </div>

        {/* Status Callout & Quick Islandwide Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectTown('ALL')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              selectedTown === 'ALL'
                ? 'bg-[#1D1D1F] text-white shadow-xs'
                : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
            }`}
          >
            <span>🇸🇬 Islandwide (All Singapore)</span>
            {selectedTown === 'ALL' && <Check className="w-3.5 h-3.5" />}
          </button>

          {activeTown && selectedTown !== 'ALL' && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0071E3]/10 border border-[#0071E3]/20 text-[#0071E3] text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 fill-current" />
              <span>{activeTown.label}</span>
              <span className="text-[11px] font-normal text-[#0071E3]/80">
                · {activeTown.region} · {activeTown.maturity}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar: Region Tabs + Search Input + Zoom Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-black/[0.04]">
        {/* Region Filter Buttons */}
        <div className="flex items-center bg-[#F5F5F7] p-1 rounded-xl overflow-x-auto no-scrollbar">
          {regions.map((reg) => {
            const isRegActive = selectedRegion === reg;
            return (
              <button
                key={reg}
                type="button"
                onClick={() => onSelectRegion(reg)}
                className={`min-h-[34px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isRegActive
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {reg === 'ALL' ? 'All Island' : reg}
              </button>
            );
          })}
        </div>

        {/* Search and Zoom Tools */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find town..."
              className="w-full min-h-[36px] pl-8 pr-3 py-1 text-xs bg-[#F5F5F7] rounded-xl text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          <div className="flex items-center bg-[#F5F5F7] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleZoom(0.15)}
              title="Zoom In"
              aria-label="Zoom In"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.15)}
              title="Zoom Out"
              aria-label="Zoom Out"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset View"
              aria-label="Reset View"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden border border-black/[0.08] bg-[#0E1520] select-none shadow-inner"
        style={{ minHeight: '380px' }}
      >
        {/* Singapore Satellite & Cartographic Backdrop Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={singaporeMapBackdrop}
            alt="Singapore Island Map"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 scale-105 filter contrast-125 saturate-110"
          />
          {/* Subtle Cartographic Grid & Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1520]/80 via-transparent to-[#0E1520]/60" />
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        {/* Hover / Active Floating Status Pill on Top Left of Map */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          {hoveredTown ? (
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/10 shadow-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3] animate-pulse" />
              <div className="text-left">
                <span className="text-xs font-semibold text-[#1D1D1F]">
                  {hoveredTown.label}
                </span>
                <span className="text-[10px] text-[#6E6E73] ml-1.5 font-medium">
                  {hoveredTown.region} · {hoveredTown.maturity}
                </span>
              </div>
            </div>
          ) : activeTown ? (
            <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg text-white flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#0071E3]" />
              <span className="text-xs font-medium">
                {selectedTown === 'ALL' ? 'All Singapore' : activeTown.label}
              </span>
            </div>
          ) : null}
        </div>

        {/* Region Color Legend on Bottom Left */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/10 text-[11px] text-[#1D1D1F]">
          <span className="font-semibold text-[#6E6E73]">Regions:</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" /> East
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#6366F1]" /> North-East
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Central
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> West
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]" /> North
          </span>
        </div>

        {/* Quick Helper Text on Bottom Right */}
        <div className="absolute bottom-3 right-3 z-10 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white/80 pointer-events-none">
          Click town polygon to view valuation
        </div>

        {/* Segregated Interactive SVG Layer */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out flex items-center justify-center p-2 sm:p-4"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 1000 540"
            className="w-full h-auto max-h-[520px] drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Non-HDB Singapore Coastal & Water Catchment Landmarks for geographic context */}
            <g className="opacity-25" pointerEvents="none">
              {/* Western Catchment & Tuas */}
              <path
                d="M 50 370 L 155 370 L 160 295 L 270 280 L 270 205 L 220 140 L 150 200 L 70 310 Z"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="1"
              />
              {/* Central Catchment Nature Reserve */}
              <path
                d="M 445 165 L 490 210 L 475 265 L 415 290 L 380 245 Z"
                fill="#065F46"
                stroke="#10B981"
                strokeWidth="1"
                opacity="0.5"
              />
              {/* Changi Airport & Eastern Coast */}
              <path
                d="M 845 215 L 920 215 L 935 275 L 890 325 L 845 290 Z"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="1"
              />
              {/* Sentosa Island */}
              <path
                d="M 470 475 L 535 480 L 525 505 L 465 500 Z"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="1"
              />
              {/* Pulau Ubin */}
              <path
                d="M 775 115 L 840 120 L 830 145 L 765 140 Z"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="1"
              />
              {/* Pulau Tekong */}
              <path
                d="M 865 105 L 930 110 L 925 155 L 855 150 Z"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="1"
              />
            </g>

            {/* Segregated HDB Towns (Polygons & Boundaries) */}
            <g>
              {Object.values(TOWN_GEO_MAP).map((town) => {
                const isSelected = selectedTown === town.id;
                const isHovered = hoveredTownId === town.id;
                const matchesRegion =
                  selectedRegion === 'ALL' || town.region === selectedRegion;
                const matchesSearch =
                  !searchQuery.trim() ||
                  town.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
                const isDimmed = !matchesRegion || !matchesSearch;

                const styling = REGION_STYLES[town.region] || REGION_STYLES.Central;

                // Determine dynamic fill and stroke
                let fill = styling.fill;
                let stroke = styling.stroke;
                let strokeWidth = 1.5;
                let opacity = 1;

                if (isDimmed) {
                  opacity = 0.25;
                } else if (isSelected) {
                  fill = '#0071E3';
                  stroke = '#FFFFFF';
                  strokeWidth = 2.5;
                } else if (isHovered) {
                  fill = styling.activeFill;
                  stroke = '#FFFFFF';
                  strokeWidth = 2.5;
                }

                return (
                  <path
                    key={town.id}
                    d={town.path}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    className="cursor-pointer transition-all duration-200 ease-out"
                    filter={isSelected || isHovered ? 'url(#glow)' : undefined}
                    onMouseEnter={() => setHoveredTownId(town.id)}
                    onMouseLeave={() => setHoveredTownId(null)}
                    onClick={() => onSelectTown(town.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${town.name} town in ${town.region} region`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectTown(town.id);
                      }
                    }}
                  />
                );
              })}
            </g>

            {/* Town Center Pins, Beacons, and Micro Labels */}
            <g pointerEvents="none">
              {Object.values(TOWN_GEO_MAP).map((town) => {
                const isSelected = selectedTown === town.id;
                const isHovered = hoveredTownId === town.id;
                const matchesRegion =
                  selectedRegion === 'ALL' || town.region === selectedRegion;
                const matchesSearch =
                  !searchQuery.trim() ||
                  town.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
                const isDimmed = !matchesRegion || !matchesSearch;

                if (isDimmed) return null;

                const [cx, cy] = town.center;
                const [lx, ly] = town.labelPos;

                return (
                  <g key={`marker-${town.id}`} className="transition-all duration-200">
                    {/* Pulsing rings for selected town */}
                    {isSelected && (
                      <>
                        <circle
                          cx={cx}
                          cy={cy}
                          r="16"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          opacity="0.8"
                          className="animate-ping"
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r="9"
                          fill="#0071E3"
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                        />
                      </>
                    )}

                    {/* Default pin point */}
                    {!isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 6 : 3.5}
                        fill={isHovered ? '#FFFFFF' : '#FFFFFF'}
                        stroke={isHovered ? '#0071E3' : 'rgba(0,0,0,0.4)'}
                        strokeWidth={isHovered ? 2 : 1}
                        opacity={isHovered ? 1 : 0.9}
                      />
                    )}

                    {/* Town Name Text Label */}
                    <text
                      x={lx}
                      y={ly + (isSelected ? 16 : 14)}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={isSelected ? '12px' : isHovered ? '11px' : '9.5px'}
                      fontWeight={isSelected || isHovered ? '700' : '500'}
                      style={{
                        paintOrder: 'stroke',
                        stroke: '#0F172A',
                        strokeWidth: isSelected || isHovered ? '3px' : '2.5px',
                        strokeLinejoin: 'round',
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {town.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Accessible Interactive Town Picker Chips for Quick Access */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#1D1D1F]">
            {filteredTowns.length} Towns Available in Singapore
          </p>
          <span className="text-[11px] text-[#6E6E73]">
            {selectedTown === 'ALL'
              ? 'Showing islandwide valuation'
              : `Current: ${activeTown?.label || selectedTown}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#F5F5F7] rounded-2xl">
          <button
            type="button"
            onClick={() => onSelectTown('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedTown === 'ALL'
                ? 'bg-[#1D1D1F] text-white shadow-xs font-semibold'
                : 'bg-white text-[#1D1D1F] hover:bg-[#E8E8ED]'
            }`}
          >
            All Singapore (Islandwide)
          </button>

          {filteredTowns.map((t) => {
            const isSelected = selectedTown === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTown(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0071E3] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#1D1D1F] hover:bg-[#E8E8ED]'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`text-[10px] ${
                    isSelected ? 'text-white/80' : 'text-[#6E6E73]'
                  }`}
                >
                  · {t.region}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
