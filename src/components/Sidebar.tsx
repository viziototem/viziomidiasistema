import React from 'react';
import { useApp, SectionType } from '../context/AppContext';
import { VizioLogo } from './VizioLogo';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  Target,
  Calendar,
  FileBox,
  BarChart3,
  Users2,
  Bell,
  Settings,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
  Zap,
  Calculator,
  MessageCircle,
  KeyRound,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeSection,
    setActiveSection,
    currentUser,
    setCurrentUser,
    availableUsers,
    tasks,
    clients,
    notifications,
    accessRequests,
    isClientUser,
    setAuthModalOpen,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingRequestsCount = accessRequests.filter((r) => r.status === 'pending').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Concluído').length;

  const internalNavItems: {
    section: SectionType;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { section: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      section: 'Tarefas',
      label: 'Tarefas',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: pendingTasksCount,
      badgeColor: 'bg-[#FF6A00]/20 text-[#FF6A00]',
    },
    { section: 'Projetos', label: 'Projetos', icon: <FolderKanban className="w-5 h-5" /> },
    {
      section: 'Clientes',
      label: 'Clientes',
      icon: <Users className="w-5 h-5" />,
      badge: clients.length,
    },
    { section: 'CRM', label: 'CRM Comercial', icon: <Target className="w-5 h-5" /> },
    { section: 'Calendário', label: 'Calendário', icon: <Calendar className="w-5 h-5" /> },
    { section: 'Arquivos', label: 'Arquivos & Mídia', icon: <FileBox className="w-5 h-5" /> },
    {
      section: 'Chat da Equipe',
      label: 'Chat da Equipe',
      icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
      badge: 'WhatsApp',
      badgeColor: 'bg-emerald-500/20 text-emerald-400',
    },
    { section: 'Relatórios', label: 'Relatórios', icon: <BarChart3 className="w-5 h-5" /> },
    { section: 'Equipe', label: 'Equipe', icon: <Users2 className="w-5 h-5" /> },
    {
      section: 'Notificações',
      label: 'Notificações',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-[#FF6A00] text-white',
    },
    { section: 'Configurações', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ];

  if (currentUser.role === 'admin') {
    internalNavItems.push({
      section: 'Cálculo Financeiro',
      label: 'Cálculo Financeiro',
      icon: <Calculator className="w-5 h-5" />,
      badge: 'ADM',
      badgeColor: 'bg-[#FF6A00]/20 text-[#FF6A00] font-bold text-[10px]',
    });
    internalNavItems.push({
      section: 'Administração',
      label: 'Administração',
      icon: <ShieldCheck className="w-5 h-5" />,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} pendente` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400',
    });
  }

  // Client external view items
  const clientNavItems: {
    section: SectionType;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { section: 'Área do Cliente', label: 'Portal do Cliente', icon: <Building2 className="w-5 h-5" /> },
    {
      section: 'Tarefas',
      label: 'Minhas Entregas',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: tasks.filter((t) => t.clientId === currentUser.clientId && t.visibleToClient).length,
    },
    { section: 'Projetos', label: 'Projetos em Curso', icon: <FolderKanban className="w-5 h-5" /> },
    { section: 'Arquivos', label: 'Arquivos & Uploads', icon: <FileBox className="w-5 h-5" /> },
    { section: 'Calendário', label: 'Prazos & Reuniões', icon: <Calendar className="w-5 h-5" /> },
    {
      section: 'Notificações',
      label: 'Notificações',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const currentNav = isClientUser ? clientNavItems : internalNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#141414] text-gray-200 border-r border-[#242424] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top brand header */}
        <div className="flex flex-col">
          <div className="h-20 px-5 flex items-center justify-between border-b border-[#242424]">
            <div className="flex flex-col justify-center gap-1.5">
              <VizioLogo variant="white" size="md" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pl-1">
                {isClientUser ? 'Portal do Cliente' : 'Sistema de Gestão'}
              </span>
            </div>
          </div>

          {/* Quick status badge if client */}
          {isClientUser && (
            <div className="mx-4 mt-4 p-3 rounded-xl bg-[#1E1E1E] border border-amber-500/30 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser.companyName || 'Empresa Cliente'}
                </p>
                <p className="text-[11px] text-gray-400">Ambiente Seguro & Isolado</p>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {isClientUser ? 'Menu do Cliente' : 'Menu Principal'}
            </div>

            {currentNav.map((item) => {
              const isActive = activeSection === item.section;
              return (
                <button
                  key={item.section}
                  id={`nav-${item.section.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setActiveSection(item.section);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF6A00] text-white shadow-md shadow-[#FF6A00]/25 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-[#2A2A2A] text-gray-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick link to Client Portal for internal team */}
            {!isClientUser && (
              <div className="pt-2">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Visão Externa
                </div>
                <button
                  id="nav-client-portal-preview"
                  onClick={() => {
                    setActiveSection('Área do Cliente');
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeSection === 'Área do Cliente'
                      ? 'bg-[#1E1E1E] text-[#FF6A00] border border-[#FF6A00]/30 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-[#1E1E1E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-[#FF6A00]" />
                    <span>Ver Área do Cliente</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Profile & Role Switcher */}
        <div className="p-3 border-t border-[#242424] bg-[#101010]/80">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Perfil Ativo</span>
            <span className="flex items-center gap-1 text-[10px] text-[#FF6A00]">
              <Sparkles className="w-3 h-3" />
              Demo Multi-Role
            </span>
          </div>

          {/* Current user card with selector */}
          <div className="mt-1.5 p-2.5 rounded-xl bg-[#1A1A1A] border border-[#2D2D2D] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#FF6A00] shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      currentUser.role === 'admin'
                        ? 'bg-red-400'
                        : currentUser.role === 'manager'
                        ? 'bg-amber-400'
                        : currentUser.role === 'employee'
                        ? 'bg-blue-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium truncate">
                    {currentUser.roleTitle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 CEOs and Auth switcher */}
          <div className="mt-2 space-y-1.5">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">
              Trocar Administrador / CEO:
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setCurrentUser(availableUsers[0])}
                className={`px-1.5 py-1 rounded-lg text-[9px] font-bold transition-colors truncate ${
                  currentUser.id === 'u1'
                    ? 'bg-[#FF5B00] text-white'
                    : 'bg-[#222222] text-gray-300 hover:text-white'
                }`}
                title="Vinicius Maurelli (CEO - Marketing)"
              >
                Vinicius
              </button>
              <button
                onClick={() => setCurrentUser(availableUsers[1])}
                className={`px-1.5 py-1 rounded-lg text-[9px] font-bold transition-colors truncate ${
                  currentUser.id === 'u2'
                    ? 'bg-[#FF5B00] text-white'
                    : 'bg-[#222222] text-gray-300 hover:text-white'
                }`}
                title="Fabrizio Rangel (CEO - Comercial)"
              >
                Fabrizio
              </button>
              <button
                onClick={() => setCurrentUser(availableUsers[2])}
                className={`px-1.5 py-1 rounded-lg text-[9px] font-bold transition-colors truncate ${
                  currentUser.id === 'u3'
                    ? 'bg-[#FF5B00] text-white'
                    : 'bg-[#222222] text-gray-300 hover:text-white'
                }`}
                title="Diego (CEO - Comercial)"
              >
                Diego
              </button>
            </div>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-1.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3 h-3 text-[#FF5B00]" />
              <span>Acesso Gmail & Senha</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
