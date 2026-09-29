import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckSquare,
  Users,
  FolderKanban,
  Target,
  FileUp,
  UploadCloud,
} from 'lucide-react';
import { TaskPriority, TaskStatus, ClientStatus, LeadStage, ProjectStatus, FileCategory, FolderType } from '../types';

export const NewItemModal: React.FC = () => {
  const {
    newItemModalOpen,
    setNewItemModalOpen,
    newItemDefaultType,
    clients,
    projects,
    availableUsers,
    addTask,
    addClient,
    addProject,
    addLead,
    addFile,
    currentUser,
    isClientUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'task' | 'client' | 'project' | 'lead' | 'file'>(
    newItemDefaultType
  );

  // Sync default type when opened
  React.useEffect(() => {
    setActiveTab(newItemDefaultType);
  }, [newItemDefaultType, newItemModalOpen]);

  // Form states - Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Normal');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('A Fazer');
  const [taskClientId, setTaskClientId] = useState(clients[0]?.id || '');
  const [taskProjectId, setTaskProjectId] = useState(projects[0]?.id || '');
  const [taskDeadline, setTaskDeadline] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [taskVisibleToClient, setTaskVisibleToClient] = useState(true);

  // Form states - Client
  const [clientCompanyName, setClientCompanyName] = useState('');
  const [clientContactName, setClientContactName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCnpj, setClientCnpj] = useState('');
  const [clientMonthly, setClientMonthly] = useState(8500);
  const [clientStatus, setClientStatus] = useState<ClientStatus>('Ativo');
  const [clientServices, setClientServices] = useState('Tráfego Pago, Social Media');

  // Form states - Project
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectClientId, setProjectClientId] = useState(clients[0]?.id || '');
  const [projectBudget, setProjectBudget] = useState(25000);
  const [projectDeadline, setProjectDeadline] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [projectCategory, setProjectCategory] = useState('Campanhas & Performance');

  // Form states - Lead
  const [leadCompanyName, setLeadCompanyName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSource, setLeadSource] = useState('Instagram Ads');
  const [leadValue, setLeadValue] = useState(12000);
  const [leadStage, setLeadStage] = useState<LeadStage>('Novo Lead');

  // Form states - File
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState<FileCategory>('Imagens');
  const [fileFolder, setFileFolder] = useState<FolderType>('Fotos');
  const [fileClientId, setFileClientId] = useState(
    isClientUser && currentUser.clientId ? currentUser.clientId : clients[0]?.id || ''
  );

  if (!newItemModalOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      clientId: isClientUser ? currentUser.clientId : taskClientId,
      projectId: taskProjectId || undefined,
      assignedUserIds: [availableUsers[1]?.id || 'u2'],
      status: taskStatus,
      priority: taskPriority,
      deadline: taskDeadline,
      labels: ['Geral', taskPriority],
      checklist: [
        { id: 'ck_' + Date.now(), text: 'Etapa inicial de execução', completed: false },
      ],
      comments: [],
      attachments: [],
      visibleToClient: taskVisibleToClient,
    });
    setNewItemModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompanyName.trim()) return;

    addClient({
      companyName: clientCompanyName.trim(),
      contactName: clientContactName.trim() || 'Responsável',
      email: clientEmail.trim() || 'contato@cliente.com.br',
      phone: clientPhone.trim() || '(11) 90000-0000',
      cnpj: clientCnpj.trim() || '00.000.000/0001-00',
      address: 'São Paulo - SP',
      contractStart: new Date().toISOString().split('T')[0],
      monthlyValue: Number(clientMonthly) || 0,
      services: clientServices.split(',').map((s) => s.trim()),
      responsibleEmployeeId: availableUsers[1]?.id || 'u2',
      status: clientStatus,
      notes: 'Cliente cadastrado via formulário ágil.',
      tags: ['Novo', clientStatus],
    });
    setNewItemModalOpen(false);
    setClientCompanyName('');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    addProject({
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      clientId: projectClientId,
      status: 'Em Andamento',
      budget: Number(projectBudget) || 0,
      startDate: new Date().toISOString().split('T')[0],
      deadline: projectDeadline,
      teamIds: ['u1', 'u2', 'u3'],
      category: projectCategory,
    });
    setNewItemModalOpen(false);
    setProjectTitle('');
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadCompanyName.trim()) return;

    addLead({
      companyName: leadCompanyName.trim(),
      contactName: leadContact.trim() || 'Contato Principal',
      phone: leadPhone.trim() || '(11) 98888-7777',
      email: leadEmail.trim() || 'contato@lead.com.br',
      source: leadSource,
      estimatedValue: Number(leadValue) || 0,
      stage: leadStage,
      responsibleId: 'u1',
      notes: 'Oportunidade adicionada via entrada rápida no sistema.',
      interactions: [],
    });
    setNewItemModalOpen(false);
    setLeadCompanyName('');
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    const extension = fileName.includes('.') ? fileName.split('.').pop() || 'dat' : 'png';
    addFile({
      name: fileName.trim(),
      clientId: isClientUser && currentUser.clientId ? currentUser.clientId : fileClientId,
      category: fileCategory,
      folder: fileFolder,
      extension: extension.toLowerCase(),
      size: `${(Math.random() * 8 + 1.2).toFixed(1)} MB`,
      url: '#',
      uploadedBy: currentUser.name,
      uploadedByRole: currentUser.role === 'client' ? 'client' : 'internal',
      version: 1,
      description: 'Arquivo adicionado via upload local.',
    });
    setNewItemModalOpen(false);
    setFileName('');
  };

  return (
    <div
      id="new-item-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={() => setNewItemModalOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00] flex items-center justify-center font-bold">
              +
            </div>
            <h2 className="text-lg font-bold text-gray-900">Novo Registro</h2>
          </div>
          <button
            onClick={() => setNewItemModalOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        {!isClientUser && (
          <div className="flex border-b border-gray-200 px-6 gap-2 bg-gray-50/70 overflow-x-auto">
            <button
              onClick={() => setActiveTab('task')}
              className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'task'
                  ? 'border-[#FF6A00] text-[#FF6A00]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Tarefa
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'client'
                  ? 'border-[#FF6A00] text-[#FF6A00]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Cliente
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'project'
                  ? 'border-[#FF6A00] text-[#FF6A00]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              Projeto
            </button>
            <button
              onClick={() => setActiveTab('lead')}
              className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'lead'
                  ? 'border-[#FF6A00] text-[#FF6A00]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Target className="w-4 h-4" />
              Lead CRM
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'file'
                  ? 'border-[#FF6A00] text-[#FF6A00]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FileUp className="w-4 h-4" />
              Arquivo
            </button>
          </div>
        )}

        {/* Tab content forms */}
        <div className="p-6 overflow-y-auto">
          {/* TASK FORM */}
          {activeTab === 'task' && (
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Criação dos criativos em carrossel para Instagram"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Descrição detalhada
                </label>
                <textarea
                  rows={3}
                  placeholder="Orientações e especificações da entrega..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Cliente Associado
                  </label>
                  <select
                    value={taskClientId}
                    onChange={(e) => setTaskClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Projeto
                  </label>
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    <option value="">Sem projeto vinculado</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Prioridade
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Coluna Inicial
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="A Fazer">A Fazer</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Em Revisão">Em Revisão</option>
                    <option value="Aguardando Cliente">Aguardando Cliente</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Prazo de Entrega
                  </label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="task-visible"
                  checked={taskVisibleToClient}
                  onChange={(e) => setTaskVisibleToClient(e.target.checked)}
                  className="rounded text-[#FF6A00] focus:ring-[#FF6A00]"
                />
                <label htmlFor="task-visible" className="text-xs text-gray-700 font-medium">
                  Visível para o cliente no Portal Exclusivo
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#FF6A00] hover:bg-[#E65F00] text-white shadow-md shadow-[#FF6A00]/25"
                >
                  Adicionar Tarefa
                </button>
              </div>
            </form>
          )}

          {/* CLIENT FORM */}
          {activeTab === 'client' && (
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Nova Franquia Gourmet"
                    value={clientCompanyName}
                    onChange={(e) => setClientCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Nome do Contato Principal
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Gabriela Medeiros"
                    value={clientContactName}
                    onChange={(e) => setClientContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="contato@empresa.com.br"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 98765-4321"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={clientCnpj}
                    onChange={(e) => setClientCnpj(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Valor Mensal (R$)
                  </label>
                  <input
                    type="number"
                    value={clientMonthly}
                    onChange={(e) => setClientMonthly(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={clientStatus}
                    onChange={(e) => setClientStatus(e.target.value as ClientStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Lead">Lead</option>
                    <option value="Em Conversa">Em Conversa</option>
                    <option value="Negociação">Negociação</option>
                    <option value="Pausado">Pausado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Serviços Contratados (separar por vírgula)
                </label>
                <input
                  type="text"
                  value={clientServices}
                  onChange={(e) => setClientServices(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#FF6A00] hover:bg-[#E65F00] text-white shadow-md shadow-[#FF6A00]/25"
                >
                  Cadastrar Cliente
                </button>
              </div>
            </form>
          )}

          {/* PROJECT FORM */}
          {activeTab === 'project' && (
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Título do Projeto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Campanha Institucional de Verão 2027"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Cliente
                  </label>
                  <select
                    value={projectClientId}
                    onChange={(e) => setProjectClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Orçamento Estimado (R$)
                  </label>
                  <input
                    type="number"
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Prazo Final
                  </label>
                  <input
                    type="date"
                    value={projectDeadline}
                    onChange={(e) => setProjectDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Resumo dos Entregáveis
                </label>
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Escopo resumido do projeto..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00] resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#FF6A00] hover:bg-[#E65F00] text-white shadow-md shadow-[#FF6A00]/25"
                >
                  Criar Projeto
                </button>
              </div>
            </form>
          )}

          {/* CRM LEAD FORM */}
          {activeTab === 'lead' && (
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Empresa Oportunidade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Concessionária AutoLux"
                    value={leadCompanyName}
                    onChange={(e) => setLeadCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Contato do Lead
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Felipe Siqueira"
                    value={leadContact}
                    onChange={(e) => setLeadContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 98888-0000"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="contato@autolux.com.br"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Origem
                  </label>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    <option value="Instagram Ads">Instagram Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Outbound">Outbound</option>
                    <option value="Evento">Evento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Valor Estimado (R$)
                  </label>
                  <input
                    type="number"
                    value={leadValue}
                    onChange={(e) => setLeadValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Etapa Pipeline
                  </label>
                  <select
                    value={leadStage}
                    onChange={(e) => setLeadStage(e.target.value as LeadStage)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    <option value="Novo Lead">Novo Lead</option>
                    <option value="Primeiro Contato">Primeiro Contato</option>
                    <option value="Em Conversa">Em Conversa</option>
                    <option value="Reunião">Reunião</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#FF6A00] hover:bg-[#E65F00] text-white shadow-md shadow-[#FF6A00]/25"
                >
                  Salvar Oportunidade
                </button>
              </div>
            </form>
          )}

          {/* FILE UPLOAD SIMULATOR */}
          {activeTab === 'file' && (
            <form onSubmit={handleCreateFile} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#FF6A00] transition-colors cursor-pointer bg-gray-50/50">
                <UploadCloud className="w-10 h-10 text-[#FF6A00] mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-800">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceitos: JPG, PNG, WEBP, MP4, PDF, DOCX, XLSX, ZIP (até 500MB)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nome do Arquivo com extensão *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fotos_Nova_Fachada_Setembro.zip"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Categoria
                  </label>
                  <select
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value as FileCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    <option value="Imagens">Imagens</option>
                    <option value="Vídeos">Vídeos</option>
                    <option value="Documentos">Documentos</option>
                    <option value="Logos">Logos</option>
                    <option value="Materiais de Campanha">Materiais de Campanha</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pasta Destino
                  </label>
                  <select
                    value={fileFolder}
                    onChange={(e) => setFileFolder(e.target.value as FolderType)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                  >
                    <option value="Branding">Branding</option>
                    <option value="Fotos">Fotos</option>
                    <option value="Vídeos">Vídeos</option>
                    <option value="Documentos">Documentos</option>
                    <option value="Campanhas">Campanhas</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Contratos">Contratos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                {!isClientUser && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Cliente
                    </label>
                    <select
                      value={fileClientId}
                      onChange={(e) => setFileClientId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#FF6A00] hover:bg-[#E65F00] text-white shadow-md shadow-[#FF6A00]/25"
                >
                  Confirmar Envio
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
