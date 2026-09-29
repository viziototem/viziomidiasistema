import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VizioLogo } from './VizioLogo';
import { playVizioBrandChime } from '../utils/audioChime';
import {
  Menu,
  Search,
  Plus,
  Bell,
  CheckSquare,
  Users,
  FolderKanban,
  Target,
  FileUp,
  FileText,
  CheckCircle2,
  ChevronDown,
  Building2,
  Shield,
  Sparkles,
  X,
  Volume2,
  KeyRound,
  User as UserIcon,
} from 'lucide-react';

interface TopNavProps {
  onToggleMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleMobileMenu }) => {
  const {
    activeSection,
    currentUser,
    setCurrentUser,
    availableUsers,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setGlobalSearchOpen,
    setNewItemModalOpen,
    setNewItemDefaultType,
    isClientUser,
    setAuthModalOpen,
    setActiveSection,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.read);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
        setQuickCreateOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenQuickCreate = (type: 'task' | 'client' | 'project' | 'lead' | 'file') => {
    setNewItemDefaultType(type);
    setNewItemModalOpen(true);
    setQuickCreateOpen(false);
  };

  return (
    <header
      id="top-navigation"
      className="h-18 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs"
    >
      {/* Left side: Hamburger + Brand + Active Section name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex items-center pr-2 border-r border-gray-200">
          <VizioLogo variant="dark" size="sm" />
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900 font-['Space_Grotesk',sans-serif] tracking-tight">
            {activeSection}
          </h1>
          {activeSection === 'Cálculo Financeiro' && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/25">
              Exclusivo ADM
            </span>
          )}
          {isClientUser && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Building2 className="w-3 h-3" />
              {currentUser.companyName}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Global search bar trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-left group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            <span className="text-xs text-gray-500">
              Buscar tarefas, clientes, projetos, arquivos...
            </span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-md shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Quick Action, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search on mobile */}
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="md:hidden p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          title="Pesquisar"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Quick Create Button "+ Novo" (internal users only or limited for client) */}
        {!isClientUser ? (
          <div className="relative" ref={quickRef}>
            <button
              id="btn-quick-create"
              onClick={() => setQuickCreateOpen(!quickCreateOpen)}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#FF6A00] hover:bg-[#E65F00] text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-[#FF6A00]/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Criar</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {quickCreateOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Criar Novo Item
                </div>
                <button
                  onClick={() => handleOpenQuickCreate('task')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6A00] transition-colors text-left"
                >
                  <CheckSquare className="w-4 h-4 text-[#FF6A00]" />
                  <span>Nova Tarefa</span>
                </button>
                <button
                  onClick={() => handleOpenQuickCreate('client')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6A00] transition-colors text-left"
                >
                  <Users className="w-4 h-4 text-[#FF6A00]" />
                  <span>Novo Cliente</span>
                </button>
                <button
                  onClick={() => handleOpenQuickCreate('project')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6A00] transition-colors text-left"
                >
                  <FolderKanban className="w-4 h-4 text-[#FF6A00]" />
                  <span>Novo Projeto</span>
                </button>
                <button
                  onClick={() => handleOpenQuickCreate('lead')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6A00] transition-colors text-left"
                >
                  <Target className="w-4 h-4 text-[#FF6A00]" />
                  <span>Adicionar Lead (CRM)</span>
                </button>
                <button
                  onClick={() => handleOpenQuickCreate('file')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6A00] transition-colors text-left"
                >
                  <FileUp className="w-4 h-4 text-[#FF6A00]" />
                  <span>Enviar Arquivo</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => handleOpenQuickCreate('file')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FF6A00] hover:bg-[#E65F00] text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-[#FF6A00]/25"
          >
            <FileUp className="w-4 h-4" />
            <span>Enviar Material</span>
          </button>
        )}

        {/* Brand Sound Button */}
        <button
          onClick={() => playVizioBrandChime(0.35)}
          className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Tocar Som Oficial da Logo Vizio"
        >
          <Volume2 className="w-5 h-5 text-[#FF5B00]" />
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF6A00] rounded-full ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-900">Notificações</h3>
                  {unreadNotifications.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6A00] text-white">
                      {unreadNotifications.length} novas
                    </span>
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#FF6A00] hover:underline font-semibold"
                  >
                    Marcar lidas
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">Nenhuma notificação.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3 rounded-xl transition-colors cursor-pointer text-left ${
                        notif.read ? 'bg-gray-50/70 hover:bg-gray-100' : 'bg-orange-50/60 border border-orange-100 hover:bg-orange-100/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-gray-900 leading-snug">{notif.title}</h4>
                        <span className="text-[10px] text-gray-400 shrink-0">{notif.createdAt}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Dropdown */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200/60"
            title="Alternar Papel / Usuário"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#FF6A00]"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                {currentUser.roleTitle}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 border-b border-gray-100 mb-2">
                <p className="text-xs font-bold text-gray-900">Simulação de Perfis</p>
                <p className="text-[11px] text-gray-500">
                  Troque de usuário instantaneamente para testar o sistema sob diferentes permissões:
                </p>
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {availableUsers.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-orange-50 border border-orange-200 text-gray-900'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate">{user.name}</p>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.5 rounded-sm font-bold ${
                              user.role === 'admin'
                                ? 'bg-red-100 text-red-700'
                                : user.role === 'manager'
                                ? 'bg-amber-100 text-amber-700'
                                : user.role === 'employee'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">
                          {user.companyName ? user.companyName : user.roleTitle}
                        </p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions in Dropdown */}
              <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
                <button
                  onClick={() => {
                    setActiveSection('Configurações');
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors text-left"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#FF5B00]" />
                  <span>Editar Meu Perfil & Foto</span>
                </button>

                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setRoleSwitcherOpen(false);
                  }}
                  className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold text-[#FF5B00] hover:bg-orange-50 flex items-center gap-2 transition-colors text-left"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Entrar com Gmail / 3 ADMs</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
