'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { BrewInput, BrewRecipe } from '@/types/brewing';
import { calculateBrewRecipe } from '@/lib/brewing-logic';
import { BrewForm } from '@/components/brewing/BrewForm';
import { BrewResult } from '@/components/brewing/BrewResult';
import {
  Coffee,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  CheckCircle,
} from 'lucide-react';

function subscribeTheme(callback: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', callback);
  window.addEventListener('storage', callback);
  window.addEventListener('ngopisha-theme-change', callback);
  return () => {
    media.removeEventListener('change', callback);
    window.removeEventListener('storage', callback);
    window.removeEventListener('ngopisha-theme-change', callback);
  };
}

function getThemeSnapshot(): boolean {
  const saved = localStorage.getItem('ngopisha-theme');
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribeMounted() {
  return () => {};
}

function getMountedSnapshot(): boolean {
  return true;
}

const INITIAL_INPUT: BrewInput = {
  beanName: 'Kilu / Ethiopia Yirgacheffe Chelchele',
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

export default function Home() {
  const [input, setInput] = useState<BrewInput>(INITIAL_INPUT);
  const [recipe, setRecipe] = useState<BrewRecipe>(() => calculateBrewRecipe(INITIAL_INPUT));
  const [activeTab, setActiveTab] = useState<'form' | 'result'>('form');

  const mounted = useSyncExternalStore(subscribeMounted, getMountedSnapshot, getServerSnapshot);
  const isDarkMode = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);

  // Synchronize document root class with dark mode state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const next = !isDarkMode;
    if (next) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('ngopisha-theme', 'dark');
      } catch {
        // Fallback for private browsing mode
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('ngopisha-theme', 'light');
      } catch {
        // Fallback for private browsing mode
      }
    }
    window.dispatchEvent(new Event('ngopisha-theme-change'));
  };

  const handleFormSubmit = (newInput: BrewInput) => {
    setInput(newInput);
    const calculated = calculateBrewRecipe(newInput);
    setRecipe(calculated);
    setActiveTab('result');

    // Smooth scroll to top of view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToForm = () => {
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#140F0D] text-[#2D2421] dark:text-[#F4EEE9] flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF8F5]/90 dark:bg-[#140F0D]/90 border-b border-amber-900/10 dark:border-stone-800 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-coffee-900 dark:bg-amber-600 text-amber-100 dark:text-stone-950 flex items-center justify-center shadow-md">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-lg sm:text-xl tracking-tight text-coffee-900 dark:text-amber-400">
                  #NgopiSha
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40">
                  V60 Precision
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
                Smart V60 Coffee Brewing Recommendation System
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              aria-label={mounted && isDarkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
              title={mounted && isDarkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
            >
              {mounted && isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Navigation Tabs (Mobile-first switcher) */}
        <div className="p-1 bg-stone-200/70 dark:bg-stone-900/80 rounded-2xl border border-stone-300/60 dark:border-stone-800 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'form'
                ? 'bg-white dark:bg-stone-800 text-coffee-900 dark:text-amber-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            1. Form Parameter Kopi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('result')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'result'
                ? 'bg-white dark:bg-stone-800 text-coffee-900 dark:text-amber-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            2. Rekomendasi & Timer Seduh
          </button>
        </div>

        {/* View Switching */}
        {activeTab === 'form' ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-amber-100/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  Masukkan parameter seduh untuk menghitung rasio, suhu, klik grinder, dan jadwal tuang terbaik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('result')}
                className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline shrink-0 hidden sm:inline"
              >
                Lihat Resep Terakhir →
              </button>
            </div>

            <BrewForm onSubmit={handleFormSubmit} initialValues={input} />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <BrewResult recipe={recipe} onEditRecipe={handleResetToForm} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-6 px-4 text-center text-xs text-stone-500 dark:text-stone-400 bg-white/50 dark:bg-stone-950/40 transition-colors">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-coffee-900 dark:text-amber-400">#NgopiSha</span>
            <span>—</span>
            <span>V60 Recommendation Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Crafted with Coffee Science ☕</span>
            <span>•</span>
            <span>Next.js App Router & Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
