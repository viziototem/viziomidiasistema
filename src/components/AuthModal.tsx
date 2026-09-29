import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VizioLogo } from './VizioLogo';
import { VizioIcon } from './VizioIcon';
import {
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  KeyRound,
  ArrowRight,
  Clock,
  Sparkles,
  AlertCircle,
  X,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    setCurrentUser,
    availableUsers,
    addToast,
    addActivityLog,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'pending_approval'>('login');
  const [selectedAdminId, setSelectedAdminId] = useState<string>('u1');
  const [passwordInput, setPasswordInput] = useState('vizio');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [pendingUserEmail, setPendingUserEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // The 3 official Admins
  const officialAdmins = availableUsers.filter((u) => u.role === 'admin').slice(0, 3);

  // Admin direct login
  const handleAdminLogin = (adminId: string) => {
    const admin = availableUsers.find((u) => u.id === adminId);
    if (!admin) return;

    if (passwordInput !== (admin.password || 'vizio')) {
      setErrorMsg('Senha incorreta para o Administrador.');
      return;
    }

    setCurrentUser(admin);
    addActivityLog('admin_login', `Login de Administrador realizado por ${admin.name}.`);
    addToast(`Bem-vindo, ${admin.name}! Acesso de Administrador liberado.`, 'success');
    if (onClose) onClose();
  };

  // Google / Gmail login
  const handleGoogleLogin = () => {
    // If logging in as Vinicius Maurelli (user email is viniciusmaurelli@gmail.com)
    const vinicius = availableUsers.find((u) => u.email === 'viniciusmaurelli@gmail.com' || u.id === 'u1');
    if (vinicius) {
      setCurrentUser(vinicius);
      addToast(`Autenticado com sucesso via Google como ${vinicius.name} (CEO)`, 'success');
      if (onClose) onClose();
      return;
    }

    // Otherwise standard google signup
    setAuthMode('pending_approval');
    setPendingUserEmail('novo.usuario@gmail.com');
  };

  // Team member registration (Pending approval)
  const handleRegisterTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) {
      setErrorMsg('Preencha seu nome e e-mail corporativo.');
      return;
    }

    setPendingUserEmail(emailInput);
    setAuthMode('pending_approval');
    addToast('Solicitação de acesso enviada para aprovação dos 3 ADMs!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#141414] via-black to-[#141414] p-6 text-white text-center relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex justify-center mb-3">
            <VizioLogo variant="white" size="md" />
          </div>
          <h3 className="text-lg font-bold font-['Space_Grotesk',sans-serif]">
            Acesso Corporativo Seguro
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Acesso irrestrito aos 3 Administradores. Demais membros necessitam de aprovação prévia.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* PENDING APPROVAL SCREEN */}
          {authMode === 'pending_approval' ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center border-2 border-amber-200 animate-pulse">
                <Clock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-gray-900">
                  Aguardando Aprovação de um dos ADMs
                </h4>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Sua conta (<strong className="text-gray-900">{pendingUserEmail}</strong>) foi registrada.
                  Para acessar o sistema, é necessária a liberação por um dos 3 Administradores:
                </p>
              </div>

              {/* 3 Admins Badge List */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left space-y-2 text-xs">
                <span className="font-bold text-[10px] uppercase tracking-wider text-gray-500 block">
                  Administradores Responsáveis:
                </span>
                {officialAdmins.map((adm) => (
                  <div key={adm.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <img src={adm.avatar} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-gray-800">{adm.name}</span>
                    </div>
                    <span className="text-[10px] text-[#FF5B00] font-semibold">{adm.roleTitle}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setAuthMode('login')}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
              >
                Voltar para o Login
              </button>
            </div>
          ) : (
            <>
              {/* GOOGLE / GMAIL LOGIN BUTTON */}
              <div>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continuar com Google / Gmail</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-px bg-gray-200 flex-1" />
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                  Ou acesse como Administrador
                </span>
                <span className="h-px bg-gray-200 flex-1" />
              </div>

              {/* 3 ADMs DIRECT ACCESS SELECTOR */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700">
                  Selecione o Administrador (Acesso Total):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {officialAdmins.map((adm) => {
                    const isSelected = selectedAdminId === adm.id;
                    return (
                      <button
                        key={adm.id}
                        type="button"
                        onClick={() => setSelectedAdminId(adm.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#FF5B00] bg-orange-50/50 ring-2 ring-[#FF5B00]/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={adm.avatar}
                            alt={adm.name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                          {isSelected && <ShieldCheck className="w-4 h-4 text-[#FF5B00] shrink-0" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-900 block truncate">
                            {adm.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium block truncate">
                            {adm.roleTitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Senha de Administrador:
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Senha do ADM"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#FF5B00]"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMsg}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleAdminLogin(selectedAdminId)}
                  className="w-full py-3 bg-[#FF5B00] hover:bg-[#E65F00] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Entrar como Administrador</span>
                </button>
              </div>

              {/* Registration footer link */}
              <div className="text-center pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  É novo colaborador da agência?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('pending_approval');
                      setPendingUserEmail('seu.email@viziomidia.com.br');
                    }}
                    className="text-[#FF5B00] font-bold hover:underline"
                  >
                    Solicitar cadastro e aprovação
                  </button>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
