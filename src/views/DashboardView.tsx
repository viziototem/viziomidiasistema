import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  UserMinus,
  Sparkles,
  FolderKanban,
  CheckSquare,
  AlertCircle,
  FileBox,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Calculator,
  MessageCircle,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    clients,
    projects,
    tasks,
    leads,
    files,
    activityLogs,
    setActiveSection,
    setNewItemModalOpen,
    setNewItemDefaultType,
    currentUser,
  } = useApp();

  const [activeChartTab, setActiveChartTab] = useState<'evolution' | 'status' | 'projects' | 'team'>('evolution');

  // Computed metrics
  const activeClientsCount = clients.filter((c) => c.status === 'Ativo').length;
  const newClientsThisMonth = 3;
  const lostClientsThisMonth = 1;
  const leadsCount = leads.length;
  const ongoingProjectsCount = projects.filter((p) => p.status === 'Em Andamento').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Concluído').length;
  
  // Overdue tasks
  const today = new Date().toISOString().split('T')[0];
  const overdueTasksCount = tasks.filter(
    (t) => t.status !== 'Concluído' && t.deadline < today
  ).length;

  const totalFilesCount = files.length;

  const quickActions = [
    { label: 'Novo Cliente', type: 'client' as const, icon: <UserPlus className="w-4 h-4" /> },
    { label: 'Nova Tarefa', type: 'task' as const, icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Novo Projeto', type: 'project' as const, icon: <FolderKanban className="w-4 h-4" /> },
    { label: 'Adicionar Lead', type: 'lead' as const, icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Enviar Arquivo', type: 'file' as const, icon: <FileBox className="w-4 h-4" /> },
  ];

  const handleQuickAction = (type: 'task' | 'client' | 'project' | 'lead' | 'file') => {
    setNewItemDefaultType(type);
    setNewItemModalOpen(true);
  };

  // Evolution chart data points
  const evolutionData = [
    { month: 'Mai', clients: 4, mrr: 28 },
    { month: 'Jun', clients: 5, mrr: 36 },
    { month: 'Jul', clients: 5, mrr: 39 },
    { month: 'Ago', clients: 6, mrr: 48 },
    { month: 'Set', clients: 8, mrr: 62 },
  ];

  // Team productivity data
  const teamProductivity = [
    { name: 'Lucas A.', role: 'Design', tasks: 14, percent: 85 },
    { name: 'Juliana P.', role: 'Social & Copy', tasks: 18, percent: 92 },
    { name: 'Rafael B.', role: 'Tráfego', tasks: 12, percent: 78 },
    { name: 'Mariana C.', role: 'Gestão', tasks: 16, percent: 95 },
  ];

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#171717] via-[#222222] to-[#171717] text-white rounded-2xl p-6 sm:p-8 border border-[#2D2D2D] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#FF6A00]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] text-xs font-bold tracking-wide uppercase mb-3 border border-[#FF6A00]/30">
            Painel Executivo • Vizio Midia
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk',sans-serif]">
            Bom dia, {currentUser.name.split(' ')[0]}!
          </h2>
          <p className="text-gray-300 text-sm mt-1.5 leading-relaxed">
            Aqui está a visão consolidada de performance: campanhas em andamento, pipeline comercial,
            demandas operacionais e entregas da equipe.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="relative z-10 flex flex-wrap gap-2">
          {quickActions.map((act) => (
            <button
              key={act.label}
              onClick={() => handleQuickAction(act.type)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#252525] hover:bg-[#FF6A00] text-gray-200 hover:text-white border border-[#353535] hover:border-[#FF6A00] transition-all shadow-xs cursor-pointer"
            >
              {act.icon}
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Clientes Ativos */}
        <div
          onClick={() => setActiveSection('Clientes')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#FF6A00]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Clientes Ativos
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
              {activeClientsCount}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +20%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Total na carteira recorrente</p>
        </div>

        {/* 2. Novos Clientes */}
        <div
          onClick={() => setActiveSection('Clientes')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Novos Clientes
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
              +{newClientsThisMonth}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Neste Mês</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Novas assinaturas assinadas</p>
        </div>

        {/* 3. Clientes Perdidos */}
        <div
          onClick={() => setActiveSection('Clientes')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Clientes Perdidos
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserMinus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
              {lostClientsThisMonth}
            </span>
            <span className="flex items-center text-xs font-semibold text-gray-500">
              Churn &lt; 2.5%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Controle de retenção</p>
        </div>

        {/* 4. Possíveis Clientes (Leads) */}
        <div
          onClick={() => setActiveSection('CRM')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Possíveis Clientes
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
              {leadsCount}
            </span>
            <span className="text-xs font-semibold text-amber-600">No CRM</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Oportunidades em qualificação</p>
        </div>

        {/* 5. Projetos em Andamento */}
        <div
          onClick={() => setActiveSection('Projetos')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Projetos em Andamento
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
              {ongoingProjectsCount}
            </span>
            <span className="text-xs font-semibold text-indigo-600">Ativos</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Campanhas & Branded Content</p>
        </div>

        {/* 6. Tarefas Pendentes */}
        <div
          onClick={() => setActiveSection('Tarefas')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#FF6A00] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tarefas Pendentes
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
              {pendingTasksCount}
            </span>
            <span className="text-xs font-semibold text-gray-500">No Kanban</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Backlog, execução & revisão</p>
        </div>

        {/* 7. Tarefas Atrasadas */}
        <div
          onClick={() => setActiveSection('Tarefas')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-red-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tarefas Atrasadas
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-red-600 font-['Space_Grotesk',sans-serif]">
              {overdueTasksCount}
            </span>
            <span className="text-xs font-semibold text-red-500">Atenção</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Prazos expirados aguardando</p>
        </div>

        {/* 8. Arquivos Recebidos */}
        <div
          onClick={() => setActiveSection('Arquivos')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Arquivos Recebidos
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileBox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
              {totalFilesCount}
            </span>
            <span className="text-xs font-semibold text-purple-600">Total</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Fotos, vídeos e contratos</p>
        </div>
      </div>

      {/* Admin Executive Cockpit Banner */}
      {currentUser.role === 'admin' && (
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border border-gray-800 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/20 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00] shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm font-['Space_Grotesk',sans-serif]">
                  Cálculo Financeiro & DRE da Empresa
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6A00] text-white">
                  Exclusivo ADM
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Consulte o faturamento bruto, cálculo de impostos, verba de mídia Ads, gastos e lucro líquido de todos os clientes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveSection('Chat da Equipe')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat WhatsApp</span>
            </button>
            <button
              onClick={() => setActiveSection('Cálculo Financeiro')}
              className="px-4 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Acessar Módulo Financeiro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Executive Visualizers (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base font-['Space_Grotesk',sans-serif]">
                Visão Gráfica & Desempenho
              </h3>
              <p className="text-xs text-gray-500">Métricas analíticas em tempo real da Vizio Midia</p>
            </div>

            {/* Chart view selector buttons */}
            <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActiveChartTab('evolution')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeChartTab === 'evolution'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Evolução
              </button>
              <button
                onClick={() => setActiveChartTab('status')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeChartTab === 'status'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Clientes
              </button>
              <button
                onClick={() => setActiveChartTab('projects')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeChartTab === 'projects'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Projetos
              </button>
              <button
                onClick={() => setActiveChartTab('team')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeChartTab === 'team'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Equipe
              </button>
            </div>
          </div>

          <div className="pt-6 min-h-[280px] flex items-center justify-center">
            {/* 1. Evolução de Clientes e MRR (Line Chart) */}
            {activeChartTab === 'evolution' && (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#FF6A00]" />
                      MRR Recorrente (R$ mil)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-gray-900" />
                      Qtd. Clientes
                    </span>
                  </div>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +121% no último quadrimestre
                  </span>
                </div>

                {/* SVG Responsive Line Chart */}
                <div className="h-56 w-full pt-4">
                  <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                    {/* Grid horizontal lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#F3F4F6" strokeWidth="1" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#F3F4F6" strokeWidth="1" />
                    <line x1="0" y1="130" x2="500" y2="130" stroke="#F3F4F6" strokeWidth="1" />

                    {/* Gradient under orange line */}
                    <defs>
                      <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                      d="M 50 140 L 150 115 L 250 105 L 350 75 L 450 30 L 450 160 L 50 160 Z"
                      fill="url(#orangeGradient)"
                    />

                    {/* MRR Line (#FF6A00) */}
                    <path
                      d="M 50 140 L 150 115 L 250 105 L 350 75 L 450 30"
                      fill="none"
                      stroke="#FF6A00"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Client count line (Dark) */}
                    <path
                      d="M 50 150 L 150 135 L 250 135 L 350 120 L 450 90"
                      fill="none"
                      stroke="#111111"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Data Points */}
                    {evolutionData.map((d, i) => {
                      const x = 50 + i * 100;
                      const y = 140 - i * 27.5;
                      return (
                        <g key={d.month} className="cursor-pointer group">
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            className="fill-white stroke-[#FF6A00] stroke-[3]"
                          />
                          <text
                            x={x}
                            y={y - 12}
                            textAnchor="middle"
                            className="text-[11px] font-bold fill-gray-900"
                          >
                            R$ {d.mrr}k
                          </text>
                          <text
                            x={x}
                            y="175"
                            textAnchor="middle"
                            className="text-[11px] font-semibold fill-gray-400"
                          >
                            {d.month}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            )}

            {/* 2. Clientes por Status (Donut Chart) */}
            {activeChartTab === 'status' && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-6">
                <div className="flex justify-center relative">
                  <svg viewBox="0 0 160 160" className="w-48 h-48 -rotate-90">
                    {/* Donut rings */}
                    <circle cx="80" cy="80" r="56" fill="transparent" stroke="#F3F4F6" strokeWidth="20" />
                    {/* Ativo (65%) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="56"
                      fill="transparent"
                      stroke="#FF6A00"
                      strokeWidth="20"
                      strokeDasharray="230 350"
                      strokeDashoffset="0"
                    />
                    {/* Negociação (20%) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="56"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="20"
                      strokeDasharray="70 350"
                      strokeDashoffset="-230"
                    />
                    {/* Pausado (15%) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="56"
                      fill="transparent"
                      stroke="#F59E0B"
                      strokeWidth="20"
                      strokeDasharray="50 350"
                      strokeDashoffset="-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-gray-900 font-['Space_Grotesk',sans-serif]">
                      {clients.length}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Total</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#FF6A00]" />
                      <span className="text-xs font-bold text-gray-800">Ativos</span>
                    </div>
                    <span className="text-xs font-extrabold text-[#FF6A00]">
                      {activeClientsCount} (66%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-gray-800">Em Negociação</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600">1 (17%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold text-gray-800">Pausados / Standby</span>
                    </div>
                    <span className="text-xs font-extrabold text-amber-600">1 (17%)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Projetos por Status (Bar chart) */}
            {activeChartTab === 'projects' && (
              <div className="w-full space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>Em Andamento</span>
                      <span>2 projetos (40%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="bg-[#FF6A00] h-3 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>Em Revisão com Cliente</span>
                      <span>1 projeto (20%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="bg-amber-500 h-3 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>Planejamento Inicial</span>
                      <span>1 projeto (20%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>Concluídos este trimestre</span>
                      <span>1 projeto (20%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Produtividade da Equipe */}
            {activeChartTab === 'team' && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamProductivity.map((member) => (
                  <div key={member.name} className="p-4 rounded-xl border border-gray-100 bg-gray-50/60">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{member.name}</p>
                        <p className="text-[11px] text-gray-500">{member.role}</p>
                      </div>
                      <span className="text-xs font-extrabold text-[#FF6A00] px-2 py-0.5 rounded-md bg-orange-100/60">
                        {member.tasks} tarefas
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-[#FF6A00] h-2 rounded-full"
                        style={{ width: `${member.percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>Eficiência de prazos</span>
                      <span className="font-bold text-gray-700">{member.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base font-['Space_Grotesk',sans-serif]">
                Registro de Atividades
              </h3>
              <span className="text-[10px] uppercase font-bold text-[#FF6A00] bg-orange-50 px-2 py-0.5 rounded-full">
                Ao Vivo
              </span>
            </div>

            <div className="mt-4 space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-left">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 border border-gray-200">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      {log.userName}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {log.details}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveSection('Administração')}
            className="w-full mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs font-bold text-[#FF6A00] hover:text-[#E65F00] transition-colors"
          >
            <span>Ver logs de auditoria completos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Priority Focus Row: Tasks nearing deadline & quick client view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next deliverables */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-base font-['Space_Grotesk',sans-serif]">
                Próximas Entregas Prioritárias
              </h3>
              <p className="text-xs text-gray-500">Tarefas de alta relevância com prazo próximo</p>
            </div>
            <button
              onClick={() => setActiveSection('Tarefas')}
              className="text-xs font-semibold text-[#FF6A00] hover:underline"
            >
              Ver Kanban
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                onClick={() => setActiveSection('Tarefas')}
                className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-orange-50/40 hover:border-orange-200 transition-colors flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                        task.priority === 'Urgente'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'Alta'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs font-bold text-gray-900 truncate">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>Prazo: {task.deadline}</span>
                    <span>• Status: {task.status}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shrink-0">
                  {task.checklist.filter((c) => c.completed).length}/{task.checklist.length} ok
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Active Clients Snapshot */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-base font-['Space_Grotesk',sans-serif]">
                Clientes em Destaque
              </h3>
              <p className="text-xs text-gray-500">Contratos com maior volume e interação</p>
            </div>
            <button
              onClick={() => setActiveSection('Clientes')}
              className="text-xs font-semibold text-[#FF6A00] hover:underline"
            >
              Gerenciar
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {clients.slice(0, 4).map((client) => (
              <div
                key={client.id}
                onClick={() => setActiveSection('Clientes')}
                className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {client.companyName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {client.companyName}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {client.services.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-gray-900 block font-['Space_Grotesk',sans-serif]">
                    R$ {client.monthlyValue.toLocaleString('pt-BR')}
                    <span className="text-[10px] text-gray-400 font-normal">/mês</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {client.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
