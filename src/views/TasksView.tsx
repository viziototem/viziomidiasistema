import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Task,
  TaskStatus,
  TaskPriority,
  ChecklistItem,
} from '../types';
import {
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Calendar as CalendarIcon,
  Clock,
  CheckSquare,
  AlertCircle,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  ChevronRight,
  MoreVertical,
  X,
  Send,
  User as UserIcon,
} from 'lucide-react';

const KANBAN_COLUMNS: { id: TaskStatus; label: string; dotColor: string }[] = [
  { id: 'Backlog', label: 'Backlog', dotColor: 'bg-gray-400' },
  { id: 'A Fazer', label: 'A Fazer', dotColor: 'bg-blue-500' },
  { id: 'Em Andamento', label: 'Em Andamento', dotColor: 'bg-[#FF6A00]' },
  { id: 'Em Revisão', label: 'Em Revisão', dotColor: 'bg-purple-500' },
  { id: 'Aguardando Cliente', label: 'Aguardando Cliente', dotColor: 'bg-amber-500' },
  { id: 'Concluído', label: 'Concluído', dotColor: 'bg-emerald-500' },
];

export const TasksView: React.FC = () => {
  const {
    tasks,
    moveTaskStatus,
    updateTask,
    deleteTask,
    clients,
    availableUsers,
    setNewItemModalOpen,
    setNewItemDefaultType,
    currentUser,
    isClientUser,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'timeline'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Client isolation check
    if (isClientUser) {
      if (task.clientId !== currentUser.clientId || !task.visibleToClient) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchLabels = task.labels.some((l) => l.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLabels) return false;
    }

    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false;
    }

    if (selectedClientId !== 'all' && task.clientId !== selectedClientId) {
      return false;
    }

    return true;
  });

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(colId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, colId);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  // Checklist toggle inside task detail modal
  const handleToggleChecklist = (checkId: string) => {
    if (!selectedTask) return;
    const updated = selectedTask.checklist.map((item) =>
      item.id === checkId ? { ...item, completed: !item.completed } : item
    );
    updateTask(selectedTask.id, { checklist: updated });
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newChecklistText.trim()) return;

    const newItem: ChecklistItem = {
      id: 'ck_' + Date.now(),
      text: newChecklistText.trim(),
      completed: false,
    };
    updateTask(selectedTask.id, {
      checklist: [...selectedTask.checklist, newItem],
    });
    setNewChecklistText('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newCommentText.trim()) return;

    const newComment = {
      id: 'cm_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newCommentText.trim(),
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    updateTask(selectedTask.id, {
      comments: [...selectedTask.comments, newComment],
    });
    setNewCommentText('');
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    const styles = {
      Urgente: 'bg-red-100 text-red-700 border-red-200',
      Alta: 'bg-amber-100 text-amber-800 border-amber-200',
      Normal: 'bg-blue-100 text-blue-800 border-blue-200',
      Baixa: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${styles[priority]}`}
      >
        {priority}
      </span>
    );
  };

  return (
    <div id="tasks-view" className="space-y-5 pb-12">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
            Quadro de Tarefas
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Gerenciamento visual inspirado no Trello com fluxo de aprovação e entregas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View switcher buttons */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Cronograma</span>
            </button>
          </div>

          {/* New Task button */}
          {!isClientUser && (
            <button
              onClick={() => {
                setNewItemDefaultType('task');
                setNewItemModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF6A00] hover:bg-[#E65F00] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#FF6A00]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tarefa</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filtrar tarefas por título, etiqueta ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 rounded-xl text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#FF6A00]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Priority filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:outline-hidden"
          >
            <option value="all">Todas Prioridades</option>
            <option value="Urgente">Urgente</option>
            <option value="Alta">Alta</option>
            <option value="Normal">Normal</option>
            <option value="Baixa">Baixa</option>
          </select>

          {/* Client filter */}
          {!isClientUser && (
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:outline-hidden"
            >
              <option value="all">Todos os Clientes</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 1. KANBAN VIEW (Trello Inspired) */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4 kanban-scroll">
          <div className="flex gap-4 min-w-[1300px]">
            {KANBAN_COLUMNS.map((column) => {
              const columnTasks = filteredTasks.filter((t) => t.status === column.id);
              const isOver = dragOverColumn === column.id;

              return (
                <div
                  key={column.id}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={`w-80 rounded-2xl flex flex-col max-h-[calc(100vh-230px)] transition-all ${
                    isOver
                      ? 'bg-orange-50/80 border-2 border-dashed border-[#FF6A00]'
                      : 'bg-gray-100/80 border border-gray-200/80'
                  }`}
                >
                  {/* Column Header */}
                  <div className="p-3.5 flex items-center justify-between border-b border-gray-200/60">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                      <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                        {column.label}
                      </h3>
                      <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-full bg-white text-gray-600 shadow-2xs">
                        {columnTasks.length}
                      </span>
                    </div>

                    {!isClientUser && (
                      <button
                        onClick={() => {
                          setNewItemDefaultType('task');
                          setNewItemModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white"
                        title="Adicionar tarefa nesta coluna"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Tasks Cards Scrollable List */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1">
                    {columnTasks.length === 0 ? (
                      <div className="py-8 text-center text-gray-400 text-xs italic">
                        Arraste cartões para cá
                      </div>
                    ) : (
                      columnTasks.map((task) => {
                        const clientName = clients.find((c) => c.id === task.clientId)?.companyName;
                        const completedChecks = task.checklist.filter((c) => c.completed).length;
                        const totalChecks = task.checklist.length;
                        const checkPercent =
                          totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onClick={() => setSelectedTaskId(task.id)}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-[#FF6A00]/40 transition-all cursor-grab active:cursor-grabbing group select-none text-left"
                          >
                            {/* Client & Priority Header */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                              {clientName ? (
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">
                                  {clientName}
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-gray-400">Interno</span>
                              )}
                              {getPriorityBadge(task.priority)}
                            </div>

                            {/* Title */}
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#FF6A00] transition-colors leading-snug">
                              {task.title}
                            </h4>

                            {/* Labels */}
                            {task.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.labels.map((l) => (
                                  <span
                                    key={l}
                                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-600"
                                  >
                                    #{l}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Checklist progress bar */}
                            {totalChecks > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 mb-1">
                                  <span className="flex items-center gap-1">
                                    <CheckSquare className="w-3 h-3 text-emerald-500" />
                                    Checklist
                                  </span>
                                  <span>
                                    {completedChecks}/{totalChecks} ({checkPercent}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className={`h-1.5 rounded-full transition-all ${
                                      checkPercent === 100 ? 'bg-emerald-500' : 'bg-[#FF6A00]'
                                    }`}
                                    style={{ width: `${checkPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Footer info: deadline, attachments, comments, assignees */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-gray-400 text-xs">
                              <div className="flex items-center gap-2.5">
                                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                  <CalendarIcon className="w-3 h-3" />
                                  {task.deadline.slice(5)}
                                </span>
                                {task.comments.length > 0 && (
                                  <span className="flex items-center gap-0.5 text-[11px] text-gray-500">
                                    <MessageSquare className="w-3 h-3" />
                                    {task.comments.length}
                                  </span>
                                )}
                                {task.attachments.length > 0 && (
                                  <span className="flex items-center gap-0.5 text-[11px] text-gray-500">
                                    <Paperclip className="w-3 h-3" />
                                    {task.attachments.length}
                                  </span>
                                )}
                              </div>

                              {/* Assignee avatars */}
                              <div className="flex -space-x-1.5 overflow-hidden">
                                {task.assignedUserIds.map((uid) => {
                                  const u = availableUsers.find((user) => user.id === uid);
                                  return (
                                    <img
                                      key={uid}
                                      src={u?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                                      alt={u?.name || 'User'}
                                      title={u?.name}
                                      className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Tarefa</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Prioridade</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Checklist</th>
                  <th className="py-3.5 px-4">Prazo</th>
                  <th className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTasks.map((task) => {
                  const client = clients.find((c) => c.id === task.clientId);
                  const completedChecks = task.checklist.filter((c) => c.completed).length;

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-gray-900 max-w-xs truncate">
                        {task.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getPriorityBadge(task.priority)}</td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {client?.companyName || '—'}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {completedChecks}/{task.checklist.length} concluídos
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-semibold">{task.deadline}</td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-xs text-[#FF6A00] font-bold hover:underline">
                          Abrir Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-sm text-gray-900">
              Cronograma de Entregas e Milestones
            </h3>
            <p className="text-xs text-gray-500">Organização cronológica por data de entrega prevista</p>
          </div>

          <div className="relative border-l-2 border-orange-200 ml-4 pl-6 space-y-6 pt-2">
            {filteredTasks
              .sort((a, b) => a.deadline.localeCompare(b.deadline))
              .map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#FF6A00] ring-4 ring-orange-100" />
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-orange-50/40 hover:border-orange-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">{task.deadline}</span>
                        {getPriorityBadge(task.priority)}
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white border border-gray-200 font-semibold text-gray-700">
                          {task.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">{task.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FF6A00]">
                        {task.checklist.filter((c) => c.completed).length}/{task.checklist.length} etapas
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TASK DETAILS MODAL (Trello Card Inspect) */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedTaskId(null)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between gap-4 bg-gray-50/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-[#FF6A00] uppercase tracking-wider">
                    {clients.find((c) => c.id === selectedTask.clientId)?.companyName || 'Vizio Midia Interno'}
                  </span>
                  {getPriorityBadge(selectedTask.priority)}
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">{selectedTask.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTaskId(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Quick Status Bar */}
              <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-orange-50/60 border border-orange-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Mover para:</span>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => moveTaskStatus(selectedTask.id, e.target.value as TaskStatus)}
                    className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-900 focus:outline-hidden"
                  >
                    {KANBAN_COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span>Prazo final: <strong>{selectedTask.deadline}</strong></span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Descrição & Instruções
                </h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed whitespace-pre-wrap">
                  {selectedTask.description || 'Nenhuma descrição fornecida.'}
                </p>
              </div>

              {/* Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-[#FF6A00]" />
                    Checklist de Execução
                  </h4>
                  <span className="text-xs font-bold text-gray-500">
                    {selectedTask.checklist.filter((c) => c.completed).length}/
                    {selectedTask.checklist.length} concluídos
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedTask.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        className="rounded text-[#FF6A00] focus:ring-[#FF6A00] w-4 h-4"
                      />
                      <span
                        className={`text-sm ${
                          item.completed ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add checklist item */}
                <form onSubmit={handleAddChecklistItem} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar novo item de checklist..."
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#FF6A00] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors"
                  >
                    Adicionar
                  </button>
                </form>
              </div>

              {/* Attachments */}
              {selectedTask.attachments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-[#FF6A00]" />
                    Arquivos Anexados
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTask.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-2 bg-gray-50/50"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{att.name}</p>
                          <span className="text-[10px] text-gray-400">{att.size}</span>
                        </div>
                        <button
                          onClick={() => alert(`Iniciando download simulado de ${att.name}`)}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#FF6A00] hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          Baixar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments & Activity Stream */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#FF6A00]" />
                  Comentários & Alinhamentos
                </h4>

                <div className="space-y-3 mb-4">
                  {selectedTask.comments.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Nenhum comentário ainda.</p>
                  ) : (
                    selectedTask.comments.map((cm) => (
                      <div key={cm.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-900">{cm.userName}</span>
                          <span className="text-[10px] text-gray-400">{cm.createdAt}</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{cm.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escreva um comentário ou informe uma atualização..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FF6A00] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF6A00] text-white rounded-xl text-xs font-bold hover:bg-[#E65F00] transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Enviar
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              {!isClientUser && (
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                      deleteTask(selectedTask.id);
                      setSelectedTaskId(null);
                    }
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Excluir Tarefa
                </button>
              )}
              <button
                onClick={() => setSelectedTaskId(null)}
                className="ml-auto px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
