"use client";

import React, { useState, useRef } from "react";
import { BrewRecipe } from "@/types/brewing";
import { BrewTimer } from "./BrewTimer";
import {
  Thermometer,
  Scale,
  Clock,
  Sliders,
  Droplets,
  Snowflake,
  Flame,
  Copy,
  Check,
  Coffee,
  Info,
  Lightbulb,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface BrewResultProps {
  recipe: BrewRecipe;
  onEditRecipe: () => void;
}

export const BrewResult: React.FC<BrewResultProps> = ({
  recipe,
  onEditRecipe,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const timerRef = useRef<HTMLDivElement>(null);

  const isIce = recipe.input.method === "Ice";

  const scrollToTimer = () => {
    timerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCopyRecipe = async () => {
    const text = [
      `☕ RESEP V60 #NgopiSha: ${recipe.input.beanName}`,
      `Metode: ${recipe.input.method} V60 | Profil: ${recipe.input.roastProfile} | Target: ${recipe.input.targetProfile}`,
      `-----------------------------------------`,
      `• Dosis Kopi: ${recipe.dose}g`,
      `• Rasio Seduh: ${recipe.ratioFormatted}`,
      isIce
        ? `• Air Panas: ${recipe.hotWater}ml | Es di Server: ${recipe.iceAmount}g (Total: ${recipe.totalWater}ml)`
        : `• Total Air: ${recipe.totalWater}ml`,
      `• Suhu Air: ${recipe.waterTemperature}°C`,
      `• Grinder: ${recipe.grindSetting.grinderName} (${recipe.grindSetting.clicksOrSetting})`,
      `• Estimasi Waktu: ${recipe.estimatedBrewTime}`,
      `-----------------------------------------`,
      `TAHAPAN SEDUH (POURS):`,
      ...recipe.steps.map(
        (s) =>
          `${s.stepNumber}. [${s.timeRangeFormatted}] ${s.name}: Tuang ${s.waterAmount}ml (Kumulatif: ${s.cumulativeWater}ml) - ${s.technique}`,
      ),
      `-----------------------------------------`,
      `Catatan: ${recipe.flavorNotesExplanation}`,
      `#NgopiSha V60 Brewing System`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-br from-[#3E2723] to-coffee-900 dark:from-[#2a1a17] dark:to-[#170e0c] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-amber-400/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isIce
                    ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/30"
                    : "bg-amber-500/20 text-amber-200 border border-amber-400/30"
                }`}
              >
                {isIce ? (
                  <Snowflake className="w-3.5 h-3.5" />
                ) : (
                  <Flame className="w-3.5 h-3.5" />
                )}
                {recipe.input.method} V60
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-stone-200 border border-white/10">
                {recipe.input.roastProfile} Roast
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-stone-200 border border-white/10">
                {recipe.input.process}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-stone-200 border border-white/10">
                {recipe.input.variety}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Coffee className="w-6 h-6 text-amber-400 shrink-0" />
              {recipe.input.beanName || "Biji Kopi Pilihan"}
            </h2>

            <p className="text-xs text-amber-200/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Target profil: <strong>{recipe.input.targetProfile}</strong>{" "}
              menggunakan air <strong>{recipe.input.waterSource}</strong>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyRecipe}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer backdrop-blur-xs"
              title="Salin resep ke clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin Resep
                </>
              )}
            </button>
            <button
              type="button"
              onClick={scrollToTimer}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Clock className="w-3.5 h-3.5" />
              Buka Timer
            </button>
          </div>
        </div>
      </div>

      {/* 1. Recipe Summary Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Ratio */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-medium mb-1">
            <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Ratio Seduh
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50">
            {recipe.ratioFormatted}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            {recipe.dose}g kopi : {recipe.totalWater}ml
          </div>
        </div>

        {/* Total Water / Ice Breakdown */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-medium mb-1">
            <Droplets className="w-4 h-4 text-sky-500" />
            {isIce ? "Volume Cairan" : "Total Air"}
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50">
            {recipe.totalWater}{" "}
            <span className="text-sm font-semibold text-stone-500">ml</span>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            {isIce
              ? `${recipe.hotWater}ml panas + ${recipe.iceAmount}g es`
              : `Air panas murni`}
          </div>
        </div>

        {/* Water Temperature */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-medium mb-1">
            <Thermometer className="w-4 h-4 text-rose-500" />
            Suhu Air
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50">
            {recipe.waterTemperature}°
            <span className="text-sm font-semibold text-stone-500">C</span>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            Ideal untuk {recipe.input.roastProfile} roast
          </div>
        </div>

        {/* Grinder Clicks */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-medium mb-1">
            <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Grinder Clicks
          </div>
          <div className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-50 leading-tight">
            {recipe.grindSetting.clicksOrSetting}
          </div>
          <div
            className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate"
            title={recipe.grindSetting.grinderName}
          >
            {recipe.grindSetting.grinderName}
          </div>
        </div>

        {/* Total Time */}
        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-medium mb-1">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Estimasi Waktu
          </div>
          <div className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-50">
            {recipe.estimatedBrewTime}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            Total drawdown
          </div>
        </div>
      </div>

      {/* Ice Method Preparation Alert (If Ice) */}
      {isIce && (
        <div className="bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 shrink-0">
            <Snowflake className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-cyan-950 dark:text-cyan-100 text-sm">
              Instruksi Persiapan Japanese Iced V60
            </h4>
            <p className="text-xs text-cyan-900/80 dark:text-cyan-200/80 leading-relaxed">
              Timbang dan masukkan{" "}
              <strong>{recipe.iceAmount} gram es batu kristal</strong> langsung
              ke dalam server/carafe di bawah dripper V60 sebelum menyeduh.
              Total air panas yang dituangkan adalah{" "}
              <strong>{recipe.hotWater} ml</strong>.
            </p>
          </div>
        </div>
      )}

      {/* 2. Detailed Step-by-Step Pouring Timeline */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg flex items-center gap-2">
              <span>📋</span> Tahapan Pours & Jadwal Seduh
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Ikuti jadwal dan volume air kumulatif berikut untuk hasil
              ekstraksi maksimal
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 self-start sm:self-auto">
            {recipe.steps.length} Tahapan Tuang
          </span>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {recipe.steps.map((step, idx) => {
            const isCurrentlyActive = activeStepIndex === idx;
            return (
              <div
                key={step.stepNumber}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  isCurrentlyActive
                    ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 ring-2 ring-amber-500/20 shadow-xs"
                    : "border-stone-200/80 dark:border-stone-800/80 bg-stone-50/40 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center ${
                        isCurrentlyActive
                          ? "bg-amber-600 text-white"
                          : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200"
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {step.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold border border-stone-200 dark:border-stone-700">
                      ⏱️ {step.timeRangeFormatted}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40">
                      +{step.waterAmount} ml
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900">
                      = {step.cumulativeWater} ml
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pl-9">
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong className="font-semibold text-stone-900 dark:text-stone-100">
                      Teknik:
                    </strong>{" "}
                    {step.technique}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                    Tip: {step.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Timer Anchor */}
      <div ref={timerRef}>
        <BrewTimer recipe={recipe} onStepChange={setActiveStepIndex} />
      </div>

      {/* 4. Recommendation Logic & Coffee Science Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flavor & Roast Analysis */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Analisis Ekstraksi & Rasa
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {recipe.flavorNotesExplanation}
          </p>
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
            <div>
              <strong>Grind Size:</strong>{" "}
              {recipe.grindSetting.micronDescription} (
              {recipe.grindSetting.adjustmentNote})
            </div>
          </div>
        </div>

        {/* Water Source TDS & Barista Tips */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Karakter Air & Tips Barista
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {recipe.waterAdjustmentNote}
          </p>
          <ul className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1 text-[11px] text-stone-500 dark:text-stone-400">
            {recipe.brewerTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Button to Modify */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onEditRecipe}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-300 transition py-2 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs cursor-pointer"
        >
          <span>Ubah Parameter / Buat Resep Baru</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
