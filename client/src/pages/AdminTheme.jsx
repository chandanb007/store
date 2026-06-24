import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { Palette, Type, RotateCcw, Save, Sparkles, LayoutGrid, Check } from 'lucide-react';

// Elite presets from the dynamic palette registry
const PRESET_PALETTES = [
  {
    name: "Modern Luminary Home (Default)",
    primaryGold: "#b89047",
    secondaryMaroon: "#2563eb",
    bgLight: "#f8fafc",
    bgDark: "#0b0f19",
    serifFont: "Outfit",
    radius: "12px",
    description: "Contemporary home curation of elegant brushed champagne bronze paired with vibrant cobalt accents."
  },
  {
    name: "Scandinavian Sage Living",
    primaryGold: "#c29047",
    secondaryMaroon: "#2d5a27",
    bgLight: "#f4f6f0",
    bgDark: "#0c150c",
    serifFont: "Cabinet Grotesk",
    radius: "24px",
    description: "Cozy Nordic organic feeling featuring lush sage background highlights and spacious curved accents."
  },
  {
    name: "High-Contrast Obsidian & Ember",
    primaryGold: "#f97316",
    secondaryMaroon: "#1e1e24",
    bgLight: "#ffffff",
    bgDark: "#09090b",
    serifFont: "Space Grotesk",
    radius: "8px",
    description: "Dynamic high-fashion interior scheme centering neon fire embers on a stark neutral ground."
  },
  {
    name: "Metropolitan Saffron & Slate",
    primaryGold: "#eab308",
    secondaryMaroon: "#475569",
    bgLight: "#f8fafc",
    bgDark: "#0f172a",
    serifFont: "Lexend",
    radius: "16px",
    description: "Stately industrial loft living styling reflecting urban high-contrast charcoal and warm golden sunbeams."
  },
  {
    name: "Chiselled Mono-Luxe",
    primaryGold: "#000000",
    secondaryMaroon: "#71717a",
    bgLight: "#ffffff",
    bgDark: "#0a0a0a",
    serifFont: "Sora",
    radius: "0px",
    description: "Brutalist minimal silhouette style presenting stark ink blacks, clean metals and sharp structural angles."
  }
];

export const AdminTheme = () => {
  const { themeConfig, updateThemeConfig, theme } = useApp();

  // Local state to modify temporarily before saving
  const [localConfig, setLocalConfig] = useState({ ...themeConfig });

  const handleUpdateLocal = (key, value) => {
    setLocalConfig((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyPreset = (preset) => {
    setLocalConfig({
      primaryGold: preset.primaryGold,
      secondaryMaroon: preset.secondaryMaroon,
      serifFont: preset.serifFont,
      radius: preset.radius,
      bgLight: preset.bgLight,
      bgDark: preset.bgDark,
      tagline: localConfig.tagline, // preserve branding texts
      logoText: localConfig.logoText
    });
  };

  const handleResetToDefault = () => {
    const defaults = PRESET_PALETTES[0];
    setLocalConfig({
      ...defaults,
      tagline: "Magnificent Living & Household Masterpieces",
      logoText: "CASA'LUX"
    });
  };

  const handleSave = () => {
    updateThemeConfig(localConfig);
  };

  // Check if modified from saved state
  const isModified = JSON.stringify(localConfig) !== JSON.stringify(themeConfig);

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-500/25 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-105">
            Aesthetic Customizer
          </h1>
          <p className="text-xs text-stone-400">
            Control brand elements, primary gold scales, layouts, and typography. Changes apply in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2 border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={!isModified}
            className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5 ${
              isModified
                ? 'bg-gold-500 hover:bg-gold-600 text-stone-950 font-extrabold cursor-pointer'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Apply Styles
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-8 font-sans">
          
          {/* Preset Registry Pack */}
          <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500" />
              Elite Preset Signatures
            </h3>
            <p className="text-xs text-stone-400">
              Instantly adopt cohesive heritage colorways curated by art directors.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {PRESET_PALETTES.map((p) => {
                const isSelectedPreset = 
                  localConfig.primaryGold === p.primaryGold &&
                  localConfig.secondaryMaroon === p.secondaryMaroon &&
                  localConfig.serifFont === p.serifFont &&
                  localConfig.radius === p.radius;

                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`p-4 rounded-xl text-left border relative overflow-hidden transition-all duration-300 group ${
                      isSelectedPreset
                        ? 'border-gold-500 bg-gold-400/5 ring-1 ring-gold-500/30'
                        : 'border-stone-200/40 dark:border-stone-800/30 hover:border-gold-500/50 hover:bg-stone-50/50 dark:hover:bg-stone-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-gold-600 dark:group-hover:text-gold-400">
                        {p.name}
                      </span>
                      {isSelectedPreset && (
                        <span className="p-0.5 bg-gold-500 text-stone-950 rounded-full">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400 leading-normal mt-1 mb-2.5">
                      {p.description}
                    </p>
                    <div className="flex gap-1.5 items-center">
                      <span className="w-5 h-5 rounded border border-stone-200/50" style={{ backgroundColor: p.primaryGold }} title="Primary Accent" />
                      <span className="w-5 h-5 rounded border border-stone-200/50" style={{ backgroundColor: p.secondaryMaroon }} title="Secondary Color" />
                      <span className="w-5 h-5 rounded border border-stone-200/50" style={{ backgroundColor: p.bgLight }} title="Canvas Light" />
                      <span className="w-5 h-5 rounded border border-stone-200/50" style={{ backgroundColor: p.bgDark }} title="Canvas Dark" />
                      <span className="text-[9px] text-stone-400 uppercase font-mono font-bold tracking-widest bg-stone-100 dark:bg-stone-850 px-1.5 py-0.5 rounded ml-auto">
                        {p.radius}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Adjustments */}
          <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-6">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-3">
              <Palette className="w-5 h-5 text-gold-500" />
              Dynamic Color Controllers
            </h3>

            {/* Hex Picker Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Primary Gold */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300 block">
                  Primary Gold Accent
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={localConfig.primaryGold}
                    onChange={(e) => handleUpdateLocal('primaryGold', e.target.value)}
                    className="w-12 h-10 p-1 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={localConfig.primaryGold}
                      onChange={(e) => handleUpdateLocal('primaryGold', e.target.value)}
                      placeholder="#d4af37"
                      className="w-full text-xs font-mono font-bold uppercase py-2 px-3 border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 block leading-snug">
                  Applied to borders, crown titles, highlight ribbons, and primary CTA gradients.
                </span>
              </div>

              {/* Secondary Crimson */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300 block">
                  Secondary Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={localConfig.secondaryMaroon}
                    onChange={(e) => handleUpdateLocal('secondaryMaroon', e.target.value)}
                    className="w-12 h-10 p-1 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={localConfig.secondaryMaroon}
                      onChange={(e) => handleUpdateLocal('secondaryMaroon', e.target.value)}
                      placeholder="#800020"
                      className="w-full text-xs font-mono font-bold uppercase py-2 px-3 border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 block leading-snug">
                  Applied to premium badge outlines, tags, banner details, and subheadings.
                </span>
              </div>

              {/* Light Mode BG */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300 block">
                  Light Theme Canvas BG
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={localConfig.bgLight}
                    onChange={(e) => handleUpdateLocal('bgLight', e.target.value)}
                    className="w-12 h-10 p-1 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={localConfig.bgLight}
                      onChange={(e) => handleUpdateLocal('bgLight', e.target.value)}
                      placeholder="#fcfbf7"
                      className="w-full text-xs font-mono font-bold uppercase py-2 px-3 border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 block leading-snug">
                  Overall background for store pages when viewed in Light theme mode.
                </span>
              </div>

              {/* Dark Mode BG */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300 block">
                  Dark Theme Canvas BG
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={localConfig.bgDark}
                    onChange={(e) => handleUpdateLocal('bgDark', e.target.value)}
                    className="w-12 h-10 p-1 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={localConfig.bgDark}
                      onChange={(e) => handleUpdateLocal('bgDark', e.target.value)}
                      placeholder="#0f0f0e"
                      className="w-full text-xs font-mono font-bold uppercase py-2 px-3 border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 block leading-snug">
                  Overall dark palette background, perfect for highlighting jewelry or gold.
                </span>
              </div>

            </div>
          </div>

          {/* Typography & Layout Geometry */}
          <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-6">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-3">
              <Type className="w-5 h-5 text-gold-500" />
              Typography & Layout Geometry
            </h3>

            <div className="space-y-5">
              
              {/* Fonts */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300 block">
                  Imperial Serif Font family
                </label>
                <select
                  value={localConfig.serifFont}
                  onChange={(e) => handleUpdateLocal('serifFont', e.target.value)}
                  className="w-full text-xs font-bold py-2.5 px-3 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-gold-550"
                >
                  <option value="Playfair Display">Playfair Display (Royal Editorial Serif)</option>
                  <option value="Cormorant Garamond">Cormorant Garamond (Antique Sovereign Serif)</option>
                  <option value="Lora">Lora (Modern Literary Bookish Serif)</option>
                  <option value="Cinzel">Cinzel (Stone Sculpted Imperial Display)</option>
                  <option value="Cinzel Decorative">Cinzel Decorative (Intricate Floral Capitals)</option>
                  <option value="Prata">Prata (Elegant High-Contrast French Serif)</option>
                </select>
                <span className="text-[10px] text-stone-400 block">
                  Changes primary display headings, brand marks, and product titles instantly.
                </span>
              </div>

              {/* Slider for Corner Radius */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">
                    Sovereign Visual Roundness
                  </label>
                  <span className="font-mono font-bold bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                    {localConfig.radius}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="28"
                    step="4"
                    value={parseInt(localConfig.radius) || 0}
                    onChange={(e) => handleUpdateLocal('radius', `${e.target.value}px`)}
                    className="w-full accent-gold-500 h-1.5 bg-stone-150 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 pt-0.5">
                  <span>0px (Traditional Mughal Geometry)</span>
                  <span>16px (Royal Default)</span>
                  <span>28px (Fluid Modern Modernity)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Branding Content Labels */}
          <div className="bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-5">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-3">
              <LayoutGrid className="w-5 h-5 text-gold-500" />
              Dynamic Typography Branding Customization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">
                  Global Brand Trademark Logo text
                </label>
                <input
                  type="text"
                  value={localConfig.logoText || ''}
                  onChange={(e) => handleUpdateLocal('logoText', e.target.value)}
                  placeholder="HERITAGE"
                  className="w-full text-xs font-bold py-2.5 px-3 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 dark:text-stone-300">
                  Slogan Tagline Suffix
                </label>
                <input
                  type="text"
                  value={localConfig.tagline || ''}
                  onChange={(e) => handleUpdateLocal('tagline', e.target.value)}
                  placeholder="Luxury Indian Craftsmanship"
                  className="w-full text-xs font-bold py-2.5 px-3 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Live Simulator Preview */}
        <div className="lg:col-span-5 hover:scale-[1.01] transition-transform duration-300">
          
          <div className="sticky top-20 bg-stone-900 border border-stone-800 text-white p-6 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative flex"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span></span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Live Simulator Feed</span>
              </div>
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest font-mono">Bazaar Frontend</span>
            </div>

            {/* Simulated Storefront Card */}
            <div 
              className="simulate-canvas p-5 border border-stone-200 dark:border-stone-800 transition-colors duration-300 overflow-hidden relative"
              style={{
                borderRadius: localConfig.radius,
                backgroundColor: theme === 'dark' ? localConfig.bgDark : localConfig.bgLight,
                color: theme === 'dark' ? '#f5f5f4' : '#1c1917'
              }}
            >
              {/* Small Header */}
              <div className="flex items-center justify-between pb-3 border-b cursor-default" style={{ borderColor: `${localConfig.primaryGold}30` }}>
                <div className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-7 h-7 fill-none"
                    style={{ color: localConfig.primaryGold }}
                  >
                    <rect x="15" y="15" width="70" height="70" rx="12" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
                    <rect x="20" y="20" width="60" height="60" rx="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-30" />
                    <path d="M32 72 V48 C32 38 40 32 50 32 C60 32 68 38 68 48 V72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="50" cy="21" r="2.5" fill="currentColor" />
                    <path d="M26 72 H74" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                  <div className="flex flex-col">
                    <span 
                      style={{ 
                        fontFamily: `"${localConfig.serifFont}", serif`,
                        color: theme === 'dark' ? '#f5f5f4' : '#1c1917'
                      }}
                      className="text-xs font-bold tracking-[0.08em] leading-none"
                    >
                      {localConfig.logoText || 'HERITAGE'}
                    </span>
                    <span className="text-[7px] uppercase tracking-[0.25em] font-extrabold mt-0.5 leading-none block" style={{ color: localConfig.primaryGold }}>
                      TREASURES
                    </span>
                  </div>
                </div>
                
                {/* Micro search bar simulation */}
                <div className="hidden sm:block w-24 h-5 rounded-full bg-stone-200/50 dark:bg-stone-800/60 border border-stone-200/20" />
              </div>

              {/* Slogan Banner */}
              <div className="text-center py-5 space-y-1">
                <span className="text-[8px] uppercase tracking-widest font-bold opacity-50 block">ESTABLISHED 2026</span>
                <h4 
                  style={{ fontFamily: `"${localConfig.serifFont}", serif` }}
                  className="text-sm font-bold tracking-wide italic"
                >
                  "{localConfig.tagline}"
                </h4>
              </div>

              {/* Sample Product item inside simulator */}
              <div className="bg-stone-50/40 dark:bg-stone-900/40 p-3 border border-stone-200/10 rounded-xl space-y-3">
                <div className="h-24 w-full bg-stone-300/20 dark:bg-stone-800/40 rounded-lg flex items-center justify-center relative group">
                  <span className="text-2xl">🏺</span>
                  <span 
                    className="absolute top-2 left-2 text-[7px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 text-white text-stone-100 rounded-full"
                    style={{ backgroundColor: localConfig.secondaryMaroon }}
                  >
                    ROYAL CRUST
                  </span>
                </div>
                <div className="space-y-1">
                  <h5 style={{ fontFamily: `"${localConfig.serifFont}", serif` }} className="text-xs font-bold">
                    Bronze Nataraja Idol
                  </h5>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs font-black font-semibold" style={{ color: localConfig.primaryGold }}>
                      ₹8,500
                    </span>
                    <span className="text-[7px] font-mono opacity-50 block">12 units remain</span>
                  </div>
                </div>
                <button
                  type="button"
                  style={{ 
                    borderRadius: localConfig.radius,
                    backgroundColor: localConfig.primaryGold,
                    color: '#000000'
                  }}
                  className="w-full py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1 cursor-default text-black"
                >
                  🛒 Patronize item
                </button>
              </div>

              {/* Interactive Theme Mode Toggle inside Simulator */}
              <div className="flex justify-between items-center text-[7px] font-medium text-stone-400 mt-4 pt-3 border-t border-stone-200/10 cursor-default">
                <span>Simulator theme: {theme.toUpperCase()} MODE</span>
                <span style={{ color: localConfig.primaryGold }}>100% vector-safe overrides</span>
              </div>

            </div>

            <div className="text-xs text-stone-400 leading-relaxed bg-stone-850 p-4 border border-stone-800 rounded-xl space-y-1">
              <span className="text-gold-400 font-semibold block">📐 Custom CSS Variables Applied:</span>
              <p className="font-mono text-[9px] opacity-75 truncate">--font-serif-custom: "{localConfig.serifFont}"</p>
              <p className="font-mono text-[9px] opacity-75 truncate">--gold-500: {localConfig.primaryGold}</p>
              <p className="font-mono text-[9px] opacity-75 truncate">--maroon-500: {localConfig.secondaryMaroon}</p>
              <p className="font-mono text-[9px] opacity-75 truncate">--radius-custom: {localConfig.radius}</p>
              <p className="font-mono text-[9px] opacity-75 truncate">--bg-light: {localConfig.bgLight} | --bg-dark: {localConfig.bgDark}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
