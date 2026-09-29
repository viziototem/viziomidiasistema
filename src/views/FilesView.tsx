import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileItem, FolderType, FileCategory } from '../types';
import {
  FileBox,
  Folder,
  UploadCloud,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  FileText,
  Image,
  Video,
  FileCode,
  Archive,
  Plus,
  X,
  Share2,
} from 'lucide-react';

const FOLDERS: FolderType[] = [
  'Branding',
  'Fotos',
  'Vídeos',
  'Documentos',
  'Campanhas',
  'Social Media',
  'Contratos',
  'Outros',
];

export const FilesView: React.FC = () => {
  const {
    files,
    addFile,
    deleteFile,
    clients,
    currentUser,
    isClientUser,
    setNewItemModalOpen,
    setNewItemDefaultType,
  } = useApp();

  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  // File isolation
  const visibleFiles = files.filter((f) => {
    if (isClientUser && currentUser.clientId) {
      if (f.clientId !== currentUser.clientId) return false;
    }

    if (selectedFolder !== 'all' && f.folder !== selectedFolder) {
      return false;
    }

    if (selectedCategory !== 'all' && f.category !== selectedCategory) {
      return false;
    }

    if (!isClientUser && selectedClientId !== 'all' && f.clientId !== selectedClientId) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!f.name.toLowerCase().includes(q)) return false;
    }

    return true;
  });

  const getFileIcon = (ext: string, cat: FileCategory) => {
    if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) {
      return <Image className="w-5 h-5 text-emerald-500" />;
    }
    if (['mp4', 'mov', 'avi'].includes(ext)) {
      return <Video className="w-5 h-5 text-indigo-500" />;
    }
    if (['zip', 'rar'].includes(ext)) {
      return <Archive className="w-5 h-5 text-amber-500" />;
    }
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div id="files-view" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 font-['Space_Grotesk',sans-serif]">
            Repositório de Arquivos & Ativos
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Gestão estruturada de mídias, vídeos brutos, criativos aprovados e contratos
          </p>
        </div>

        <button
          onClick={() => {
            setNewItemDefaultType('file');
            setNewItemModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6A00] hover:bg-[#E65F00] text-white text-xs font-bold rounded-xl shadow-sm shadow-[#FF6A00]/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Fazer Upload</span>
        </button>
      </div>

      {/* Folders navigation row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <button
          onClick={() => setSelectedFolder('all')}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
            selectedFolder === 'all'
              ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
          }`}
        >
          <Folder className="w-5 h-5 mb-2 text-[#FF6A00]" />
          <div>
            <span className="text-xs font-bold block truncate">Todos</span>
            <span className="text-[10px] opacity-70">{files.length} itens</span>
          </div>
        </button>

        {FOLDERS.map((folder) => {
          const count = files.filter((f) => f.folder === folder).length;
          const isSelected = selectedFolder === folder;

          return (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Folder className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#FF6A00]' : 'text-amber-500'}`} />
              <div>
                <span className="text-xs font-bold block truncate">{folder}</span>
                <span className="text-[10px] opacity-70">{count} itens</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Pesquisar por nome de arquivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 rounded-xl text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#FF6A00]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:outline-hidden"
          >
            <option value="all">Todas Categorias</option>
            <option value="Imagens">Imagens</option>
            <option value="Vídeos">Vídeos</option>
            <option value="Documentos">Documentos</option>
            <option value="Logos">Logos</option>
            <option value="Materiais de Campanha">Materiais de Campanha</option>
          </select>

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

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleFiles.map((file) => {
          const client = clients.find((c) => c.id === file.clientId);

          return (
            <div
              key={file.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs hover:border-[#FF6A00]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform">
                    {getFileIcon(file.extension, file.category)}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                    {file.extension}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#FF6A00] transition-colors line-clamp-2 leading-snug">
                  {file.name}
                </h4>

                <p className="text-[11px] text-gray-500 mt-1 truncate">
                  {client?.companyName || 'Vizio Midia'}
                </p>

                <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>Pasta: {file.folder}</span>
                  <span>•</span>
                  <span>v{file.version}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                  Por {file.uploadedBy}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    title="Visualizar"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alert(`Baixando arquivo ${file.name}`)}
                    className="p-1 rounded-lg text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50"
                    title="Baixar"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  {!isClientUser && (
                    <button
                      onClick={() => {
                        if (confirm(`Remover ${file.name}?`)) deleteFile(file.id);
                      }}
                      className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 truncate">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-center bg-gray-900 text-white flex flex-col items-center justify-center min-h-[220px]">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
                {getFileIcon(previewFile.extension, previewFile.category)}
              </div>
              <p className="text-sm font-bold">{previewFile.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                Tamanho: {previewFile.size} • Versão {previewFile.version}
              </p>
            </div>

            <div className="p-4 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Enviado em {previewFile.uploadedAt} por {previewFile.uploadedBy}
              </span>
              <button
                onClick={() => {
                  alert(`Baixando arquivo ${previewFile.name}`);
                  setPreviewFile(null);
                }}
                className="px-4 py-2 bg-[#FF6A00] text-white rounded-xl text-xs font-bold hover:bg-[#E65F00] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Arquivo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
