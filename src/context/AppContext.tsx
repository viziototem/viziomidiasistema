import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Client,
  Project,
  Task,
  Lead,
  ClientFile,
  CalendarEvent,
  NotificationItem,
  ClientAccessRequest,
  ActivityLogItem,
  ClientMessage,
  TaskStatus,
  LeadStage,
  ClientFinancialRecord,
  CompanyFinancialConfig,
  FixedExpenseItem,
  AppBgTheme,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_LEADS,
  INITIAL_FILES,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACCESS_REQUESTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_CLIENT_MESSAGES,
  INITIAL_FINANCIAL_RECORDS,
  INITIAL_FINANCIAL_CONFIG,
} from '../data/mockData';

export type SectionType = 
  | 'Dashboard'
  | 'Tarefas'
  | 'Projetos'
  | 'Clientes'
  | 'CRM'
  | 'Calendário'
  | 'Arquivos'
  | 'Relatórios'
  | 'Equipe'
  | 'Notificações'
  | 'Configurações'
  | 'Área do Cliente'
  | 'Administração'
  | 'Cálculo Financeiro'
  | 'Chat da Equipe';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  
  // Data
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;

  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadStage: (leadId: string, newStage: LeadStage) => void;

  files: ClientFile[];
  addFile: (file: Omit<ClientFile, 'id' | 'uploadedAt'>) => void;
  deleteFile: (id: string) => void;

  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  accessRequests: ClientAccessRequest[];
  approveAccessRequest: (requestId: string) => void;
  rejectAccessRequest: (requestId: string) => void;

  messages: ClientMessage[];
  sendMessage: (clientId: string, text: string, attachmentName?: string) => void;

  activityLogs: ActivityLogItem[];
  addActivityLog: (action: string, details: string) => void;

  // Financial calculation & reporting (Admin only)
  financialRecords: ClientFinancialRecord[];
  financialConfig: CompanyFinancialConfig;
  updateClientFinancialRecord: (record: ClientFinancialRecord) => void;
  updateFinancialConfig: (config: CompanyFinancialConfig) => void;
  addFixedExpense: (item: Omit<FixedExpenseItem, 'id'>) => void;
  deleteFixedExpense: (id: string) => void;

  // User profile & theme customizations
  updateCurrentUserProfile: (data: Partial<User>) => void;
  appBgTheme: AppBgTheme;
  setAppBgTheme: (theme: AppBgTheme) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Global modals
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  newItemModalOpen: boolean;
  setNewItemModalOpen: (open: boolean) => void;
  newItemDefaultType: 'task' | 'client' | 'project' | 'lead' | 'file';
  setNewItemDefaultType: (type: 'task' | 'client' | 'project' | 'lead' | 'file') => void;

  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Helper
  isClientUser: boolean;
  currentClientDetails: Client | undefined;
  hasPermission: (permission: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helpers
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`vizio_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [availableUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    return loadState('current_user', INITIAL_USERS[0]);
  });

  const [activeSection, setActiveSectionState] = useState<SectionType>(() => {
    const isClient = currentUser.role === 'client';
    return isClient ? 'Área do Cliente' : 'Dashboard';
  });

  const [clients, setClients] = useState<Client[]>(() => loadState('clients', INITIAL_CLIENTS));
  const [projects, setProjects] = useState<Project[]>(() => loadState('projects', INITIAL_PROJECTS));
  const [tasks, setTasks] = useState<Task[]>(() => loadState('tasks', INITIAL_TASKS));
  const [leads, setLeads] = useState<Lead[]>(() => loadState('leads', INITIAL_LEADS));
  const [files, setFiles] = useState<ClientFile[]>(() => loadState('files', INITIAL_FILES));
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadState('events', INITIAL_EVENTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadState('notifications', INITIAL_NOTIFICATIONS));
  const [accessRequests, setAccessRequests] = useState<ClientAccessRequest[]>(() => loadState('access_requests', INITIAL_ACCESS_REQUESTS));
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => loadState('activity_logs', INITIAL_ACTIVITY_LOGS));
  const [messages, setMessages] = useState<ClientMessage[]>(() => loadState('messages', INITIAL_CLIENT_MESSAGES));
  const [financialRecords, setFinancialRecords] = useState<ClientFinancialRecord[]>(() => loadState('financial_records', INITIAL_FINANCIAL_RECORDS));
  const [financialConfig, setFinancialConfig] = useState<CompanyFinancialConfig>(() => loadState('financial_config', INITIAL_FINANCIAL_CONFIG));

  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [newItemDefaultType, setNewItemDefaultType] = useState<'task' | 'client' | 'project' | 'lead' | 'file'>('task');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [appBgTheme, setAppBgThemeState] = useState<AppBgTheme>(() => {
    return loadState('app_bg_theme', 'light');
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('vizio_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vizio_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('vizio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('vizio_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('vizio_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('vizio_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('vizio_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('vizio_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('vizio_access_requests', JSON.stringify(accessRequests));
  }, [accessRequests]);

  useEffect(() => {
    localStorage.setItem('vizio_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('vizio_financial_records', JSON.stringify(financialRecords));
  }, [financialRecords]);

  useEffect(() => {
    localStorage.setItem('vizio_financial_config', JSON.stringify(financialConfig));
  }, [financialConfig]);

  useEffect(() => {
    localStorage.setItem('vizio_app_bg_theme', JSON.stringify(appBgTheme));
  }, [appBgTheme]);

  const setAppBgTheme = (theme: AppBgTheme) => {
    setAppBgThemeState(theme);
    addToast('Cor de fundo e tema visual atualizados!', 'success');
  };

  const updateCurrentUserProfile = (data: Partial<User>) => {
    const updated: User = { ...currentUser, ...data };
    setCurrentUserState(updated);
    addActivityLog('updated_profile', `Atualizou informações do perfil pessoal (${updated.name}).`);
    addToast('Perfil pessoal atualizado com sucesso!', 'success');
  };

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivityLog = (action: string, details: string) => {
    const newLog: ActivityLogItem = {
      id: 'act_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    if (user.role === 'client') {
      setActiveSectionState('Área do Cliente');
    } else if (activeSection === 'Área do Cliente') {
      setActiveSectionState('Dashboard');
    } else if (user.role !== 'admin' && activeSection === 'Cálculo Financeiro') {
      setActiveSectionState('Dashboard');
    }
    addToast(`Perfil alterado para ${user.name} (${user.roleTitle})`, 'info');
  };

  const setActiveSection = (section: SectionType) => {
    if (section === 'Cálculo Financeiro' && currentUser.role !== 'admin') {
      addToast('Acesso Restrito: Apenas Administradores têm permissão para acessar o Cálculo Financeiro.', 'error');
      return;
    }
    setActiveSectionState(section);
  };

  // Financial calculation operations (Admin only)
  const updateClientFinancialRecord = (updated: ClientFinancialRecord) => {
    setFinancialRecords((prev) => {
      const index = prev.findIndex((r) => r.clientId === updated.clientId);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = { ...updated, updatedAt: new Date().toISOString().split('T')[0] };
        return copy;
      }
      return [...prev, { ...updated, updatedAt: new Date().toISOString().split('T')[0] }];
    });
    addActivityLog('updated_financials', `Atualizou métricas financeiras do cliente ID: ${updated.clientId}.`);
    addToast('Parâmetros financeiros do cliente atualizados com sucesso!', 'success');
  };

  const updateFinancialConfig = (config: CompanyFinancialConfig) => {
    setFinancialConfig(config);
    addActivityLog('updated_tax_config', `Atualizou parâmetros de regime tributário (${config.companyTaxRegime}) e alíquota geral.`);
    addToast('Parâmetros tributários e financeiros da empresa atualizados!', 'success');
  };

  const addFixedExpense = (item: Omit<FixedExpenseItem, 'id'>) => {
    const newItem: FixedExpenseItem = {
      ...item,
      id: 'fix_' + Date.now(),
    };
    setFinancialConfig((prev) => ({
      ...prev,
      fixedExpenses: [newItem, ...prev.fixedExpenses],
    }));
    addToast(`Custo fixo "${item.name}" adicionado.`, 'success');
  };

  const deleteFixedExpense = (id: string) => {
    setFinancialConfig((prev) => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.filter((e) => e.id !== id),
    }));
    addToast('Custo fixo removido com sucesso.', 'info');
  };

  // Client operations
  const addClient = (data: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...data,
      id: 'c_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);

    // Automatically provision financial record for this client
    const newFinRecord: ClientFinancialRecord = {
      clientId: newClient.id,
      monthlyFee: newClient.monthlyValue || 0,
      extraRevenue: 0,
      taxRatePercent: financialConfig.defaultTaxRatePercent || 6,
      mediaInvestmentBudget: 0,
      teamCostAllocated: (newClient.monthlyValue || 0) * 0.3,
      directExpenses: 350,
      notes: `Contrato cadastrado em ${newClient.createdAt}.`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setFinancialRecords((prev) => [newFinRecord, ...prev]);

    addActivityLog('created_client', `Cadastrou o cliente ${newClient.companyName}.`);
    addToast(`Cliente "${newClient.companyName}" cadastrado com sucesso!`);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    if (updates.monthlyValue !== undefined) {
      setFinancialRecords((prev) =>
        prev.map((r) => (r.clientId === id ? { ...r, monthlyFee: updates.monthlyValue! } : r))
      );
    }
    addToast('Dados do cliente atualizados com sucesso!');
  };

  const deleteClient = (id: string) => {
    const target = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    setFinancialRecords((prev) => prev.filter((r) => r.clientId !== id));
    addToast(`Cliente ${target?.companyName || ''} removido com sucesso.`);
  };

  // Project operations
  const addProject = (data: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...data,
      id: 'p_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProject, ...prev]);
    addActivityLog('created_project', `Criou o projeto "${newProject.title}".`);
    addToast(`Projeto "${newProject.title}" criado com sucesso!`);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Projeto atualizado com sucesso!');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addToast('Projeto removido.');
  };

  // Task operations
  const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newTask: Task = {
      ...data,
      id: 't_' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
    addActivityLog('created_task', `Criou a tarefa "${newTask.title}".`);
    addToast(`Tarefa "${newTask.title}" adicionada!`);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const now = new Date().toISOString().split('T')[0];
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: now } : t))
    );
    addToast('Tarefa atualizada com sucesso!');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast('Tarefa removida.');
  };

  const moveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target || target.status === newStatus) return;

    const now = new Date().toISOString().split('T')[0];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, updatedAt: now } : t
      )
    );

    if (newStatus === 'Concluído') {
      addActivityLog('completed_task', `Concluiu a tarefa "${target.title}".`);
      addToast(`🎉 Tarefa "${target.title}" concluída!`);
    } else {
      addToast(`Tarefa movida para "${newStatus}"`);
    }
  };

  // CRM Leads
  const addLead = (data: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...data,
      id: 'l_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    addToast(`Lead "${newLead.companyName}" adicionado ao pipeline!`);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
    addToast('Oportunidade atualizada!');
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    addToast('Lead removido do pipeline.');
  };

  const moveLeadStage = (leadId: string, newStage: LeadStage) => {
    const target = leads.find((l) => l.id === leadId);
    if (!target || target.stage === newStage) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );

    if (newStage === 'Fechado') {
      addToast(`🚀 Parabéns! Negócio fechado com ${target.companyName}!`);
    } else {
      addToast(`Lead avançado para "${newStage}"`);
    }
  };

  // File operations
  const addFile = (data: Omit<ClientFile, 'id' | 'uploadedAt'>) => {
    const newFile: ClientFile = {
      ...data,
      id: 'f_' + Date.now(),
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setFiles((prev) => [newFile, ...prev]);
    addActivityLog('uploaded_file', `Enviou o arquivo "${newFile.name}".`);

    // Create notification if client uploaded
    if (data.uploadedByRole === 'client') {
      const newNotif: NotificationItem = {
        id: 'notif_' + Date.now(),
        title: 'Novo arquivo enviado pelo cliente',
        message: `${data.uploadedBy} enviou o arquivo "${newFile.name}".`,
        type: 'client_uploaded_file',
        createdAt: 'Agora',
        read: false,
        linkSection: 'Arquivos',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    addToast(`Arquivo "${newFile.name}" enviado com sucesso!`);
  };

  const deleteFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    addActivityLog('deleted_file', `Excluiu o arquivo "${file?.name || ''}".`);
    addToast('Arquivo excluído com sucesso.');
  };

  // Events
  const addEvent = (data: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...data,
      id: 'ev_' + Date.now(),
    };
    setEvents((prev) => [...prev, newEvent]);
    addToast(`Evento "${newEvent.title}" adicionado ao calendário!`);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addToast('Evento removido.');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Todas as notificações foram marcadas como lidas.');
  };

  // Access requests (Client approval workflow)
  const approveAccessRequest = (requestId: string) => {
    const req = accessRequests.find((r) => r.id === requestId);
    if (!req) return;

    setAccessRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );

    addActivityLog(
      'approved_client',
      `Aprovou o acesso de ${req.clientName} (${req.companyName}).`
    );

    // Notify in system
    const notif: NotificationItem = {
      id: 'notif_' + Date.now(),
      title: 'Cliente Aprovado',
      message: `Acesso aprovado para ${req.clientName} (${req.companyName}). Notificação de confirmação enviada.`,
      type: 'client_approved',
      createdAt: 'Agora',
      read: false,
      linkSection: 'Administração',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(`Acesso de ${req.clientName} aprovado com sucesso!`);
  };

  const rejectAccessRequest = (requestId: string) => {
    const req = accessRequests.find((r) => r.id === requestId);
    if (!req) return;

    setAccessRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );

    addActivityLog(
      'rejected_client',
      `Recusou a solicitação de acesso de ${req.clientName} (${req.companyName}).`
    );

    addToast(`Solicitação de ${req.clientName} recusada.`, 'warning');
  };

  // Messaging in client portal
  const sendMessage = (clientId: string, text: string, attachmentName?: string) => {
    const isClient = currentUser.role === 'client';
    const newMsg: ClientMessage = {
      id: 'msg_' + Date.now(),
      clientId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: isClient ? 'client' : 'internal',
      text,
      attachmentName,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    addActivityLog('sent_message', `Enviou mensagem no canal do cliente.`);
  };

  // Permissions helper based on user_roles schema
  const hasPermission = (permission: string): boolean => {
    const role = currentUser.role;
    if (role === 'admin') return true;
    if (role === 'manager') {
      const allowed = [
        'view_all_projects',
        'manage_tasks',
        'manage_clients',
        'view_reports',
        'manage_team',
        'view_dashboard',
        'upload_files',
      ];
      return allowed.includes(permission);
    }
    if (role === 'employee') {
      const allowed = [
        'view_dashboard',
        'view_clients',
        'view_projects',
        'create_tasks',
        'edit_tasks',
        'upload_files',
        'view_reports',
      ];
      return allowed.includes(permission);
    }
    if (role === 'client') {
      const allowed = [
        'view_own_company',
        'view_own_projects',
        'view_own_tasks',
        'upload_files',
        'download_files',
        'send_messages',
        'view_notifications',
      ];
      return allowed.includes(permission);
    }
    return false;
  };

  const isClientUser = currentUser.role === 'client';
  const currentClientDetails = currentUser.clientId
    ? clients.find((c) => c.id === currentUser.clientId)
    : undefined;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
        activeSection,
        setActiveSection,
        clients,
        addClient,
        updateClient,
        deleteClient,
        projects,
        addProject,
        updateProject,
        deleteProject,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        leads,
        addLead,
        updateLead,
        deleteLead,
        moveLeadStage,
        files,
        addFile,
        deleteFile,
        events,
        addEvent,
        deleteEvent,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        accessRequests,
        approveAccessRequest,
        rejectAccessRequest,
        messages,
        sendMessage,
        activityLogs,
        addActivityLog,
        financialRecords,
        financialConfig,
        updateClientFinancialRecord,
        updateFinancialConfig,
        addFixedExpense,
        deleteFixedExpense,
        updateCurrentUserProfile,
        appBgTheme,
        setAppBgTheme,
        authModalOpen,
        setAuthModalOpen,
        globalSearchOpen,
        setGlobalSearchOpen,
        newItemModalOpen,
        setNewItemModalOpen,
        newItemDefaultType,
        setNewItemDefaultType,
        toasts,
        addToast,
        removeToast,
        isClientUser,
        currentClientDetails,
        hasPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
