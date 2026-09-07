'use client';

import React, { useState } from 'react';
import {
  BrewInput,
  CoffeeProcess,
  CoffeeVariety,
  RoastProfile,
  GrinderModel,
  WaterSource,
  TargetProfile,
} from '@/types/brewing';
import {
  Flame,
  Snowflake,
  Coffee,
  Sparkles,
  Sliders,
  Droplet,
  Compass,
  Check,
} from 'lucide-react';

interface BrewFormProps {
  onSubmit: (input: BrewInput) => void;
  initialValues?: BrewInput;
}

const DEFAULT_INPUT: BrewInput = {
  beanName: 'Kilu / Ethiopia Yirgacheffe',
  dose: 15,
  process: 'Washed',
  variety: 'Gesha',
  roastProfile: 'Light',
  method: 'Hot',
  brewer: 'V60',
  grinder: 'Timemore C2/C3',
  waterSource: 'Aqua',
  targetProfile: 'Balance & Clean',
};

const PRESETS: { label: string; data: Partial<BrewInput> }[] = [
  {
    label: '✨ Floral Ethiopia (Hot)',
    data: {
      beanName: 'Ethiopia Yirgacheffe Chelchele',
      dose: 15,
      process: 'Washed',
      variety: 'Gesha',
      roastProfile: 'Light',
      method: 'Hot',
      targetProfile: 'Balance & Clean',
      waterSource: 'Cleo',
    },
  },
  {
    label: '🧊 Fruity Anaerobic (Ice)',
    data: {
      beanName: 'Colombia El Paraiso Lychee',
      dose: 16,
      process: 'Anaerobic Fermentation',
      variety: 'Bourbon',
      roastProfile: 'Light-Medium',
      method: 'Ice',
      targetProfile: 'More Acidity',
      waterSource: 'Le Minerale',
    },
  },
  {
    label: '🍯 Sweet Java Natural (Hot)',
    data: {
      beanName: 'Gunung Halu Honey Process',
      dose: 15,
      process: 'Honey',
      variety: 'Local / Sigarar Utang',
      roastProfile: 'Medium',
      method: 'Hot',
      targetProfile: 'More Sweetness',
      waterSource: 'Aqua',
    },
  },
];

export const BrewForm: React.FC<BrewFormProps> = ({
  onSubmit,
  initialValues = DEFAULT_INPUT,
}) => {
  const [form, setForm] = useState<BrewInput>(initialValues);

  const handleChange = <K extends keyof BrewInput>(field: K, value: BrewInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (presetData: Partial<BrewInput>) => {
    setForm((prev) => ({ ...prev, ...presetData }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const roastOptions: { value: RoastProfile; label: string; desc: string; color: string }[] = [
    {
      value: 'Light',
      label: 'Light',
      desc: 'Floral, Bright Acidity',
      color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700',
    },
    {
      value: 'Light-Medium',
      label: 'Light-Med',
      desc: 'Sweet & Fruity balance',
      color: 'bg-amber-200/80 text-amber-950 border-amber-400 dark:bg-amber-900/50 dark:text-amber-100 dark:border-amber-600',
    },
    {
      value: 'Medium',
      label: 'Medium',
      desc: 'Caramel, Chocolate, Body',
      color: 'bg-amber-700/20 text-amber-900 border-amber-600 dark:bg-amber-800/40 dark:text-amber-200 dark:border-amber-500',
    },
    {
      value: 'Dark',
      label: 'Dark',
      desc: 'Smoky, Low Acidity, Bold',
      color: 'bg-stone-800/20 text-stone-900 border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-500',
    },
  ];

  const targetProfiles: { value: TargetProfile; title: string; desc: string; icon: string }[] = [
    {
      value: 'Balance & Clean',
      title: 'Balance & Clean',
      desc: 'Rasa seimbang, jernih, aftertaste segar',
      icon: '⚖️',
    },
    {
      value: 'More Sweetness',
      title: 'More Sweetness',
      desc: 'Manis karamel & buah lebih pekat',
      icon: '🍯',
    },
    {
      value: 'More Acidity',
      title: 'More Acidity',
      desc: 'Keasaman cerah, sparkling & juicy',
      icon: '🍋',
    },
    {
      value: 'More Body',
      title: 'More Body',
      desc: 'Mouthfeel tebal, kental & berbobot',
      icon: '☕',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Presets Bar */}
      <div className="bg-amber-50/70 dark:bg-stone-900/50 border border-amber-200/60 dark:border-stone-800 rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 dark:text-amber-300/70 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Preset Resep Cepat
          </span>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">Pilih untuk uji coba</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset.data)}
              className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-amber-100/60 dark:hover:bg-stone-700 transition shadow-xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION A: Variable Kopi */}
      <div className="bg-white dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">Variable Kopi</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Tentukan biji kopi yang akan diseduh</p>
          </div>
        </div>

        {/* Brand / Origin Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            1. Nama Brand / Origin Kopi
          </label>
          <input
            type="text"
            value={form.beanName}
            onChange={(e) => handleChange('beanName', e.target.value)}
            placeholder="e.g. Kilu / Ethiopia Yirgacheffe Chelchele"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
          />
        </div>

        {/* Coffee Dose with quick +/- */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              2. Dosis Kopi (Gram)
            </label>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
              {form.dose} g
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                min={8}
                max={40}
                step={0.5}
                value={form.dose}
                onChange={(e) => handleChange('dose', Math.max(5, parseFloat(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400">gram</span>
            </div>
            {/* Quick Dose Presets */}
            <div className="flex items-center gap-1.5">
              {[12, 15, 18, 20].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleChange('dose', d)}
                  className={`text-xs px-2.5 py-2 rounded-lg font-medium border transition ${
                    form.dose === d
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-400'
                  }`}
                >
                  {d}g
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Process & Variety Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Process */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              3. Proses Pasca Panen
            </label>
            <select
              value={form.process}
              onChange={(e) => handleChange('process', e.target.value as CoffeeProcess)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            >
              <option value="Washed">Washed (Clean & Crisp)</option>
              <option value="Natural">Natural (Fruity & Sweet)</option>
              <option value="Honey">Honey (Syrupy Sweet)</option>
              <option value="Anaerobic Fermentation">Anaerobic Fermentation (Complex & Funky)</option>
              <option value="Experimental">Experimental (Unique & Intense)</option>
            </select>
          </div>

          {/* Variety */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              4. Varietas Kopi
            </label>
            <select
              value={form.variety}
              onChange={(e) => handleChange('variety', e.target.value as CoffeeVariety)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            >
              <option value="Gesha">Gesha (Floral & Elegant)</option>
              <option value="Bourbon">Bourbon (Sweet & Balanced)</option>
              <option value="Caturra">Caturra (Bright Acidity)</option>
              <option value="Typica">Typica (Classic Clean)</option>
              <option value="Mix Variety">Mix Variety / Heirloom</option>
              <option value="Local / Sigarar Utang">Local / Sigarar Utang (Indonesian Heritage)</option>
            </select>
          </div>
        </div>

        {/* Roast Profile */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            5. Profil Roasting
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {roastOptions.map((opt) => {
              const isSelected = form.roastProfile === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('roastProfile', opt.value)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition relative ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                      {opt.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                  </div>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION B: Perangkat Brewing */}
      <div className="bg-white dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 flex items-center justify-center font-bold text-sm">
            B
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">Perangkat Brewing</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Peralatan, grinder, dan sumber air</p>
          </div>
        </div>

        {/* Hot / Ice Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            1. Suhu & Metode Penyajian
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-stone-100 dark:bg-stone-800/70 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
            <button
              type="button"
              onClick={() => handleChange('method', 'Hot')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition ${
                form.method === 'Hot'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Hot V60 (Hangat)
            </button>
            <button
              type="button"
              onClick={() => handleChange('method', 'Ice')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition ${
                form.method === 'Ice'
                  ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 border border-cyan-300/60 dark:border-cyan-700/60 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Snowflake className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Ice V60 (Japanese Iced)
            </button>
          </div>
        </div>

        {/* Brewer (Fixed to V60) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
            <span>2. Alat Seduh</span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/40 px-2 py-0.5 rounded-full font-medium">
              Standar Terverifikasi
            </span>
          </label>
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 text-sm">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span className="font-semibold text-stone-900 dark:text-stone-100">Hario V60 (Dripper 01 / 02)</span>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400">Cone 60° filter</span>
          </div>
        </div>

        {/* Grinder & Water Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Grinder */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-stone-500" />
              3. Model Grinder
            </label>
            <select
              value={form.grinder}
              onChange={(e) => handleChange('grinder', e.target.value as GrinderModel)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            >
              <option value="Timemore C2/C3">Timemore C2 / C3</option>
              <option value="Comandante C40">Comandante C40 MK3 / MK4</option>
              <option value="Kingrinder K6">Kingrinder K6</option>
              <option value="1Zpresso Q2/JX-Pro">1Zpresso Q2 / JX-Pro</option>
              <option value="Fellow Ode">Fellow Ode (Gen 2 Burrs)</option>
              <option value="Generic">Generic / Manual Grinder Lainnya</option>
            </select>
          </div>

          {/* Water Source */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sky-500" />
              4. Sumber Air Seduh
            </label>
            <select
              value={form.waterSource}
              onChange={(e) => handleChange('waterSource', e.target.value as WaterSource)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            >
              <option value="Aqua">Aqua (Standar TDS ~90-120 ppm)</option>
              <option value="Cleo">Cleo (Ultra-pure TDS ~0-5 ppm)</option>
              <option value="Le Minerale">Le Minerale (High Minerals TDS ~170 ppm)</option>
              <option value="RO Water">RO Water (Low TDS ~10-25 ppm)</option>
              <option value="Custom Mineral Water">Custom Mineral Water (Lotus / TWW ~130 ppm)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION C: Target Profil Rasa */}
      <div className="bg-white dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
            C
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">Target Profil Rasa</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Arahkan ekstraksi sesuai preferensi cangkir Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {targetProfiles.map((item) => {
            const isSelected = form.targetProfile === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleChange('targetProfile', item.value)}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <span className="text-2xl select-none">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                      {item.title}
                    </h4>
                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 px-6 rounded-2xl bg-coffee-900 hover:bg-[#2e1d1a] dark:bg-amber-600 dark:hover:bg-amber-500 text-amber-50 dark:text-stone-950 font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-amber-950/15 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer"
      >
        <Compass className="w-5 h-5 text-amber-300 dark:text-stone-900" />
        Hitung Rekomendasi Seduh Presisi
      </button>
    </form>
  );
};
