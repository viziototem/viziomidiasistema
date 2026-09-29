import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VizioLogo } from './VizioLogo';
import {
  Search,
  CheckSquare,
  Users,
  FolderKanban,
  Target,
  FileBox,
  X,
  ArrowRight,
  Calculator,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    tasks,
    clients,
    projects,
    leads,
    files,
    setActiveSection,
    isClientUser,
    currentUser,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      }
      if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter based on client isolation rules
  const accessibleTasks = isClientUser
    ? tasks.filter((t) => t.clientId === currentUser.clientId && t.visibleToClient)
    : tasks;

  const accessibleProjects = isClientUser
    ? projects.filter((p) => p.clientId === currentUser.clientId)
    : projects;

  const accessibleFiles = isClientUser
    ? files.filter((f) => f.clientId === currentUser.clientId)
    : files;

  const accessibleClients = isClientUser ? [] : clients;
  const accessibleLeads = isClientUser ? [] : leads;

  const matchedTasks = cleanQuery
    ? accessibleTasks.filter((t) => t.title.toLowerCase().includes(cleanQuery))
    : accessibleTasks.slice(0, 3);

  const matchedClients = cleanQuery
    ? accessibleClients.filter(
        (c) =>
          c.companyName.toLowerCase().includes(cleanQuery) ||
          c.contactName.toLowerCase().includes(cleanQuery)
      )
    : accessibleClients.slice(0, 3);

  const matchedProjects = cleanQuery
    ? accessibleProjects.filter((p) => p.title.toLowerCase().includes(cleanQuery))
    : accessibleProjects.slice(0, 3);

  const matchedLeads = cleanQuery
    ? accessibleLeads.filter(
        (l) =>
          l.companyName.toLowerCase().includes(cleanQuery) ||
          l.contactName.toLowerCase().includes(cleanQuery)
      )
    : accessibleLeads.slice(0, 2);

  const matchedFiles = cleanQuery
    ? accessibleFiles.filter((f) => f.name.toLowerCase().includes(cleanQuery))
    : accessibleFiles.slice(0, 3);

  const hasAnyResults =
    matchedTasks.length > 0 ||
    matchedClients.length > 0 ||
    matchedProjects.length > 0 ||
    matchedLeads.length > 0 ||
    matchedFiles.length > 0;

  return (
    <div
      id="global-search-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
      onClick={() => setGlobalSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200">
          <Search className="w-5 h-5 text-[#FF6A00]" />
          <input
            type="text"
            placeholder="Buscar por tarefa, cliente, projeto, arquivo ou lead..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-base focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-gray-400 bg-gray-100 rounded-md border border-gray-200 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Admin Financial Calculation direct match */}
          {currentUser.role === 'admin' &&
            (!cleanQuery ||
              'calculo financeiro impostos gastos lucro dre investimento rentabilidade'
                .toLowerCase()
                .includes(cleanQuery)) && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <Calculator className="w-3.5 h-3.5 text-[#FF6A00]" />
                  Módulo Executivo ADM
                </div>
                <button
                  onClick={() => {
                    setActiveSection('Cálculo Financeiro');
                    setGlobalSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-orange-50/50 hover:bg-orange-50 border border-orange-200/60 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#FF6A00] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 group-hover:text-[#FF6A00]">
                        Cálculo Financeiro da Empresa & DRE
                      </div>
                      <div className="text-xs text-gray-500">
                        Relatório de todos os clientes: impostos, investimentos, gastos e lucro líquido real
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#FF6A00] px-2 py-0.5 rounded bg-white border border-orange-200 shrink-0">
                    Acessar
                  </span>
                </button>
              </div>
            )}

          {!hasAnyResults && (
            <div className="py-10 text-center text-gray-500 text-sm">
              Nenhum resultado encontrado para "{query}".
            </div>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <CheckSquare className="w-3.5 h-3.5 text-[#FF6A00]" />
                Tarefas ({matchedTasks.length})
              </div>
              <div className="space-y-1">
                {matchedTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setActiveSection('Tarefas');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/60 hover:border-orange-200 border border-transparent transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-[#FF6A00] shrink-0" />
                      <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 truncate">
                        {task.title}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 shrink-0">
                        {task.status}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF6A00] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients (Internal only) */}
          {matchedClients.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Clientes ({matchedClients.length})
              </div>
              <div className="space-y-1">
                {matchedClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setActiveSection('Clientes');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/60 hover:border-blue-200 border border-transparent transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 truncate">
                        {client.companyName}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        • {client.contactName}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                      {client.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-500" />
                Projetos ({matchedProjects.length})
              </div>
              <div className="space-y-1">
                {matchedProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setActiveSection('Projetos');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 hover:border-indigo-200 border border-transparent transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 truncate">
                        {project.title}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        • R$ {project.budget.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                      {project.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                CRM Leads ({matchedLeads.length})
              </div>
              <div className="space-y-1">
                {matchedLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setActiveSection('CRM');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/60 hover:border-emerald-200 border border-transparent transition-colors text-left group"
                  >
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {lead.companyName} ({lead.contactName})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold">
                      {lead.stage}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {matchedFiles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                <FileBox className="w-3.5 h-3.5 text-purple-500" />
                Arquivos ({matchedFiles.length})
              </div>
              <div className="space-y-1">
                {matchedFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => {
                      setActiveSection('Arquivos');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 hover:border-purple-200 border border-transparent transition-colors text-left group"
                  >
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400">{file.size}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Pressione ↵ para navegar</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400">Sistema</span>
            <VizioLogo variant="dark" size="xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
