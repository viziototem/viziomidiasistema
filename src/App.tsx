import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NewItemModal } from './components/NewItemModal';
import { ToastContainer } from './components/ToastContainer';

// Views
import { DashboardView } from './views/DashboardView';
import { TasksView } from './views/TasksView';
import { ClientsView } from './views/ClientsView';
import { ProjectsView } from './views/ProjectsView';
import { CrmView } from './views/CrmView';
import { FilesView } from './views/FilesView';
import { ClientPortalView } from './views/ClientPortalView';
import { FinanceView } from './views/FinanceView';
import { ReportsView } from './views/ReportsView';
import { NotificationsView } from './views/NotificationsView';
import { AdminView } from './views/AdminView';
import { FinanceCalculationView } from './views/FinanceCalculationView';
import { WhatsAppChatView } from './views/WhatsAppChatView';
import { SplashScreen } from './components/SplashScreen';
import { AuthModal } from './components/AuthModal';

const MainLayout: React.FC = () => {
  const {
    activeSection,
    isClientUser,
    currentUser,
    appBgTheme,
    authModalOpen,
    setAuthModalOpen,
  } = useApp();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(() => {
    return !sessionStorage.getItem('vizio_splash_shown');
  });

  const handleFinishSplash = () => {
    sessionStorage.setItem('vizio_splash_shown', 'true');
    setShowSplash(false);
  };

  const renderActiveView = () => {
    // If logged in as client user and tries to access internal sections, default to client portal
    if (isClientUser && ['Dashboard', 'CRM', 'Administração', 'Relatórios', 'Cálculo Financeiro', 'Chat da Equipe'].includes(activeSection)) {
      return <ClientPortalView />;
    }

    switch (activeSection) {
      case 'Chat da Equipe':
        return <WhatsAppChatView />;
      case 'Cálculo Financeiro':
        if (currentUser.role !== 'admin') {
          return <DashboardView />;
        }
        return <FinanceCalculationView />;
      case 'Dashboard':
        return <DashboardView />;
      case 'Tarefas':
        return <TasksView />;
      case 'Clientes':
        return <ClientsView />;
      case 'Projetos':
        return <ProjectsView />;
      case 'CRM':
        return <CrmView />;
      case 'Arquivos':
        return <FilesView />;
      case 'Área do Cliente':
        return <ClientPortalView />;
      case 'Relatórios':
        return <ReportsView />;
      case 'Notificações':
        return <NotificationsView />;
      case 'Administração':
      case 'Configurações':
        return <AdminView />;
      case 'Equipe':
        return <AdminView />;
      case 'Calendário':
        return <TasksView />;
      default:
        return <DashboardView />;
    }
  };

  // Background color classes for themes
  const bgClasses: Record<string, string> = {
    light: 'bg-[#F8F9FA] text-[#111111]',
    charcoal: 'bg-[#18181B] text-gray-100',
    dark: 'bg-[#0F0F10] text-gray-100',
    slate: 'bg-[#0F172A] text-gray-100',
    warm: 'bg-[#F5F5F0] text-[#111111]',
    zinc: 'bg-[#27272A] text-gray-100',
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleFinishSplash} />}

      <div className={`flex h-screen w-screen overflow-hidden ${bgClasses[appBgTheme] || bgClasses.light} antialiased transition-colors duration-200`}>
        {/* Primary Sidebar */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main App Content Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {/* Top Navbar */}
          <TopNav onToggleMobileMenu={() => setMobileOpen(!mobileOpen)} />

          {/* Scrollable View Container */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>

        {/* Global Modals & Notifications */}
        <GlobalSearchModal />
        <NewItemModal />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        <ToastContainer />
      </div>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
