import React, { useEffect, useState } from 'react';
import { VizioLogo } from './VizioLogo';
import { VizioIcon } from './VizioIcon';
import { playVizioBrandChime } from '../utils/audioChime';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Iniciando Vizio Midia Core...');
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play sound on mount
  useEffect(() => {
    if (soundEnabled && !soundPlayed) {
      const timer = setTimeout(() => {
        playVizioBrandChime(0.25);
        setSoundPlayed(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [soundEnabled, soundPlayed]);

  // Loading animation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinish();
          }, 350);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 15) + 8;
        if (next > 30 && next < 60) {
          setStatusText('Carregando métricas e relatórios financeiros...');
        } else if (next >= 60 && next < 85) {
          setStatusText('Sincronizando canais de comunicação da equipe...');
        } else if (next >= 85) {
          setStatusText('Ambiente pronto. Bem-vindo!');
        }

        return Math.min(next, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onFinish]);

  const handleManualPlayChime = () => {
    playVizioBrandChime(0.35);
    setSoundPlayed(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0F10] text-white flex flex-col items-center justify-between p-8 select-none overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF5B00]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top audio bar */}
      <div className="w-full flex items-center justify-between relative z-10">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-['Space_Grotesk',sans-serif]">
          Sistema Corporativo
        </span>
        <button
          onClick={handleManualPlayChime}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-gray-300 hover:text-white transition-colors backdrop-blur-xs"
          title="Tocar som oficial de abertura"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#FF5B00]" />
          <span>Som de Abertura</span>
        </button>
      </div>

      {/* Center: Hero Logo Animation */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto space-y-6">
        {/* Animated Glow Icon */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#FF5B00]/30 rounded-3xl blur-xl animate-pulse" />
          <div className="relative p-5 rounded-2xl bg-gradient-to-b from-[#1C1C1F] to-[#141416] border border-white/10 shadow-2xl">
            <VizioIcon size="xl" className="scale-125" />
          </div>
        </div>

        {/* Brand typography */}
        <div className="space-y-2">
          <VizioLogo variant="white" size="lg" />
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#FF5B00]" />
            <span className="text-[11px] font-bold text-[#FF5B00] tracking-widest uppercase font-['Space_Grotesk',sans-serif]">
              SISTEMA DE GESTÃO & CRM
            </span>
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#FF5B00]" />
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-72 sm:w-80 space-y-3 pt-4">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#FF5B00] to-orange-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_#FF5B00]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span className="truncate pr-2 font-medium">{statusText}</span>
            <span className="font-mono text-[#FF5B00] font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-center text-xs text-gray-500 font-medium">
        <span>© {new Date().getFullYear()} Vizio Mídia • Todos os direitos reservados</span>
      </div>
    </div>
  );
};
