"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { BrewRecipe, BrewStep } from "@/types/brewing";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Droplets,
  CheckCircle2,
} from "lucide-react";

interface BrewTimerProps {
  recipe: BrewRecipe;
  onStepChange?: (activeStepIndex: number) => void;
}

export const BrewTimer: React.FC<BrewTimerProps> = ({
  recipe,
  onStepChange,
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Determine current active step based on seconds
  const currentStepIndex = recipe.steps.findIndex(
    (step) => seconds >= step.startTimeSeconds && seconds < step.endTimeSeconds,
  );

  const activeStep: BrewStep | undefined =
    currentStepIndex !== -1
      ? recipe.steps[currentStepIndex]
      : seconds >= recipe.totalBrewTimeSeconds
        ? recipe.steps[recipe.steps.length - 1]
        : recipe.steps[0];

  const isCompleted = seconds >= recipe.totalBrewTimeSeconds;

  // Web Audio API beep sound for stage alerts
  const playChime = useCallback(() => {
    if (isMuted) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioContextRef.current ??= new AudioCtx();
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // Dual tone pleasant chime (C6 - G6)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1046.5, now); // C6
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1567.98, now + 0.08); // G6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.3);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.6);
    } catch {
      // Audio playback might be restricted if no user interaction yet
    }
  }, [isMuted]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          // Check if entering a new step
          const newStepIndex = recipe.steps.findIndex(
            (s) => next === s.startTimeSeconds,
          );
          if (newStepIndex > 0) {
            playChime();
          }
          if (next === recipe.totalBrewTimeSeconds) {
            playChime();
          }
          return next;
        });
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, recipe.steps, recipe.totalBrewTimeSeconds, playChime]);

  useEffect(() => {
    if (onStepChange && currentStepIndex !== -1) {
      onStepChange(currentStepIndex);
    }
  }, [currentStepIndex, onStepChange]);

  const handleToggle = () => {
    // Initialize audio context on first user click to satisfy browser autoplay policy
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress percentage
  const progressPercent = Math.min(
    100,
    Math.round((seconds / recipe.totalBrewTimeSeconds) * 100),
  );

  return (
    <div className="bg-white dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 rounded-3xl p-5 sm:p-7 shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg">
              Interactive Brew Timer
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Panduan waktu seduh real-time sesuai resep
            </p>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          title={isMuted ? "Nyalakan Audio Bel" : "Matikan Audio"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          )}
        </button>
      </div>

      {/* Main Big Digital Clock */}
      <div className="flex flex-col items-center justify-center py-4 bg-stone-50 dark:bg-stone-950/60 rounded-2xl border border-stone-100 dark:border-stone-800">
        <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-stone-900 dark:text-stone-50">
          {formatTime(seconds)}
        </div>
        <div className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1">
          Target Total Waktu: {recipe.estimatedBrewTime} (
          {recipe.totalBrewTimeSeconds}s)
        </div>

        {/* Progress Bar */}
        <div className="w-11/12 max-w-sm mt-4 h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-amber-500 to-amber-700 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current Step Status Card */}
      {isCompleted ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Seduhan Selesai Sempurna!
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {recipe.input.method === "Ice"
              ? "Aduk rata server kopi dingin agar es menyatu dan nikmati segarnya!"
              : "Swirl atau aduk server perlahan sebelum menuang ke cangkir favorit Anda."}
          </p>
        </div>
      ) : activeStep ? (
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/70 border border-amber-200/70 dark:border-stone-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Tahap Aktif: Step {activeStep.stepNumber} dari{" "}
              {recipe.steps.length}
            </span>
            <span className="text-xs font-mono font-semibold text-stone-600 dark:text-stone-300">
              {activeStep.timeRangeFormatted}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {activeStep.name}
            </h4>
            <div className="flex items-center gap-1 text-sm font-bold text-amber-700 dark:text-amber-400">
              <Droplets className="w-4 h-4" />
              Target: {activeStep.cumulativeWater} ml
              <span className="text-xs font-normal text-stone-500">
                (+{activeStep.waterAmount}ml)
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 bg-white/70 dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-200/50 dark:border-stone-700/50">
            💡{" "}
            <strong className="text-stone-800 dark:text-stone-200">
              Teknik:
            </strong>{" "}
            {activeStep.technique}
          </p>
        </div>
      ) : null}

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          className={`flex-1 py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
            isRunning
              ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700"
              : "bg-coffee-900 hover:bg-[#2e1d1a] dark:bg-amber-600 dark:hover:bg-amber-500 text-white dark:text-stone-950"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              Jeda (Pause)
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              {seconds === 0 ? "Mulai Seduh" : "Lanjutkan"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
