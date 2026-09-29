import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Plus,
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { clients, addToast } = useApp();

  const activeClients = clients.filter((c) => c.status === 'Ativo');
  const totalMrr = activeClients.reduce((acc, c) => acc + c.monthlyValue, 0);
  const annualProjection = totalMrr * 12;

  const mockInvoices = [
    {
      id: 'inv_01',
      client: 'Rede Farma Mais',
      value: 12500,
      dueDate: '10/10/2026',
      status: 'Pago',
      method: 'Boleto Bancário',
    },
    {
      id: 'inv_02',
      client: 'Construtora Horizonte',
      value: 18000,
      dueDate: '15/10/2026',
      status: 'Pago',
      method: 'Transferência PIX',
    },
    {
      id: 'inv_03',
      client: 'Restaurante Sabor & Arte',
      value: 6500,
      dueDate: '20/10/2026',
      status: 'Pendente',
      method: 'Boleto Bancário',
    },
    {
      id: 'inv_04',
      client: 'TechVibe Software',
      value: 9500,
      dueDate: '25/10/2026',
      status: 'Pendente',
      method: 'Cartão de Crédito PJ',
    },
    {
      id: 'inv_05',
      client: 'Bella Estética Avançada',
      value: 7000,
      dueDate: '05/10/2026',
      status: 'Pago',
      method: 'Transferência PIX',
    },
  ];

  return (
    <div id="finance-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
            Financeiro & Faturamento Recorrente
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Gestão de MRR, faturas mensais emitidas, previsibilidade e conciliação
          </p>
        </div>

        <button
          onClick={() => addToast('Relatório financeiro exportado com sucesso.', 'success')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Exportar DRE (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase">MRR (Receita Mensal)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 font-['Space_Grotesk',sans-serif]">
              R$ {totalMrr.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +15.4%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Total em contratos ativos vigentes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase">Projeção Anual (ARR)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#FF6A00] font-['Space_Grotesk',sans-serif]">
              R$ {annualProjection.toLocaleString('pt-BR')}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Expectativa calculada de 12 meses</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase">Ticket Médio por Cliente</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 font-['Space_Grotesk',sans-serif]">
              R${' '}
              {activeClients.length > 0
                ? Math.round(totalMrr / activeClients.length).toLocaleString('pt-BR')
                : 0}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Média ponderada da carteira</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-gray-900">
            Faturas e Cobranças do Ciclo Vigente
          </h3>
          <span className="text-xs text-gray-500 font-semibold">Competência: Outubro/2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Forma de Pagamento</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Comprovante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900">{inv.client}</td>
                  <td className="py-3.5 px-4 text-gray-600">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 text-gray-600">{inv.method}</td>
                  <td className="py-3.5 px-4 font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
                    R$ {inv.value.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        inv.status === 'Pago'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => addToast(`Recibo de ${inv.client} gerado.`, 'info')}
                      className="text-xs font-bold text-[#FF6A00] hover:underline"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
