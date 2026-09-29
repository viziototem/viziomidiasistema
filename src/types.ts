export type UserRole = 'admin' | 'manager' | 'employee' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  roleTitle: string;
  phone?: string;
  clientId?: string; // If client, ties to specific client company
  companyName?: string;
  active: boolean;
  twoFactorEnabled?: boolean;
  permissions?: string[];
  password?: string;
  approved?: boolean;
  loginProvider?: 'email' | 'google' | 'phone';
  department?: string;
  bio?: string;
}

export type ClientStatus = 
  | 'Lead'
  | 'Em Conversa'
  | 'Proposta Enviada'
  | 'Negociação'
  | 'Ativo'
  | 'Pausado'
  | 'Cancelado'
  | 'Ex-Cliente';

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
  cnpj: string;
  address: string;
  contractStart: string;
  contractEnd?: string;
  monthlyValue: number; // In BRL (R$)
  services: string[];
  responsibleEmployeeId: string;
  status: ClientStatus;
  notes: string;
  logo?: string;
  createdAt: string;
  tags: string[];
}

export type TaskStatus = 
  | 'Backlog'
  | 'A Fazer'
  | 'Em Andamento'
  | 'Em Revisão'
  | 'Aguardando Cliente'
  | 'Concluído';

export type TaskPriority = 'Baixa' | 'Normal' | 'Alta' | 'Urgente';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  clientId?: string;
  assignedUserIds: string[];
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  labels: string[];
  checklist: ChecklistItem[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
  visibleToClient: boolean;
}

export type ProjectStatus = 
  | 'Planejamento'
  | 'Em Andamento'
  | 'Aguardando Cliente'
  | 'Em Revisão'
  | 'Concluído'
  | 'Pausado';

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: ProjectStatus;
  budget: number;
  startDate: string;
  deadline: string;
  teamIds: string[];
  category: string;
  createdAt: string;
}

export type LeadStage = 
  | 'Novo Lead'
  | 'Primeiro Contato'
  | 'Em Conversa'
  | 'Reunião'
  | 'Proposta Enviada'
  | 'Negociação'
  | 'Fechado'
  | 'Perdido';

export interface LeadInteraction {
  id: string;
  date: string;
  type: 'call' | 'email' | 'meeting' | 'whatsapp' | 'note';
  summary: string;
  author: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  source: string; // ex: Instagram Ads, Indicação, Google, Outbound
  estimatedValue: number;
  stage: LeadStage;
  responsibleId: string;
  nextFollowUp?: string;
  notes: string;
  interactions: LeadInteraction[];
  createdAt: string;
}

export type FileCategory = 
  | 'Imagens'
  | 'Vídeos'
  | 'Documentos'
  | 'Textos'
  | 'Logos'
  | 'Materiais de Campanha'
  | 'Outros';

export type FolderType = 
  | 'Branding'
  | 'Fotos'
  | 'Vídeos'
  | 'Documentos'
  | 'Campanhas'
  | 'Social Media'
  | 'Contratos'
  | 'Outros';

export interface ClientFile {
  id: string;
  clientId: string;
  name: string;
  category: FileCategory;
  folder: FolderType;
  extension: string;
  size: string;
  url: string;
  uploadedBy: string;
  uploadedByRole: 'internal' | 'client';
  uploadedAt: string;
  version: number;
  description?: string;
}

export type FileItem = ClientFile;

export interface ApprovalRequest {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'Pendente' | 'Aprovado' | 'Ajustes Solicitados';
  date: string;
}

export type EventType = 
  | 'task_deadline'
  | 'client_meeting'
  | 'project_deadline'
  | 'follow_up'
  | 'internal_meeting';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time?: string;
  clientId?: string;
  projectId?: string;
  description?: string;
  attendees?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'new_task' | 'task_assigned' | 'task_deadline' | 'task_completed' | 'new_file' | 'client_uploaded_file' | 'new_message' | 'client_access_request' | 'client_approved' | 'project_update';
  createdAt: string;
  read: boolean;
  linkSection?: string;
}

export interface ClientAccessRequest {
  id: string;
  clientName: string;
  companyName: string;
  email: string;
  clientId: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface ClientMessage {
  id: string;
  clientId: string;
  senderId: string;
  senderName: string;
  senderRole: 'internal' | 'client';
  text: string;
  timestamp: string;
  attachmentName?: string;
}

export interface ClientFinancialRecord {
  clientId: string;
  monthlyFee: number; // Faturamento fixo mensal (MRR)
  extraRevenue: number; // Receitas extras (projetos pontuais / upsells)
  taxRatePercent: number; // Alíquota de imposto incidente (%)
  mediaInvestmentBudget: number; // Verba de mídia / tráfego gerenciado (Meta Ads / Google Ads)
  teamCostAllocated: number; // Custo alocado da equipe interna (horas/salários)
  directExpenses: number; // Ferramentas dedicadas e gastos operacionais diretos
  notes?: string;
  updatedAt?: string;
}

export interface FixedExpenseItem {
  id: string;
  name: string;
  category: 'Folha & Pró-labore' | 'Infraestrutura' | 'Softwares & Ferramentas' | 'Marketing' | 'Impostos Fixos / Taxas' | 'Outros';
  amount: number;
  recurrence: 'Mensal' | 'Anual';
}

export interface CompanyFinancialConfig {
  companyTaxRegime: 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real';
  defaultTaxRatePercent: number; // Ex: 6% (Simples Nacional Serviços)
  fixedExpenses: FixedExpenseItem[];
}

export type AppBgTheme = 'light' | 'charcoal' | 'dark' | 'slate' | 'warm' | 'zinc';

export interface WhatsAppMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  type?: 'text' | 'image' | 'audio' | 'file';
  mediaUrl?: string;
  audioDuration?: string;
  fileName?: string;
  fileSize?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface WhatsAppChannel {
  id: string;
  name: string;
  type: 'group' | 'dm';
  description?: string;
  avatar?: string;
  members: string[]; // User IDs
  onlyAdmins?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}


