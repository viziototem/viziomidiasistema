import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, LeadStage, LeadInteraction } from '../types';
import {
  Target,
  Plus,
  Search,
  Filter,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Building,
  MoreVertical,
  X,
  ExternalLink,
} from 'lucide-react';

const CRM_STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: 'Novo Lead', label: 'Novo Lead', color: 'border-blue-400 bg-blue-50/50' },
  { id: 'Primeiro Contato', label: 'Primeiro Contato', color: 'border-sky-400 bg-sky-50/50' },
  { id: 'Em Conversa', label: 'Em Conversa', color: 'border-amber-400 bg-amber-50/50' },
  { id: 'Reunião', label: 'Reunião Agendada', color: 'border-purple-400 bg-purple-50/50' },
  { id: 'Proposta Enviada', label: 'Proposta Enviada', color: 'border-indigo-400 bg-indigo-50/50' },
  { id: 'Negociação', label: 'Negociação', color: 'border-[#FF6A00] bg-orange-50/50' },
  { id: 'Fechado', label: 'Fechado Ganho', color: 'border-emerald-500 bg-emerald-50/50' },
];

export const CrmView: React.FC = () => {
  const {
    leads,
    updateLead,
    deleteLead,
    addClient,
    currentUser,
    addToast,
    setNewItemModalOpen,
    setNewItemDefaultType,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newInteractionNote, setNewInteractionNote] = useState('');

  const filteredLeads = leads.filter((lead) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComp = lead.companyName.toLowerCase().includes(q);
      const matchContact = lead.contactName.toLowerCase().includes(q);
      const matchSource = lead.source.toLowerCase().includes(q);
      if (!matchComp && !matchContact && !matchSource) return false;
    }
    return true;
  });

  const selectedLead = leads.find((l) => l.id === selectedLeadId);

  // Compute total pipeline value
  const totalPipelineValue = leads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newInteractionNote.trim()) return;

    const newInter: LeadInteraction = {
      id: 'it_' + Date.now(),
      type: 'note',
      summary: newInteractionNote.trim(),
      author: currentUser.name,
      date: new Date().toLocaleDateString('pt-BR'),
    };

    updateLead(selectedLead.id, {
      interactions: [newInter, ...selectedLead.interactions],
    });
    setNewInteractionNote('');
  };

  const handleConvertToClient = (lead: typeof leads[0]) => {
    addClient({
      companyName: lead.companyName,
      contactName: lead.contactName,
      email: lead.email,
      phone: lead.phone,
      cnpj: '00.000.000/0001-00',
      address: 'A cadastrar',
      contractStart: new Date().toISOString().split('T')[0],
      monthlyValue: lead.estimatedValue || 5000,
      services: ['Gestão de Tráfego', 'Social Media'],
      responsibleEmployeeId: currentUser.id,
      status: 'Ativo',
      notes: `Convertido do CRM em ${new Date().toLocaleDateString('pt-BR')}. ${lead.notes}`,
      tags: ['Convertido', lead.source],
    });
    deleteLead(lead.id);
    addToast(`Lead ${lead.companyName} convertido em Cliente Ativo!`, 'success');
    setSelectedLeadId(null);
  };

  return (
    <div id="crm-view" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
              Funil de Vendas & CRM
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-100 text-[#FF6A00]">
              R$ {totalPipelineValue.toLocaleString('pt-BR')} no Funil
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Gestão visual do pipeline comercial, origens de tráfego e conversão em contrato
          </p>
        </div>

        <button
          onClick={() => {
            setNewItemDefaultType('lead');
            setNewItemModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6A00] hover:bg-[#E65F00] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#FF6A00]/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Oportunidade</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white p-3.5 rounded-2xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar oportunidade por empresa, contato ou canal de aquisição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 rounded-xl text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#FF6A00]"
          />
        </div>
      </div>

      {/* CRM Funnel Horizontal Columns */}
      <div className="overflow-x-auto pb-4 kanban-scroll">
        <div className="flex gap-4 min-w-[1500px]">
          {CRM_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
            const stageTotal = stageLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

            return (
              <div
                key={stage.id}
                className="w-72 rounded-2xl bg-gray-100/70 border border-gray-200 flex flex-col max-h-[calc(100vh-250px)]"
              >
                {/* Stage Header */}
                <div className="p-3.5 border-b border-gray-200/80 bg-white rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                      {stage.label}
                    </h3>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {stageLeads.length}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-[#FF6A00] mt-1 font-['Space_Grotesk',sans-serif]">
                    R$ {stageTotal.toLocaleString('pt-BR')}
                  </p>
                </div>

                {/* Leads Cards */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-xs italic">
                      Nenhum lead nesta etapa
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-[#FF6A00] hover:shadow-md transition-all cursor-pointer text-left group"
                      >
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                          <span className="font-semibold px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-700">
                            {lead.source}
                          </span>
                          <span>{lead.createdAt}</span>
                        </div>

                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#FF6A00] transition-colors">
                          {lead.companyName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{lead.contactName}</p>

                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-black text-gray-900 font-['Space_Grotesk',sans-serif]">
                            R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConvertToClient(lead);
                            }}
                            className="px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                            title="Converter diretamente em Cliente Ativo"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Contratar</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEAD DETAILS & INTERACTION HISTORY MODAL */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedLeadId(null)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <span className="text-[10px] font-bold text-[#FF6A00] uppercase tracking-wider">
                  Lead Comercial • {selectedLead.source}
                </span>
                <h3 className="text-base font-extrabold text-gray-900">
                  {selectedLead.companyName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLeadId(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Quick stage mover */}
              <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-gray-700">Mover Estágio:</span>
                <select
                  value={selectedLead.stage}
                  onChange={(e) =>
                    updateLead(selectedLead.id, { stage: e.target.value as LeadStage })
                  }
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900"
                >
                  {CRM_STAGES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                  <option value="Perdido">Perdido</option>
                </select>
              </div>

              {/* Contact summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 font-medium block">Contato</span>
                  <span className="font-bold text-gray-900">{selectedLead.contactName}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 font-medium block">Ticket Estimado</span>
                  <span className="font-black text-gray-900 font-['Space_Grotesk',sans-serif]">
                    R$ {selectedLead.estimatedValue.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 font-medium block">WhatsApp / Fone</span>
                  <span className="font-bold text-gray-900">{selectedLead.phone}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 font-medium block">E-mail</span>
                  <span className="font-bold text-gray-900 truncate block">
                    {selectedLead.email}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Notas sobre a Proposta
                </h4>
                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl leading-relaxed">
                  {selectedLead.notes}
                </p>
              </div>

              {/* Interaction History */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Histórico de Contatos & Reuniões
                </h4>
                <div className="space-y-2 mb-3">
                  {selectedLead.interactions.map((it) => (
                    <div
                      key={it.id}
                      className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 text-xs flex justify-between"
                    >
                      <p className="text-gray-800">{it.summary}</p>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2">{it.date}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddInteraction} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Registrar ligação, reunião ou mensagem enviada..."
                    value={newInteractionNote}
                    onChange={(e) => setNewInteractionNote(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:ring-1 focus:ring-[#FF6A00]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold"
                  >
                    Registrar
                  </button>
                </form>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => handleConvertToClient(selectedLead)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Converter em Cliente Agora</span>
              </button>

              <button
                onClick={() => setSelectedLeadId(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
