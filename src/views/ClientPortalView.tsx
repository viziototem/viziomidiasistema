import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VizioLogo } from '../components/VizioLogo';
import {
  Building2,
  CheckCircle2,
  Clock,
  FileBox,
  Plus,
  Send,
  Download,
  DollarSign,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Check,
  X,
  CreditCard,
  QrCode,
  Copy,
} from 'lucide-react';

import { ApprovalRequest } from '../types';

export const ClientPortalView: React.FC = () => {
  const {
    currentUser,
    clients,
    tasks,
    files,
    addTask,
    addFile,
    addToast,
    availableUsers,
  } = useApp();

  const [activePortalTab, setActivePortalTab] = useState<
    'overview' | 'tasks' | 'approvals' | 'files' | 'briefing' | 'financial'
  >('overview');

  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([
    {
      id: 'appr_1',
      clientId: 'c1',
      title: 'Carrossel Institucional - Semana da Saúde',
      description: 'Conjunto de 5 artes para feed do Instagram com copy validada internamente.',
      status: 'Pendente',
      date: '18/10/2026',
    },
    {
      id: 'appr_2',
      clientId: 'c1',
      title: 'Vídeo Reels Promocional - Ofertas Outubro',
      description: 'Edição de vídeo em formato 9:16 com trilha sonora licenciada e legendas dinâmicas.',
      status: 'Pendente',
      date: '19/10/2026',
    },
    {
      id: 'appr_3',
      clientId: 'c2',
      title: 'Folder Digital PDF - Lançamento Residencial',
      description: 'Layout em alta resolução pronto para impressão gráfica e envio por WhatsApp.',
      status: 'Aprovado',
      date: '15/10/2026',
    },
  ]);

  const respondApproval = (id: string, status: 'Aprovado' | 'Ajustes Solicitados') => {
    setApprovalRequests((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    addToast(
      status === 'Aprovado'
        ? 'Entrega aprovada com sucesso! A equipe da Vizio Midia foi notificada.'
        : 'Ajustes solicitados registrados com sucesso! Nossa equipe entrará em contato.',
      status === 'Aprovado' ? 'success' : 'info'
    );
  };

  // New Request Form
  const [briefingTitle, setBriefingTitle] = useState('');
  const [briefingCategory, setBriefingCategory] = useState('Campanha / Anúncio');
  const [briefingDeadline, setBriefingDeadline] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [briefingDesc, setBriefingDesc] = useState('');

  // Client info
  const clientData = clients.find((c) => c.id === currentUser.clientId) || clients[0];
  const myTasks = tasks.filter((t) => t.clientId === clientData.id && t.visibleToClient);
  const myFiles = files.filter((f) => f.clientId === clientData.id);
  const myApprovals = approvalRequests.filter((a) => a.clientId === clientData.id);
  const accountManager = availableUsers.find((u) => u.id === clientData.responsibleEmployeeId);

  const handleSubmitBriefing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefingTitle.trim()) return;

    addTask({
      title: `[Pedido Cliente] ${briefingTitle.trim()}`,
      description: `Categoria: ${briefingCategory}\n\nInstruções:\n${briefingDesc.trim()}`,
      clientId: clientData.id,
      assignedUserIds: [clientData.responsibleEmployeeId],
      status: 'A Fazer',
      priority: 'Normal',
      deadline: briefingDeadline,
      labels: ['Demanda do Cliente', briefingCategory],
      checklist: [{ id: 'ck_' + Date.now(), text: 'Validação pelo Atendimento', completed: false }],
      comments: [],
      attachments: [],
      visibleToClient: true,
    });

    addToast('Sua solicitação foi enviada para a equipe da Vizio Midia!', 'success');
    setBriefingTitle('');
    setBriefingDesc('');
    setActivePortalTab('tasks');
  };

  return (
    <div id="client-portal-view" className="space-y-6 pb-12">
      {/* Brand Header Banner for Client */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF6A00]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <VizioLogo variant="white" size="xs" />
            <span className="text-gray-500">•</span>
            <span className="px-3 py-1 rounded-full bg-[#FF6A00] text-white text-xs font-bold uppercase tracking-wider">
              Área Exclusiva do Cliente
            </span>
            <span className="text-xs text-gray-400">Ambiente Seguro & Isolado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk',sans-serif]">
            {clientData.companyName}
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl">
            Acompanhe o andamento das suas campanhas, aprove entregáveis, envie briefings e acesse
            todos os seus arquivos e contratos em um só lugar.
          </p>
        </div>

        {/* Manager card shortcut */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs flex items-center gap-3 self-start md:self-auto">
          <img
            src={accountManager?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt="Manager"
            className="w-10 h-10 rounded-full object-cover border border-[#FF6A00]"
          />
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Seu Gestor de Conta</span>
            <p className="text-xs font-bold text-white">{accountManager?.name || 'Mariana Costa'}</p>
            <a
              href="https://wa.me/5511999990000"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#FF6A00] font-semibold hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>Chamar no WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Portal Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto bg-white p-1.5 rounded-2xl shadow-xs">
        <button
          onClick={() => setActivePortalTab('overview')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activePortalTab === 'overview'
              ? 'bg-[#FF6A00] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActivePortalTab('tasks')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activePortalTab === 'tasks'
              ? 'bg-[#FF6A00] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span>Demandas & Entregas</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-white font-bold">
            {myTasks.length}
          </span>
        </button>
        <button
          onClick={() => setActivePortalTab('approvals')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activePortalTab === 'approvals'
              ? 'bg-[#FF6A00] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span>Aprovações</span>
          {myApprovals.filter((a) => a.status === 'Pendente').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
              {myApprovals.filter((a) => a.status === 'Pendente').length} pendente
            </span>
          )}
        </button>
        <button
          onClick={() => setActivePortalTab('files')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activePortalTab === 'files'
              ? 'bg-[#FF6A00] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Meus Arquivos ({myFiles.length})
        </button>
        <button
          onClick={() => setActivePortalTab('briefing')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-[#FF6A00] flex items-center gap-1 ${
            activePortalTab === 'briefing'
              ? 'bg-[#FF6A00] text-white shadow-xs'
              : 'hover:bg-orange-50'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Fazer Pedido / Briefing</span>
        </button>
        <button
          onClick={() => setActivePortalTab('financial')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activePortalTab === 'financial'
              ? 'bg-[#FF6A00] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Faturas & Contrato
        </button>
      </div>

      {/* 1. VISÃO GERAL TAB */}
      {activePortalTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase">Demandas em Execução</span>
              <p className="text-3xl font-black text-gray-900 mt-2 font-['Space_Grotesk',sans-serif]">
                {myTasks.filter((t) => t.status !== 'Concluído').length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Sendo trabalhadas pela equipe</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase">Aguardando Sua Aprovação</span>
              <p className="text-3xl font-black text-[#FF6A00] mt-2 font-['Space_Grotesk',sans-serif]">
                {myApprovals.filter((a) => a.status === 'Pendente').length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Peças e roteiros prontos</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase">Arquivos Compartilhados</span>
              <p className="text-3xl font-black text-emerald-600 mt-2 font-['Space_Grotesk',sans-serif]">
                {myFiles.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Disponíveis para download</p>
            </div>
          </div>

          {/* Contract services info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="font-bold text-base text-gray-900 mb-3">
              Escopo de Serviços Contratados
            </h3>
            <div className="flex flex-wrap gap-2">
              {clientData.services.map((serv) => (
                <span
                  key={serv}
                  className="px-3 py-1.5 rounded-xl bg-orange-50 text-[#FF6A00] font-bold text-xs border border-orange-100"
                >
                  ✓ {serv}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
              <span>Data de início do contrato: {clientData.contractStart}</span>
              <span>Atendimento prioritário de Segunda a Sexta, 09h às 18h</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEMANDAS & TAREFAS TAB */}
      {activePortalTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900">Suas Demandas Ativas</h3>
            <span className="text-xs text-gray-500">{myTasks.length} tarefas cadastradas</span>
          </div>

          <div className="divide-y divide-gray-100">
            {myTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                Nenhuma tarefa visível no momento.
              </div>
            ) : (
              myTasks.map((task) => (
                <div key={task.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-400">Prazo: {task.deadline}</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">{task.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {task.checklist.filter((c) => c.completed).length}/{task.checklist.length} etapas
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. APROVAÇÕES TAB */}
      {activePortalTab === 'approvals' && (
        <div className="space-y-4">
          {myApprovals.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500 text-xs">
              Nenhuma peça pendente de aprovação.
            </div>
          ) : (
            myApprovals.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        req.status === 'Pendente'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'Aprovado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="text-xs text-gray-400">{req.date}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-gray-900">{req.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{req.description}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => addToast(`Abrindo visualizador para: ${req.title}`, 'info')}
                      className="text-xs font-bold text-[#FF6A00] hover:underline flex items-center gap-1"
                    >
                      <span>Ver Arte / Vídeo para Validação</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {req.status === 'Pendente' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => respondApproval(req.id, 'Ajustes Solicitados')}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4 text-rose-500" />
                      <span>Pedir Ajustes</span>
                    </button>
                    <button
                      onClick={() => respondApproval(req.id, 'Aprovado')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aprovar Entrega</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. MEUS ARQUIVOS TAB */}
      {activePortalTab === 'files' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-[#FF6A00]">{file.folder}</span>
                <h4 className="text-xs font-bold text-gray-900 mt-1 truncate">{file.name}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {file.size} • {file.uploadedAt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">v{file.version}</span>
                <button
                  onClick={() => alert(`Baixando ${file.name}`)}
                  className="px-3 py-1 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Baixar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. BRIEFING FORM TAB */}
      {activePortalTab === 'briefing' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl shadow-xs">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-gray-900">
              Solicitar Novo Pedido ou Briefing
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Preencha o formulário para enviar diretamente para a fila de produção da Vizio Midia
            </p>
          </div>

          <form onSubmit={handleSubmitBriefing} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Título da Demanda *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Campanha de Dia dos Pais - 3 carrosséis e 2 reels"
                value={briefingTitle}
                onChange={(e) => setBriefingTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Tipo de Solicitação
                </label>
                <select
                  value={briefingCategory}
                  onChange={(e) => setBriefingCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                >
                  <option value="Campanha / Anúncio">Campanha / Anúncio</option>
                  <option value="Post de Redes Sociais">Post de Redes Sociais</option>
                  <option value="Edição de Vídeo">Edição de Vídeo</option>
                  <option value="Material Impresso">Material Impresso</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Prazo Desejado
                </label>
                <input
                  type="date"
                  value={briefingDeadline}
                  onChange={(e) => setBriefingDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Instruções & Orientações
              </label>
              <textarea
                rows={4}
                required
                placeholder="Descreva o objetivo da campanha, textos sugeridos, público-alvo ou links de referência..."
                value={briefingDesc}
                onChange={(e) => setBriefingDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6A00] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF6A00] hover:bg-[#E65F00] text-white rounded-xl text-sm font-bold shadow-md shadow-[#FF6A00]/25 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Pedido para Produção</span>
            </button>
          </form>
        </div>
      )}

      {/* 6. FINANCIAL & INVOICES TAB */}
      {activePortalTab === 'financial' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase">Mensalidade Atual</span>
              <p className="text-3xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif] mt-1">
                R$ {clientData.monthlyValue.toLocaleString('pt-BR')}
                <span className="text-sm font-normal text-gray-400"> / mês</span>
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                ✓ Próximo vencimento: 10/10/2026
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('00020126580014br.gov.bcb.pix0136vizio@viziomidia.com.br');
                  addToast('Chave PIX copiada para a área de transferência!', 'success');
                }}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#FF6A00]" />
                <span>Copiar Chave PIX</span>
              </button>

              <button
                onClick={() => addToast('Download do boleto simulado iniciado.', 'info')}
                className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Boleto Atual</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
