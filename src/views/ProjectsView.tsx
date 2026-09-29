import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus } from '../types';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  MoreVertical,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    updateProject,
    deleteProject,
    clients,
    tasks,
    availableUsers,
    setActiveSection,
    setNewItemModalOpen,
    setNewItemDefaultType,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchDesc = project.description.toLowerCase().includes(q);
      const matchCat = project.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    if (selectedStatus !== 'all' && project.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    const styles: Record<ProjectStatus, string> = {
      'Em Andamento': 'bg-orange-50 text-[#FF6A00] border-orange-200',
      Planejamento: 'bg-blue-50 text-blue-700 border-blue-200',
      'Em Revisão': 'bg-purple-50 text-purple-700 border-purple-200',
      'Aguardando Cliente': 'bg-amber-50 text-amber-700 border-amber-200',
      Concluído: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Pausado: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles['Em Andamento']}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div id="projects-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
            Projetos & Campanhas
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Gestão estratégica de entregas macro, prazos contratuais e alocação de equipe
          </p>
        </div>

        <button
          onClick={() => {
            setNewItemDefaultType('project');
            setNewItemModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6A00] hover:bg-[#E65F00] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#FF6A00]/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Pesquisar projetos por título, escopo ou categoria..."
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
            <option value="all">Todos os Status ({projects.length})</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Planejamento">Planejamento</option>
            <option value="Em Revisão">Em Revisão</option>
            <option value="Aguardando Cliente">Aguardando Cliente</option>
            <option value="Concluído">Concluído</option>
            <option value="Pausado">Pausado</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => {
          const client = clients.find((c) => c.id === project.clientId);
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completedTasks = projectTasks.filter((t) => t.status === 'Concluído');
          const progressPercent =
            projectTasks.length > 0
              ? Math.round((completedTasks.length / projectTasks.length) * 100)
              : 25;

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-[#FF6A00]/50 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#FF6A00] uppercase tracking-wider">
                      {client?.companyName || 'Projeto Interno'}
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif] mt-0.5">
                      {project.title}
                    </h3>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1.5">
                    <span>Progresso Operacional</span>
                    <span className="text-[#FF6A00] font-black">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#FF6A00] h-2 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metric pills */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <span className="text-[10px] text-gray-400 block font-medium">Orçamento</span>
                    <span className="text-xs font-bold text-gray-900">
                      R$ {project.budget.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <span className="text-[10px] text-gray-400 block font-medium">Entrega</span>
                    <span className="text-xs font-bold text-gray-900">{project.deadline}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <span className="text-[10px] text-gray-400 block font-medium">Tarefas</span>
                    <span className="text-xs font-bold text-gray-900">
                      {completedTasks.length}/{projectTasks.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team and action footer */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {project.teamIds.map((uid) => {
                      const u = availableUsers.find((user) => user.id === uid);
                      return (
                        <img
                          key={uid}
                          src={u?.avatar}
                          alt={u?.name}
                          title={u?.name}
                          className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                        />
                      );
                    })}
                  </div>
                  <span className="text-[11px] text-gray-400 ml-1">Equipe alocada</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSection('Tarefas')}
                    className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <span>Ver Tarefas</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
