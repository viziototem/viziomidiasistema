import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client, ClientStatus } from '../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Globe,
  Instagram,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  DollarSign,
  Briefcase,
  ChevronRight,
  MoreVertical,
  X,
  ExternalLink,
  Edit2,
  Trash2,
  Calculator,
} from 'lucide-react';

const STATUS_OPTIONS: ClientStatus[] = [
  'Ativo',
  'Lead',
  'Em Conversa',
  'Proposta Enviada',
  'Negociação',
  'Pausado',
  'Cancelado',
  'Ex-Cliente',
];

export const ClientsView: React.FC = () => {
  const {
    clients,
    updateClient,
    deleteClient,
    projects,
    tasks,
    files,
    availableUsers,
    setNewItemModalOpen,
    setNewItemDefaultType,
    currentUser,
    setActiveSection,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Edit state in modal
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Filter clients
  const filteredClients = clients.filter((client) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCompany = client.companyName.toLowerCase().includes(q);
      const matchContact = client.contactName.toLowerCase().includes(q);
      const matchCnpj = client.cnpj.toLowerCase().includes(q);
      const matchService = client.services.some((s) => s.toLowerCase().includes(q));
      if (!matchCompany && !matchContact && !matchCnpj && !matchService) return false;
    }

    if (selectedStatus !== 'all' && client.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const getStatusBadge = (status: ClientStatus) => {
    const styles: Record<ClientStatus, string> = {
      Ativo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Lead: 'bg-blue-50 text-blue-700 border-blue-200',
      'Em Conversa': 'bg-sky-50 text-sky-700 border-sky-200',
      'Proposta Enviada': 'bg-purple-50 text-purple-700 border-purple-200',
      Negociação: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Pausado: 'bg-amber-50 text-amber-700 border-amber-200',
      Cancelado: 'bg-rose-50 text-rose-700 border-rose-200',
      'Ex-Cliente': 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.Ativo}`}
      >
        {status}
      </span>
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    updateClient(editingClient.id, editingClient);
    setEditingClient(null);
  };

  return (
    <div id="clients-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
            Diretório de Clientes & Contratos
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Gestão unificada de dados cadastrais, faturamento mensal, serviços e contatos
          </p>
        </div>

        <button
          onClick={() => {
            setNewItemDefaultType('client');
            setNewItemModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6A00] hover:bg-[#E65F00] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#FF6A00]/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Cliente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Pesquisar por razão social, contato, CNPJ ou serviço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 rounded-xl text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#FF6A00]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:outline-hidden"
          >
            <option value="all">Todos os Status ({clients.length})</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status} ({clients.filter((c) => c.status === status).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const clientProjects = projects.filter((p) => p.clientId === client.id);
          const clientTasks = tasks.filter((t) => t.clientId === client.id);
          const clientFiles = files.filter((f) => f.clientId === client.id);
          const responsible = availableUsers.find((u) => u.id === client.responsibleEmployeeId);

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:border-[#FF6A00]/50 transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                      {client.companyName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-[#FF6A00] transition-colors">
                        {client.companyName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{client.contactName}</p>
                    </div>
                  </div>
                  {getStatusBadge(client.status)}
                </div>

                {/* Financial highlight */}
                <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Contrato Mensal</span>
                  <span className="text-sm font-black text-gray-900 font-['Space_Grotesk',sans-serif]">
                    R$ {client.monthlyValue.toLocaleString('pt-BR')}
                    <span className="text-[10px] text-gray-400 font-normal">/mês</span>
                  </span>
                </div>

                {/* Services Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {client.services.slice(0, 3).map((serv) => (
                    <span
                      key={serv}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-100"
                    >
                      {serv}
                    </span>
                  ))}
                  {client.services.length > 3 && (
                    <span className="text-[10px] text-gray-400 py-0.5">
                      +{client.services.length - 3} mais
                    </span>
                  )}
                </div>

                {/* Contact information shortcuts */}
                <div className="mt-4 space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                  {client.whatsapp && (
                    <a
                      href={`https://wa.me/55${client.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
                    >
                      <span>Conversar no WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-gray-500 font-semibold">
                  <span>{clientProjects.length} projetos</span>
                  <span>•</span>
                  <span>{clientTasks.length} tarefas</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    title="Editar Cliente"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedClientId(client.id)}
                    className="px-3 py-1 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Ficha
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLIENT DETAILED DOSSIER MODAL */}
      {selectedClient && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedClientId(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-900 text-white font-extrabold flex items-center justify-center text-lg">
                  {selectedClient.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {selectedClient.companyName}
                  </h3>
                  <p className="text-xs text-gray-500">CNPJ: {selectedClient.cnpj}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClientId(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{selectedClient.status}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">MRR Mensal</span>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    R$ {selectedClient.monthlyValue.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Início Contrato</span>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{selectedClient.contractStart}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Atendimento</span>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">
                    {availableUsers.find((u) => u.id === selectedClient.responsibleEmployeeId)?.name || 'Vizio Team'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Endereço & Localização
                </h4>
                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl">
                  {selectedClient.address}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Serviços Ativos no Escopo
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedClient.services.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-[#FF6A00] border border-orange-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Anotações Internas & Diretrizes
                </h4>
                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl leading-relaxed whitespace-pre-wrap">
                  {selectedClient.notes || 'Sem observações registradas.'}
                </p>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  if (confirm(`Deseja realmente remover o cliente ${selectedClient.companyName}?`)) {
                    deleteClient(selectedClient.id);
                    setSelectedClientId(null);
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Excluir Cliente
              </button>

              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setSelectedClientId(null);
                      setActiveSection('Cálculo Financeiro');
                    }}
                    className="px-3 py-1.5 bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Ver Lucro & DRE</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedClientId(null)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CLIENT MODAL */}
      {editingClient && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingClient(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Editar Dados: {editingClient.companyName}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Razão Social / Nome Fantasia
                </label>
                <input
                  type="text"
                  value={editingClient.companyName}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, companyName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Contato
                  </label>
                  <input
                    type="text"
                    value={editingClient.contactName}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, contactName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Valor Mensal (R$)
                  </label>
                  <input
                    type="number"
                    value={editingClient.monthlyValue}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, monthlyValue: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Status
                </label>
                <select
                  value={editingClient.status}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, status: e.target.value as ClientStatus })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6A00] text-white hover:bg-[#E65F00]"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
