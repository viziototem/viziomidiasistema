import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle2,
  Users,
  Target,
  FileText,
  Printer,
  Calculator,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { clients, projects, tasks, addToast, currentUser, setActiveSection } = useApp();

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Tipo', 'Nome_Identificador', 'Cliente_Relacionado', 'Status', 'Valor_Estimado_BRL'];
    
    const clientRows = clients.map((c) => ['Cliente', `"${c.companyName}"`, `"${c.contactName}"`, c.status, (c.monthlyValue || 0).toFixed(2)]);
    const projectRows = projects.map((p) => ['Projeto', `"${p.title}"`, `"${clients.find((c) => c.id === p.clientId)?.companyName || ''}"`, p.status, (p.budget || 0).toFixed(2)]);
    const taskRows = tasks.map((t) => ['Tarefa', `"${t.title}"`, `"${clients.find((c) => c.id === t.clientId)?.companyName || ''}"`, t.status, '0.00']);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...clientRows.map((e) => e.join(',')), ...projectRows.map((e) => e.join(',')), ...taskRows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio-desempenho-vizio-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Relatório de Desempenho exportado em CSV com sucesso!', 'success');
  };

  return (
    <div id="reports-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
            Relatórios Executivos & Performance
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Demonstrativos de produtividade da agência, retenção de clientes e prazos de entrega
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveSection('Cálculo Financeiro')}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>DRE & Cálculo Financeiro</span>
            </button>
          )}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Reports Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Taxa de Entregas no Prazo</h3>
          <p className="text-3xl font-black text-gray-900 mt-2 font-['Space_Grotesk',sans-serif]">
            94.2%
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            +3.8% comparado ao trimestre anterior
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Taxa de Conversão no CRM</h3>
          <p className="text-3xl font-black text-gray-900 mt-2 font-['Space_Grotesk',sans-serif]">
            38.5%
          </p>
          <p className="text-xs text-gray-500 mt-1">De Lead qualificado para Contrato Ativo</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Retenção de Clientes (LTV)</h3>
          <p className="text-3xl font-black text-gray-900 mt-2 font-['Space_Grotesk',sans-serif]">
            14.2 meses
          </p>
          <p className="text-xs text-gray-500 mt-1">Tempo médio de permanência na agência</p>
        </div>
      </div>

      {/* Campaign Performance by Client */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-4 font-['Space_Grotesk',sans-serif]">
          Desempenho Consolidado por Carteira de Clientes
        </h3>

        <div className="space-y-4">
          {clients.map((c) => {
            const clientTasks = tasks.filter((t) => t.clientId === c.id);
            const doneTasks = clientTasks.filter((t) => t.status === 'Concluído');
            const percent = clientTasks.length > 0 ? Math.round((doneTasks.length / clientTasks.length) * 100) : 100;

            return (
              <div key={c.id} className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{c.companyName}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {c.services.join(' • ')}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif] block">
                      R$ {c.monthlyValue.toLocaleString('pt-BR')}/mês
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {doneTasks.length} de {clientTasks.length} entregas concluídas ({percent}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
