import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ClientFinancialRecord, FixedExpenseItem } from '../types';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  PieChart,
  Percent,
  Receipt,
  Download,
  Printer,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Edit3,
  Plus,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronDown,
  Layers,
  BarChart3,
  Briefcase,
  X,
  Save,
} from 'lucide-react';

export const FinanceCalculationView: React.FC = () => {
  const {
    currentUser,
    clients,
    financialRecords,
    financialConfig,
    updateClientFinancialRecord,
    updateFinancialConfig,
    addFixedExpense,
    deleteFixedExpense,
    addToast,
  } = useApp();

  // Filters & State
  const [selectedPeriod, setSelectedPeriod] = useState<'current_month' | 'last_month' | 'q3' | 'year'>('current_month');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'profitable' | 'attention'>('all');
  const [sortBy, setSortBy] = useState<'profit' | 'revenue' | 'margin' | 'investment' | 'name'>('profit');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals state
  const [editingRecord, setEditingRecord] = useState<ClientFinancialRecord | null>(null);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [newExpenseModalOpen, setNewExpenseModalOpen] = useState(false);

  // New expense form
  const [expenseName, setExpenseName] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<FixedExpenseItem['category']>('Softwares & Ferramentas');
  const [expenseAmount, setExpenseAmount] = useState('');

  // Simulator state
  const [simClientName, setSimClientName] = useState('Novo Cliente Exemplo');
  const [simFee, setSimFee] = useState(10000);
  const [simTaxRate, setSimTaxRate] = useState(financialConfig.defaultTaxRatePercent || 6);
  const [simInvestment, setSimInvestment] = useState(15000);
  const [simTeamCost, setSimTeamCost] = useState(2800);
  const [simDirectExpenses, setSimDirectExpenses] = useState(500);

  // Formatters
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Compile calculations for each client
  const clientFinancialRows = useMemo(() => {
    return clients.map((client) => {
      // Find record or provide defaults from client data
      const record = financialRecords.find((r) => r.clientId === client.id) || {
        clientId: client.id,
        monthlyFee: client.monthlyValue || 0,
        extraRevenue: 0,
        taxRatePercent: financialConfig.defaultTaxRatePercent || 6,
        mediaInvestmentBudget: 0,
        teamCostAllocated: (client.monthlyValue || 0) * 0.3,
        directExpenses: 300,
        notes: '',
      };

      const totalRevenue = record.monthlyFee + (record.extraRevenue || 0);
      const taxAmount = (totalRevenue * (record.taxRatePercent || 6)) / 100;
      const netRevenue = totalRevenue - taxAmount;
      const totalDirectExpenses = (record.teamCostAllocated || 0) + (record.directExpenses || 0);
      const netProfit = netRevenue - totalDirectExpenses;
      const profitMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      // Status indicator
      let health: 'excellent' | 'healthy' | 'warning' = 'healthy';
      if (profitMarginPercent >= 50) health = 'excellent';
      else if (profitMarginPercent < 30) health = 'warning';

      return {
        client,
        record,
        totalRevenue,
        taxAmount,
        netRevenue,
        totalDirectExpenses,
        netProfit,
        profitMarginPercent,
        health,
      };
    });
  }, [clients, financialRecords, financialConfig.defaultTaxRatePercent]);

  // Filter & Sort
  const filteredRows = useMemo(() => {
    return clientFinancialRows
      .filter((row) => {
        const matchesSearch =
          row.client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.client.contactName.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (statusFilter === 'active') return row.client.status === 'Ativo';
        if (statusFilter === 'profitable') return row.health === 'excellent';
        if (statusFilter === 'attention') return row.health === 'warning';
        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        switch (sortBy) {
          case 'profit':
            valA = a.netProfit;
            valB = b.netProfit;
            break;
          case 'revenue':
            valA = a.totalRevenue;
            valB = b.totalRevenue;
            break;
          case 'margin':
            valA = a.profitMarginPercent;
            valB = b.profitMarginPercent;
            break;
          case 'investment':
            valA = a.record.mediaInvestmentBudget;
            valB = b.record.mediaInvestmentBudget;
            break;
          case 'name':
            return sortOrder === 'asc'
              ? a.client.companyName.localeCompare(b.client.companyName)
              : b.client.companyName.localeCompare(a.client.companyName);
        }

        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [clientFinancialRows, searchQuery, statusFilter, sortBy, sortOrder]);

  // Totals calculations
  const totals = useMemo(() => {
    const grossRevenue = clientFinancialRows.reduce((acc, r) => acc + r.totalRevenue, 0);
    const totalTaxes = clientFinancialRows.reduce((acc, r) => acc + r.taxAmount, 0);
    const netRevenue = grossRevenue - totalTaxes;
    const clientDirectCosts = clientFinancialRows.reduce((acc, r) => acc + r.totalDirectExpenses, 0);
    const managedMediaInvestment = clientFinancialRows.reduce(
      (acc, r) => acc + (r.record.mediaInvestmentBudget || 0),
      0
    );

    const companyFixedExpenses = financialConfig.fixedExpenses.reduce((acc, f) => acc + f.amount, 0);
    const totalExpenses = clientDirectCosts + companyFixedExpenses;
    const grossOperatingProfit = netRevenue - clientDirectCosts;
    const finalNetProfit = grossOperatingProfit - companyFixedExpenses;
    const overallNetMargin = grossRevenue > 0 ? (finalNetProfit / grossRevenue) * 100 : 0;

    return {
      grossRevenue,
      totalTaxes,
      netRevenue,
      clientDirectCosts,
      managedMediaInvestment,
      companyFixedExpenses,
      totalExpenses,
      grossOperatingProfit,
      finalNetProfit,
      overallNetMargin,
    };
  }, [clientFinancialRows, financialConfig.fixedExpenses]);

  // Handle record edit submit
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    updateClientFinancialRecord(editingRecord);
    setEditingRecord(null);
  };

  // Add new fixed expense submit
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(expenseAmount.replace(',', '.'));
    if (!expenseName.trim() || isNaN(amountNum) || amountNum <= 0) {
      addToast('Preencha um nome válido e valor maior que zero.', 'error');
      return;
    }
    addFixedExpense({
      name: expenseName.trim(),
      category: expenseCategory,
      amount: amountNum,
      recurrence: 'Mensal',
    });
    setExpenseName('');
    setExpenseAmount('');
    setNewExpenseModalOpen(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Cliente',
      'Status',
      'Faturamento_Bruto_BRL',
      'Aliquota_Imposto_%',
      'Valor_Imposto_BRL',
      'Receita_Liquida_BRL',
      'Investimento_Media_Gerenciado_BRL',
      'Custo_Equipe_Alocado_BRL',
      'Gastos_Diretos_BRL',
      'Total_Gastos_Cliente_BRL',
      'Lucro_Liquido_BRL',
      'Margem_Lucro_%',
    ];

    const rows = clientFinancialRows.map((r) => [
      `"${r.client.companyName}"`,
      r.client.status,
      r.totalRevenue.toFixed(2),
      r.record.taxRatePercent.toFixed(2),
      r.taxAmount.toFixed(2),
      r.netRevenue.toFixed(2),
      r.record.mediaInvestmentBudget.toFixed(2),
      r.record.teamCostAllocated.toFixed(2),
      r.record.directExpenses.toFixed(2),
      r.totalDirectExpenses.toFixed(2),
      r.netProfit.toFixed(2),
      r.profitMarginPercent.toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `relatorio-financeiro-vizio-midia-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Relatório Financeiro exportado em CSV com sucesso!', 'success');
  };

  // Print friendly
  const handlePrint = () => {
    window.print();
  };

  // Simulator calculations
  const simTaxAmount = (simFee * simTaxRate) / 100;
  const simTotalCosts = simTeamCost + simDirectExpenses;
  const simNetProfit = simFee - simTaxAmount - simTotalCosts;
  const simMargin = simFee > 0 ? (simNetProfit / simFee) * 100 : 0;

  // Non-admin fallback safeguard
  if (currentUser.role !== 'admin') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-xl mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">Acesso Restrito ao Administrador</h2>
        <p className="text-sm text-red-700">
          Esta área contém dados contábeis, impostos, custos e margem de lucro sensíveis da Vizio Mídia.
          Apenas usuários com perfil de Administrador Geral têm autorização de acesso.
        </p>
      </div>
    );
  }

  return (
    <div id="finance-calculation-view" className="space-y-8 pb-16">
      {/* Top Banner & Control Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-[#FF6A00] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Módulo Exclusivo ADM
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Regime Tributário: <strong className="text-gray-900">{financialConfig.companyTaxRegime} ({financialConfig.defaultTaxRatePercent}%)</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif] tracking-tight">
            Cálculo Financeiro & DRE da Empresa
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Painel contábil consolidado com cálculo de impostos, verba de investimento gerenciada, gastos operacionais,
            lucro real e rentabilidade detalhada de todos os clientes da Vizio Mídia.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSimulatorOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Calculator className="w-4 h-4 text-[#FF6A00]" />
            Simulador de Contrato
          </button>

          <button
            onClick={() => setSettingsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all"
            title="Ajustar alíquota padrão e custos fixos"
          >
            <Sliders className="w-4 h-4 text-gray-600" />
            Parâmetros Fiscais
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
            title="Imprimir / Salvar PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Macro KPI Cards (Executive Summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Faturamento Bruto</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-black text-gray-900 font-['Space_Grotesk',sans-serif]">
              {formatBRL(totals.grossRevenue)}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              {clientFinancialRows.length} contratos ativos + adicionais
            </p>
          </div>
        </div>

        {/* Taxes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Impostos Previstos</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Receipt className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-black text-amber-600 font-['Space_Grotesk',sans-serif]">
              {formatBRL(totals.totalTaxes)}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Alíquota média ~{((totals.totalTaxes / totals.grossRevenue) * 100 || 6).toFixed(1)}% Simples
            </p>
          </div>
        </div>

        {/* Media Investment Managed */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Verba de Mídia Ads</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-black text-purple-700 font-['Space_Grotesk',sans-serif]">
              {formatBRL(totals.managedMediaInvestment)}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Meta Ads & Google Ads sob gestão
            </p>
          </div>
        </div>

        {/* Gastos Operacionais Totais */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Gastos Totais</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-black text-rose-600 font-['Space_Grotesk',sans-serif]">
              {formatBRL(totals.totalExpenses)}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Equipe + ferramentas + fixos
            </p>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-gradient-to-br from-gray-900 to-[#141414] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">Lucro Líquido Real</span>
            <span className="p-2 rounded-xl bg-[#FF6A00]/20 text-[#FF6A00]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-black text-emerald-400 font-['Space_Grotesk',sans-serif]">
              {formatBRL(totals.finalNetProfit)}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Resultado final da agência no mês
            </p>
          </div>
        </div>

        {/* Net Margin */}
        <div className="bg-[#FF6A00] text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-100">Margem Líquida</span>
            <span className="p-2 rounded-xl bg-white/20 text-white">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-xl xl:text-2xl font-black font-['Space_Grotesk',sans-serif]">
              {formatPercent(totals.overallNetMargin)}
            </div>
            <p className="text-[11px] text-orange-100 mt-1 font-medium">
              Rentabilidade líquida da operação
            </p>
          </div>
        </div>
      </div>

      {/* DRE Sintética da Vizio Midia */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#FF6A00]" />
              DRE Sintética • Demonstração do Resultado do Exercício
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Decomposição contábil das receitas, tributação incidente, custos de entrega e lucro final
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
            Período: Mês Corrente (Set/2026)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* DRE Step Lines */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 font-bold text-gray-800">
              <span className="flex items-center gap-2">
                <span className="text-emerald-600 font-extrabold">(+)</span> Receita Operacional Bruta (Faturamento)
              </span>
              <span>{formatBRL(totals.grossRevenue)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl text-gray-600 pl-6 border-l-2 border-amber-300">
              <span className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">(-)</span> Impostos sobre Serviços ({financialConfig.companyTaxRegime})
              </span>
              <span className="text-amber-700 font-semibold">- {formatBRL(totals.totalTaxes)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 font-bold text-blue-950">
              <span className="flex items-center gap-2">
                <span className="text-blue-600 font-extrabold">(=)</span> Receita Operacional Líquida
              </span>
              <span>{formatBRL(totals.netRevenue)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl text-gray-600 pl-6 border-l-2 border-rose-300">
              <span className="flex items-center gap-2">
                <span className="text-rose-600 font-bold">(-)</span> Custos Operacionais Diretos dos Clientes (Equipe & Ferramentas)
              </span>
              <span className="text-rose-700 font-semibold">- {formatBRL(totals.clientDirectCosts)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 font-bold text-emerald-950">
              <span className="flex items-center gap-2">
                <span className="text-emerald-600 font-extrabold">(=)</span> Lucro Bruto da Operação
              </span>
              <span>{formatBRL(totals.grossOperatingProfit)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl text-gray-600 pl-6 border-l-2 border-purple-300">
              <span className="flex items-center gap-2">
                <span className="text-purple-600 font-bold">(-)</span> Despesas Fixas da Empresa (Folha, Pró-labore, Softwares)
              </span>
              <span className="text-purple-700 font-semibold">- {formatBRL(totals.companyFixedExpenses)}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-900 text-white font-extrabold text-sm sm:text-base shadow-sm">
              <span className="flex items-center gap-2">
                <span className="text-[#FF6A00]">(=)</span> Lucro Líquido Real Final
              </span>
              <span className="text-emerald-400 font-['Space_Grotesk',sans-serif]">
                {formatBRL(totals.finalNetProfit)} ({formatPercent(totals.overallNetMargin)})
              </span>
            </div>
          </div>

          {/* Graphical Percentage Breakdown */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Distribuição Proporcional do Faturamento
            </h4>

            {/* Visual Bar */}
            <div className="h-4 rounded-full overflow-hidden flex w-full shadow-inner bg-gray-200">
              <div
                style={{ width: `${(totals.totalTaxes / totals.grossRevenue) * 100}%` }}
                className="bg-amber-500 h-full"
                title="Impostos"
              />
              <div
                style={{ width: `${(totals.clientDirectCosts / totals.grossRevenue) * 100}%` }}
                className="bg-rose-500 h-full"
                title="Custos Diretos Clientes"
              />
              <div
                style={{ width: `${(totals.companyFixedExpenses / totals.grossRevenue) * 100}%` }}
                className="bg-purple-500 h-full"
                title="Despesas Fixas"
              />
              <div
                style={{ width: `${Math.max(0, totals.overallNetMargin)}%` }}
                className="bg-emerald-500 h-full"
                title="Lucro Líquido"
              />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span className="text-gray-600">
                  Impostos: <strong>{formatPercent((totals.totalTaxes / totals.grossRevenue) * 100)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <span className="text-gray-600">
                  Custos Clientes: <strong>{formatPercent((totals.clientDirectCosts / totals.grossRevenue) * 100)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                <span className="text-gray-600">
                  Custos Fixos: <strong>{formatPercent((totals.companyFixedExpenses / totals.grossRevenue) * 100)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-gray-800 font-bold">
                  Margem Líquida: <strong>{formatPercent(totals.overallNetMargin)}</strong>
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-500 flex items-start gap-2.5 mt-2">
              <Info className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
              <span>
                Para cada <strong>R$ 1.000 faturados</strong>, a empresa retém{' '}
                <strong className="text-gray-900">{formatBRL(totals.overallNetMargin * 10)}</strong> livres após todos os
                impostos, custos de equipe e infraestrutura.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Relatório Analítico Detalhado de Todos os Clientes */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-['Space_Grotesk',sans-serif]">
              <Receipt className="w-5 h-5 text-[#FF6A00]" />
              Relatório Financeiro por Cliente (Todos os Contratos)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Cálculo individual de impostos, investimento em mídia gerenciado, gastos diretos e lucro líquido
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6A00]"
              />
            </div>

            {/* Filter by Health */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Somente Ativos</option>
              <option value="profitable">Alta Margem (&gt;50%)</option>
              <option value="attention">Em Alerta (&lt;30%)</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value="profit">Ordenar por: Maior Lucro</option>
              <option value="revenue">Ordenar por: Faturamento</option>
              <option value="margin">Ordenar por: Margem (%)</option>
              <option value="investment">Ordenar por: Verba de Ads</option>
              <option value="name">Ordenar por: Nome</option>
            </select>

            <button
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 transition-colors"
              title={sortOrder === 'desc' ? 'Decrescente' : 'Crescente'}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Cliente / Contrato</th>
                <th className="py-3 px-4">Faturamento Bruto</th>
                <th className="py-3 px-4">Imposto Incidente</th>
                <th className="py-3 px-4">Verba de Mídia (Ads)</th>
                <th className="py-3 px-4">Gastos Operacionais</th>
                <th className="py-3 px-4">Lucro Líquido</th>
                <th className="py-3 px-4">Margem (%)</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRows.map((row) => (
                <tr key={row.client.id} className="hover:bg-gray-50/60 transition-colors group">
                  {/* Client Name & Services */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-700 text-xs shrink-0 border border-gray-200">
                        {row.client.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          {row.client.companyName}
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                              row.client.status === 'Ativo'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {row.client.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 truncate max-w-[180px] block">
                          {row.client.services?.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Faturamento Bruto */}
                  <td className="py-3.5 px-4 font-bold text-gray-900 font-['Space_Grotesk',sans-serif]">
                    <div>{formatBRL(row.totalRevenue)}</div>
                    {row.record.extraRevenue > 0 && (
                      <span className="text-[10px] text-emerald-600 block">
                        (+ {formatBRL(row.record.extraRevenue)} extra)
                      </span>
                    )}
                  </td>

                  {/* Imposto Incidente */}
                  <td className="py-3.5 px-4">
                    <span className="text-amber-700 font-semibold block">
                      {formatBRL(row.taxAmount)}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Alíquota {row.record.taxRatePercent}%
                    </span>
                  </td>

                  {/* Verba de Mídia Ads */}
                  <td className="py-3.5 px-4 font-semibold text-purple-700">
                    <div>{formatBRL(row.record.mediaInvestmentBudget)}</div>
                    <span className="text-[10px] text-gray-400">sob gestão</span>
                  </td>

                  {/* Gastos Operacionais */}
                  <td className="py-3.5 px-4 text-gray-700">
                    <div className="font-semibold text-rose-600">{formatBRL(row.totalDirectExpenses)}</div>
                    <span className="text-[10px] text-gray-400">
                      Equipe: {formatBRL(row.record.teamCostAllocated)} | Desp: {formatBRL(row.record.directExpenses)}
                    </span>
                  </td>

                  {/* Lucro Líquido */}
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600 font-['Space_Grotesk',sans-serif] text-sm">
                    {formatBRL(row.netProfit)}
                  </td>

                  {/* Margem */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        row.health === 'excellent'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.health === 'healthy'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {formatPercent(row.profitMarginPercent)}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setEditingRecord({ ...row.record })}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      title="Editar valores de cálculo deste cliente"
                    >
                      <Edit3 className="w-4 h-4 text-[#FF6A00]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-4">
          <div>
            Mostrando <strong>{filteredRows.length}</strong> de <strong>{clientFinancialRows.length}</strong> clientes calculados
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <span>Faturamento Total: <strong className="text-gray-900">{formatBRL(totals.grossRevenue)}</strong></span>
            <span>Impostos: <strong className="text-amber-700">{formatBRL(totals.totalTaxes)}</strong></span>
            <span>Lucro Líquido Geral: <strong className="text-emerald-700">{formatBRL(totals.finalNetProfit)}</strong></span>
          </div>
        </div>
      </div>

      {/* Custos Fixos da Vizio Midia Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FF6A00]" />
              Custos Fixos & Despesas Administrativas da Agência
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Gastos recorrentes estruturais deduzidos na apuração do lucro líquido final
            </p>
          </div>

          <button
            onClick={() => setNewExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Custo Fixo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {financialConfig.fixedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6A00] block mb-1">
                    {expense.category}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900">{expense.name}</h4>
                </div>
                <button
                  onClick={() => deleteFixedExpense(expense.id)}
                  className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                  title="Remover custo fixo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                <span className="text-xs text-gray-500">Recorrência Mensal</span>
                <span className="text-sm font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
                  {formatBRL(expense.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: EDIT CLIENT FINANCIAL VALUES */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  Editar Parâmetros Financeiros
                </h3>
                <p className="text-xs text-gray-500">
                  {clients.find((c) => c.id === editingRecord.clientId)?.companyName}
                </p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Mensalidade Fixa / Retainer (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecord.monthlyFee}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, monthlyFee: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Receita Extra do Mês (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecord.extraRevenue || 0}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, extraRevenue: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Alíquota de Imposto (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingRecord.taxRatePercent}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, taxRatePercent: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-amber-700"
                    required
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Ex: 6% Simples Nacional</span>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Verba de Mídia / Ads Gerenciada (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecord.mediaInvestmentBudget}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        mediaInvestmentBudget: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-purple-700"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Meta Ads / Google Ads</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Custo de Equipe Alocado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecord.teamCostAllocated}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        teamCostAllocated: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Horas de design/tráfego</span>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Gastos Operacionais Diretos (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecord.directExpenses}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        directExpenses: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Ferramentas dedicadas</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Notas Internas de Precificação / Rentabilidade
                </label>
                <textarea
                  rows={2}
                  value={editingRecord.notes || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                  placeholder="Ex: Escopo renegotiado para inclusão de vídeos semanais..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              {/* Calculated preview */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 block">Lucro Líquido Previsto:</span>
                  <strong className="text-emerald-600 text-sm font-['Space_Grotesk',sans-serif]">
                    {formatBRL(
                      editingRecord.monthlyFee +
                        (editingRecord.extraRevenue || 0) -
                        ((editingRecord.monthlyFee + (editingRecord.extraRevenue || 0)) *
                          editingRecord.taxRatePercent) /
                          100 -
                        (editingRecord.teamCostAllocated + editingRecord.directExpenses)
                    )}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">Margem:</span>
                  <strong className="text-gray-900 text-sm">
                    {formatPercent(
                      editingRecord.monthlyFee + (editingRecord.extraRevenue || 0) > 0
                        ? ((editingRecord.monthlyFee +
                            (editingRecord.extraRevenue || 0) -
                            ((editingRecord.monthlyFee + (editingRecord.extraRevenue || 0)) *
                              editingRecord.taxRatePercent) /
                              100 -
                            (editingRecord.teamCostAllocated + editingRecord.directExpenses)) /
                            (editingRecord.monthlyFee + (editingRecord.extraRevenue || 0))) *
                            100
                        : 0
                    )}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  Salvar Parâmetros
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONTRACT SIMULATOR */}
      {simulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#FF6A00]" />
                  Simulador de Precificação & Rentabilidade
                </h3>
                <p className="text-xs text-gray-500">
                  Calcule a margem líquida e impostos antes de enviar a proposta comercial
                </p>
              </div>
              <button
                onClick={() => setSimulatorOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Nome do Prospect / Proposta</label>
                <input
                  type="text"
                  value={simClientName}
                  onChange={(e) => setSimClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Fee Mensal Pretendido (R$)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={simFee}
                    onChange={(e) => setSimFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Alíquota de Imposto (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={simTaxRate}
                    onChange={(e) => setSimTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Verba Ads Cliente (R$)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={simInvestment}
                    onChange={(e) => setSimInvestment(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-purple-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Custo Equipe Estimado (R$)
                  </label>
                  <input
                    type="number"
                    step="200"
                    value={simTeamCost}
                    onChange={(e) => setSimTeamCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Ferramentas / Custos (R$)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={simDirectExpenses}
                    onChange={(e) => setSimDirectExpenses(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              {/* Simulation Result Card */}
              <div className="p-4 rounded-xl bg-gray-900 text-white space-y-3 mt-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400 text-xs">Resultado da Simulação Comercial</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      simMargin >= 45
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : simMargin >= 30
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {simMargin >= 45
                      ? 'Excelente Margem'
                      : simMargin >= 30
                      ? 'Margem Saudável'
                      : 'Margem Baixa (Alerta)'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Imposto Previsto</span>
                    <strong className="text-amber-400 text-sm font-['Space_Grotesk',sans-serif]">
                      {formatBRL(simTaxAmount)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Custos de Execução</span>
                    <strong className="text-rose-400 text-sm font-['Space_Grotesk',sans-serif]">
                      {formatBRL(simTotalCosts)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Lucro Líquido Real</span>
                    <strong className="text-emerald-400 text-base font-['Space_Grotesk',sans-serif]">
                      {formatBRL(simNetProfit)}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-xs text-gray-300">Margem Líquida Resultante:</span>
                  <span className="text-lg font-black text-[#FF6A00] font-['Space_Grotesk',sans-serif]">
                    {formatPercent(simMargin)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSimulatorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold"
                >
                  Fechar Simulador
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TAX REGIME & FISCAL SETTINGS */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-gray-900">Configurações Fiscais da Empresa</h3>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Regime de Tributação</label>
                <select
                  value={financialConfig.companyTaxRegime}
                  onChange={(e) =>
                    updateFinancialConfig({
                      ...financialConfig,
                      companyTaxRegime: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800"
                >
                  <option value="Simples Nacional">Simples Nacional (Anexo III - Prestação de Serviços)</option>
                  <option value="Lucro Presumido">Lucro Presumido (13.33% - 16.33%)</option>
                  <option value="Lucro Real">Lucro Real (Apuração Trimestral / Anual)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Alíquota Padrão de Imposto (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={financialConfig.defaultTaxRatePercent}
                  onChange={(e) =>
                    updateFinancialConfig({
                      ...financialConfig,
                      defaultTaxRatePercent: parseFloat(e.target.value) || 6,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Esta alíquota será aplicada por padrão a todos os novos clientes cadastrados.
                </span>
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-black"
                >
                  Salvar e Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: NEW FIXED EXPENSE */}
      {newExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-gray-900">Novo Custo Fixo da Empresa</h3>
              <button
                onClick={() => setNewExpenseModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Descrição do Custo</label>
                <input
                  type="text"
                  placeholder="Ex: Servidor AWS / Licenças Figma"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Categoria</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                >
                  <option value="Folha & Pró-labore">Folha & Pró-labore</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Softwares & Ferramentas">Softwares & Ferramentas</option>
                  <option value="Marketing">Marketing Institucional</option>
                  <option value="Impostos Fixos / Taxas">Impostos Fixos / Taxas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Valor Mensal (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 2500"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#E65F00] text-white font-bold"
                >
                  Adicionar Custo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
