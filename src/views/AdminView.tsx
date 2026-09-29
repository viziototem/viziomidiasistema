import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VizioLogo } from '../components/VizioLogo';
import { VizioIcon } from '../components/VizioIcon';
import { AppBgTheme, User, UserRole } from '../types';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  AlertTriangle,
  Lock,
  Plus,
  Key,
  UserCheck,
  Palette,
  Camera,
  Upload,
  Edit2,
  Sparkles,
  Check,
  Phone,
  Mail,
  User as UserIcon,
  ShieldAlert,
  ShieldCheck,
  Save,
  Trash2,
  X,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    updateCurrentUserProfile,
    availableUsers,
    accessRequests,
    approveAccessRequest,
    rejectAccessRequest,
    activityLogs,
    appBgTheme,
    setAppBgTheme,
    addToast,
    addActivityLog,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'profile' | 'users' | 'approvals' | 'settings' | 'audit'
  >('profile');

  // Profile form state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar);
  const [profileBio, setProfileBio] = useState(currentUser.bio || '');
  const [profileRoleTitle, setProfileRoleTitle] = useState(currentUser.roleTitle);

  // Edit other user modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Preset executive avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  ];

  // Theme palettes
  const themeOptions: {
    id: AppBgTheme;
    name: string;
    description: string;
    bgHex: string;
    previewClass: string;
    isDark: boolean;
  }[] = [
    {
      id: 'light',
      name: 'Clean Light (Padrão)',
      description: 'Branco luminoso com cinza sutil (#F8F9FA)',
      bgHex: '#F8F9FA',
      previewClass: 'bg-[#F8F9FA] text-gray-900 border-gray-300',
      isDark: false,
    },
    {
      id: 'charcoal',
      name: 'Charcoal Executive',
      description: 'Carvão profundo moderno (#18181B)',
      bgHex: '#18181B',
      previewClass: 'bg-[#18181B] text-white border-zinc-700',
      isDark: true,
    },
    {
      id: 'dark',
      name: 'Midnight Pure Dark',
      description: 'Preto ultra-imersivo (#0F0F10)',
      bgHex: '#0F0F10',
      previewClass: 'bg-[#0F0F10] text-white border-gray-800',
      isDark: true,
    },
    {
      id: 'slate',
      name: 'Deep Slate Blue',
      description: 'Azul petróleo corporativo (#0F172A)',
      bgHex: '#0F172A',
      previewClass: 'bg-[#0F172A] text-white border-slate-700',
      isDark: true,
    },
    {
      id: 'warm',
      name: 'Warm Neutral Studio',
      description: 'Creme neutro elegante (#F5F5F0)',
      bgHex: '#F5F5F0',
      previewClass: 'bg-[#F5F5F0] text-gray-900 border-amber-200',
      isDark: false,
    },
    {
      id: 'zinc',
      name: 'Refined Zinc',
      description: 'Cinza chumbo industrial (#27272A)',
      bgHex: '#27272A',
      previewClass: 'bg-[#27272A] text-white border-zinc-600',
      isDark: true,
    },
  ];

  // Save current profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      avatar: profileAvatar,
      bio: profileBio.trim(),
      roleTitle: profileRoleTitle.trim(),
    });
  };

  // 3 official Admins
  const officialAdmins = availableUsers.filter((u) => u.role === 'admin').slice(0, 3);
  const pendingUsers = availableUsers.filter((u) => u.approved === false);

  return (
    <div id="admin-view" className="space-y-6 pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FF5B00]" />
            <h2 className="text-xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
              Configurações, Perfil & Administração
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Gestão do seu perfil de usuário, temas e cores do app, os 3 Administradores e aprovações
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex flex-wrap items-center bg-gray-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveAdminTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeAdminTab === 'profile'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Meu Perfil
          </button>
          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeAdminTab === 'settings'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Cores & Temas do App
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeAdminTab === 'users'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Equipe & 3 ADMs
            {pendingUsers.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5" />
            )}
          </button>
          <button
            onClick={() => setActiveAdminTab('approvals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeAdminTab === 'approvals'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Aprovações ({accessRequests.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeAdminTab === 'audit'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Auditoria
          </button>
        </div>
      </div>

      {/* 1. MY PROFILE & USER PHOTO / DATA CUSTOMIZATION */}
      {activeAdminTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#FF5B00]" />
                Editar Meu Perfil de Usuário
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Altere sua foto de perfil, nome completo, e-mail, telefone e informações profissionais
              </p>
            </div>
            {currentUser.role === 'admin' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/25">
                Administrador Oficial
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
            {/* Avatar Section */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                Foto de Perfil do Usuário
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group shrink-0">
                  <img
                    src={profileAvatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="block text-gray-600 font-semibold">
                    Link da Imagem (URL ou Foto Personalizada):
                  </label>
                  <input
                    type="url"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    placeholder="https://exemplo.com/minha-foto.jpg"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#FF5B00]"
                  />
                </div>
              </div>

              {/* Avatar Presets Selection */}
              <div>
                <span className="text-gray-500 font-semibold block mb-2">
                  Ou escolha um dos avatares executivos predefinidos:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {avatarPresets.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileAvatar(url)}
                      className={`relative rounded-full p-0.5 transition-transform hover:scale-110 ${
                        profileAvatar === url ? 'ring-2 ring-[#FF5B00] ring-offset-2' : ''
                      }`}
                    >
                      <img src={url} className="w-8 h-8 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#FF5B00]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#FF5B00]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Telefone / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#FF5B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Cargo / Função</label>
                <input
                  type="text"
                  value={profileRoleTitle}
                  onChange={(e) => setProfileRoleTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#FF5B00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Mini Biografia / Descrição de Atuação
              </label>
              <textarea
                rows={3}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Ex: Responsável pelo planejamento estratégico de mídia e tráfego pago da Vizio..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#FF5B00]"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF5B00] hover:bg-[#E65F00] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações do Meu Perfil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. THEME & BACKGROUND COLOR SELECTOR & BRAND SPECIFICATIONS */}
      {activeAdminTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          {/* Background Color / Theme Palette Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#FF5B00]" />
                  Cor de Fundo & Tema Visual do Aplicativo
                </h3>
                <p className="text-xs text-gray-500">
                  Selecione a paleta de cores de fundo do sistema. A alteração é aplicada instantaneamente.
                </p>
              </div>
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Tema Ativo: {themeOptions.find((t) => t.id === appBgTheme)?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {themeOptions.map((theme) => {
                const isSelected = appBgTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setAppBgTheme(theme.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-32 ${
                      theme.previewClass
                    } ${
                      isSelected
                        ? 'ring-3 ring-[#FF5B00] shadow-md scale-[1.02]'
                        : 'hover:scale-[1.01] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-extrabold flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-gray-400"
                          style={{ backgroundColor: theme.bgHex }}
                        />
                        {theme.name}
                      </span>
                      {isSelected && (
                        <span className="p-1 rounded-full bg-[#FF5B00] text-white">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] opacity-80">{theme.description}</p>
                      <span className="text-[10px] font-mono opacity-60 mt-1 block font-bold">
                        {theme.bgHex}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Logo Brand Showcase */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">Logotipo Oficial da Vizio Mídia</h3>
                <p className="text-xs text-gray-500">
                  Tipografia e geometria vetorial integrada em conformidade com o arquivo oficial
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ativo no Sistema
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Standalone Icon Preview */}
              <div className="bg-[#141414] p-5 rounded-xl border border-[#242424] flex flex-col justify-between items-center text-center gap-3">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Ícone Oficial (App Icon / Favicon)
                </span>
                <div className="py-3 flex items-center justify-center">
                  <VizioIcon size="lg" />
                </div>
                <a
                  href="/logo-vizio-icon.svg"
                  download="vizio-icone-oficial.svg"
                  className="w-full text-center text-[11px] font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 py-1.5 rounded-lg transition-colors"
                >
                  Baixar Ícone SVG
                </a>
              </div>

              {/* Dark background preview (logo vizio - branco) */}
              <div className="bg-[#141414] p-5 rounded-xl border border-[#242424] flex flex-col justify-between items-center text-center gap-3">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Logo Principal (Dark / Sidebar)
                </span>
                <div className="py-4 flex items-center justify-center">
                  <VizioLogo variant="white" size="md" />
                </div>
                <a
                  href="/logo-vizio-white.svg"
                  download="logo-vizio-branco.svg"
                  className="w-full text-center text-[11px] font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 py-1.5 rounded-lg transition-colors"
                >
                  Baixar SVG Branco
                </a>
              </div>

              {/* Light background preview */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-between items-center text-center gap-3">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Logo Principal (Fundos Claros)
                </span>
                <div className="py-4 flex items-center justify-center">
                  <VizioLogo variant="dark" size="md" />
                </div>
                <a
                  href="/logo-vizio-dark.svg"
                  download="logo-vizio-escuro.svg"
                  className="w-full text-center text-[11px] font-semibold text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 py-1.5 rounded-lg transition-colors"
                >
                  Baixar SVG Escuro
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. USERS MANAGEMENT & 3 ADMs OVERVIEW */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6">
          {/* THE 3 CEOS / ADMS OF VIZIO MIDIA */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF5B00]" />
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk',sans-serif]">
                Os 3 Administradores Oficiais da Vizio Mídia
              </h3>
            </div>
            <p className="text-xs text-gray-300 max-w-2xl">
              Conforme as diretrizes da agência, apenas estes 3 gestores possuem acesso pleno e imediato
              como Administrador. Novos membros necessitam de autorização de um deles para ingressar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {officialAdmins.map((adm, i) => (
                <div
                  key={adm.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-xs"
                >
                  <img
                    src={adm.avatar}
                    alt={adm.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF5B00]"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#FF5B00] tracking-wider block">
                      ADM {i + 1} • CEO
                    </span>
                    <h4 className="font-bold text-sm text-white">{adm.name}</h4>
                    <span className="text-xs text-gray-400 block">{adm.roleTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PENDING APPROVAL FOR NEW TEAM MEMBERS */}
          {pendingUsers.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <h3 className="font-bold text-base">
                  Novos Cadastros Aguardando Aprovação de um ADM ({pendingUsers.length})
                </h3>
              </div>
              <p className="text-xs text-amber-800">
                Usuários que criaram login via Gmail ou formulário e estão aguardando liberação.
              </p>

              <div className="space-y-3">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-sm text-gray-900 block">{user.name}</span>
                        <span className="text-xs text-gray-500 font-mono">{user.email}</span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold ml-2">
                          {user.department || 'Aguardando cargo'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          user.approved = true;
                          user.active = true;
                          addToast(`Acesso liberado para ${user.name}!`, 'success');
                          addActivityLog('approved_user', `Aprovou o acesso do colaborador ${user.name}.`);
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprovar como Colaborador
                      </button>
                      <button
                        onClick={() => {
                          addToast(`Cadastro de ${user.name} recusado.`, 'info');
                        }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl text-xs font-bold transition-colors"
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL TEAM MEMBERS TABLE */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900">Todos os Usuários & Colaboradores</h3>
                <p className="text-xs text-gray-500">
                  Clique para editar a foto, nome, email, telefone ou permissões de qualquer usuário
                </p>
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {availableUsers.length} usuários
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Foto & Nome</th>
                    <th className="py-3 px-4">E-mail</th>
                    <th className="py-3 px-4">Telefone</th>
                    <th className="py-3 px-4">Cargo / Nível</th>
                    <th className="py-3 px-4">Status de Aprovação</th>
                    <th className="py-3 px-4 text-center">Editar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {availableUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">{u.name}</span>
                            <span className="text-[10px] text-gray-400">{u.department || 'Equipe'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">{u.email}</td>
                      <td className="py-3 px-4 text-gray-600">{u.phone || 'Não informado'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/25'
                              : u.role === 'manager'
                              ? 'bg-blue-50 text-blue-700'
                              : u.role === 'client'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.roleTitle}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.approved !== false ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Aprovado
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Pendente ADM
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="Editar dados deste usuário"
                        >
                          <Edit2 className="w-4 h-4 text-[#FF5B00]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. CLIENT ACCESS REQUESTS */}
      {activeAdminTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold block">Fluxo de Segurança do Portal do Cliente:</span>
              Qualquer novo usuário que solicita acesso externo precisa de aprovação explícita de um
              administrador da Vizio Midia para vincular seu perfil à empresa correspondente.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900">
                Solicitações de Acesso ao Portal
              </h3>
              <span className="text-xs text-gray-500 font-semibold">
                {accessRequests.length} solicitações registradas
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {accessRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{req.clientName}</span>
                      <span className="text-xs text-gray-500">• {req.companyName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status === 'approved'
                          ? 'Aprovado'
                          : req.status === 'rejected'
                          ? 'Recusado'
                          : 'Pendente'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Email: <span className="font-mono text-gray-700">{req.email}</span> • Data:{' '}
                      {req.requestedAt}
                    </p>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => approveAccessRequest(req.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejectAccessRequest(req.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl text-xs font-bold transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Recusar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. AUDIT LOGS */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900">Trilha de Auditoria & Segurança</h3>
            <span className="text-xs text-gray-500">{activityLogs.length} eventos registrados</span>
          </div>

          <div className="divide-y divide-gray-100">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-gray-900">{log.userName}</div>
                  <p className="text-gray-600 mt-0.5">{log.details}</p>
                </div>
                <span className="text-gray-400 font-mono shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: EDIT ANY USER'S PHOTO AND PROFILE DATA */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-gray-900">
                Editar Usuário: {editingUser.name}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addToast(`Dados do usuário ${editingUser.name} atualizados com sucesso!`, 'success');
                setEditingUser(null);
              }}
              className="space-y-4 text-xs"
            >
              {/* Photo preview & URL */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <img
                  src={editingUser.avatar}
                  alt={editingUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div className="flex-1">
                  <label className="block text-gray-700 font-bold mb-1">URL da Foto de Perfil</label>
                  <input
                    type="url"
                    value={editingUser.avatar}
                    onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">E-mail</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Telefone</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Cargo / Título</label>
                <input
                  type="text"
                  value={editingUser.roleTitle}
                  onChange={(e) => setEditingUser({ ...editingUser, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF5B00] hover:bg-[#E65F00] text-white font-bold"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
