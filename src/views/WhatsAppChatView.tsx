import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WhatsAppMessage, WhatsAppChannel, User } from '../types';
import { playMessagePopSound, playVizioBrandChime } from '../utils/audioChime';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  Users,
  ShieldCheck,
  Phone,
  Video,
  Play,
  Pause,
  FileText,
  Image as ImageIcon,
  Lock,
  Plus,
  X,
  Volume2,
  Download,
  UserPlus,
  Sparkles,
} from 'lucide-react';

export const WhatsAppChatView: React.FC = () => {
  const { currentUser, availableUsers, addToast } = useApp();

  // Channels state
  const [channels, setChannels] = useState<WhatsAppChannel[]>(() => {
    try {
      const saved = localStorage.getItem('vizio_whatsapp_channels');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default fallback
    return [
      {
        id: 'ch_general',
        name: 'Vizio Mídia • Geral & Equipe',
        type: 'group',
        description: 'Canal oficial de comunicação de toda a agência e equipe.',
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
        members: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'],
        lastMessage: 'Vinicius Maurelli: Pessoal, alinhamento geral amanhã às 10h.',
        lastMessageTime: '10:45',
        unreadCount: 0,
      },
      {
        id: 'ch_ceos',
        name: 'Diretoria & CEOs (ADM)',
        type: 'group',
        description: 'Canal restrito dos 3 Administradores: Vinicius Maurelli, Fabrizio Rangel e Diego.',
        avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
        members: ['u1', 'u2', 'u3'],
        onlyAdmins: true,
        lastMessage: 'Fabrizio Rangel: Fechamos com a Construtora Horizonte!',
        lastMessageTime: '09:30',
        unreadCount: 1,
      },
      {
        id: 'ch_commercial',
        name: 'Comercial & Vendas',
        type: 'group',
        description: 'Pipeline de vendas, reuniões de diagnóstico e propostas.',
        avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&auto=format&fit=crop&q=80',
        members: ['u1', 'u2', 'u3', 'u4'],
        lastMessage: 'Diego: Lead da Solar Tech respondeu.',
        lastMessageTime: '09:12',
        unreadCount: 0,
      },
      {
        id: 'ch_marketing',
        name: 'Marketing & Performance Ads',
        type: 'group',
        description: 'Otimizações de Ads, métricas de ROAS e novos criativos.',
        avatar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&auto=format&fit=crop&q=80',
        members: ['u1', 'u5', 'u6', 'u7'],
        lastMessage: 'Rafael: CPA da Farma Mais caiu 22%.',
        lastMessageTime: 'Ontem',
        unreadCount: 0,
      },
      {
        id: 'ch_dm_mariana',
        name: 'Mariana Costa (Operações)',
        type: 'dm',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        members: ['u1', 'u4'],
        lastMessage: 'Planilha de horas atualizada.',
        lastMessageTime: 'Ontem',
        unreadCount: 0,
      },
    ];
  });

  // Messages state
  const [messages, setMessages] = useState<WhatsAppMessage[]>(() => {
    try {
      const saved = localStorage.getItem('vizio_whatsapp_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'wm_1',
        channelId: 'ch_ceos',
        senderId: 'u1',
        senderName: 'Vinicius Maurelli',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        senderRole: 'admin',
        text: 'Fala Fabrizio e Diego! A nova aba de cálculo financeiro e DRE da Vizio já está rodando perfeitamente.',
        timestamp: '09:15',
        status: 'read',
      },
      {
        id: 'wm_2',
        channelId: 'ch_ceos',
        senderId: 'u3',
        senderName: 'Diego',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        senderRole: 'admin',
        text: 'Excelente Vinicius! Consegui analisar a margem por cliente na hora. A saúde operacional tá muito boa.',
        timestamp: '09:22',
        status: 'read',
      },
      {
        id: 'wm_3',
        channelId: 'ch_ceos',
        senderId: 'u2',
        senderName: 'Fabrizio Rangel',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        senderRole: 'admin',
        text: 'Fechamos a proposta com a Construtora Horizonte! Entrou mais R$ 18.000 de MRR para a agência.',
        timestamp: '09:30',
        status: 'read',
      },
      {
        id: 'wm_4',
        channelId: 'ch_general',
        senderId: 'u1',
        senderName: 'Vinicius Maurelli',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        senderRole: 'admin',
        text: 'Bom dia time Vizio! Parabéns pelas entregas de ontem. Novos briefings já liberados nos cards.',
        timestamp: '08:45',
        status: 'read',
      },
      {
        id: 'wm_5',
        channelId: 'ch_general',
        senderId: 'u5',
        senderName: 'Lucas Almeida',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        senderRole: 'employee',
        text: 'Bom dia Vini! Criativos da campanha de Café & Aroma finalizados e enviados para aprovação do cliente.',
        timestamp: '09:05',
        status: 'read',
      },
    ];
  });

  const [activeChannelId, setActiveChannelId] = useState<string>('ch_ceos');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [emojiDrawerOpen, setEmojiDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startDirectChatWith = (user: User) => {
    // Check if channel already exists
    const existing = channels.find(
      (c) => c.type === 'dm' && c.members.includes(user.id) && c.members.includes(currentUser.id)
    );
    if (existing) {
      setActiveChannelId(existing.id);
      setNewChatModalOpen(false);
      return;
    }

    const newChannel: WhatsAppChannel = {
      id: 'ch_dm_' + Date.now(),
      name: user.name,
      type: 'dm',
      avatar: user.avatar,
      members: [currentUser.id, user.id],
      description: `Conversa direta com ${user.name} (${user.roleTitle})`,
      lastMessage: 'Conversa iniciada',
      lastMessageTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
    };

    setChannels((prev) => [newChannel, ...prev]);
    setActiveChannelId(newChannel.id);
    setNewChatModalOpen(false);
    addToast(`Conversa iniciada com ${user.name}!`, 'success');
  };

  const sendAttachment = (type: 'image' | 'file', title: string, url: string, size?: string) => {
    const newMsg: WhatsAppMessage = {
      id: 'wm_' + Date.now(),
      channelId: activeChannel.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      text: title,
      type,
      mediaUrl: url,
      fileName: title,
      fileSize: size || '1.8 MB',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };
    setMessages((prev) => [...prev, newMsg]);
    playMessagePopSound();
    setAttachmentModalOpen(false);
    addToast(`Arquivo "${title}" enviado!`, 'success');

    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeChannel.id
          ? {
              ...c,
              lastMessage: `${currentUser.name.split(' ')[0]}: [${type === 'image' ? 'Foto' : 'Arquivo'}] ${title}`,
              lastMessageTime: newMsg.timestamp,
            }
          : c
      )
    );
  };

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('vizio_whatsapp_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('vizio_whatsapp_messages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId]);

  // Active Channel Info
  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  // Check if channel is restricted to Admins
  const isChannelRestricted = activeChannel.onlyAdmins && currentUser.role !== 'admin';

  // Filter channels based on user role and search
  const visibleChannels = channels.filter((ch) => {
    // If channel is admin-only and user is not admin, hide it
    if (ch.onlyAdmins && currentUser.role !== 'admin') return false;
    if (!searchQuery) return true;
    return ch.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Current channel messages
  const activeMessages = messages.filter((m) => m.channelId === activeChannel.id);

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: WhatsAppMessage = {
      id: 'wm_' + Date.now(),
      channelId: activeChannel.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    playMessagePopSound();

    // Update last message in channel
    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeChannel.id
          ? {
              ...c,
              lastMessage: `${currentUser.name.split(' ')[0]}: ${newMsg.text}`,
              lastMessageTime: newMsg.timestamp,
            }
          : c
      )
    );
  };

  // Simulate audio voice note send
  const handleSendVoiceNote = () => {
    setRecordingAudio(true);
    setTimeout(() => {
      setRecordingAudio(false);
      const newMsg: WhatsAppMessage = {
        id: 'wm_' + Date.now(),
        channelId: activeChannel.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.role,
        text: 'Mensagem de voz gravada',
        type: 'audio',
        audioDuration: '0:14',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      setMessages((prev) => [...prev, newMsg]);
      playMessagePopSound();
      addToast('Áudio enviado com sucesso!', 'success');
    }, 1500);
  };

  return (
    <div
      id="whatsapp-chat-view"
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[580px]"
    >
      {/* LEFT SIDEBAR: CHANNELS & CONVERSATIONS */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-[#F0F2F5] flex flex-col shrink-0">
        {/* Profile & Header */}
        <div className="h-16 px-4 bg-[#F0F2F5] border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-white shadow-2xs"
            />
            <div>
              <span className="text-xs font-bold text-gray-900 block truncate max-w-[150px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                {currentUser.role === 'admin' ? (
                  <span className="text-[#FF5B00] font-bold">ADM / CEO</span>
                ) : (
                  currentUser.roleTitle
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-gray-600">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Online
            </span>
            <button
              onClick={() => setNewChatModalOpen(true)}
              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-700 hover:text-[#FF5B00] transition-colors"
              title="Nova Conversa Direta"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 bg-white border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar conversa ou canal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F0F2F5] border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5B00]"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white">
          {visibleChannels.map((channel) => {
            const isActive = channel.id === activeChannel.id;
            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                className={`w-full p-3 flex items-center gap-3 text-left transition-colors relative ${
                  isActive ? 'bg-[#F0F2F5]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  {channel.onlyAdmins && (
                    <span
                      className="absolute -top-1 -right-1 p-1 rounded-full bg-gray-900 text-[#FF5B00] border border-white"
                      title="Canal Restrito ADM"
                    >
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs text-gray-900 truncate flex items-center gap-1.5">
                      {channel.name}
                      {channel.onlyAdmins && (
                        <span className="px-1.5 py-0.2 rounded bg-orange-100 text-[#FF5B00] text-[9px] font-black">
                          ADM
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium shrink-0">
                      {channel.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">
                    {channel.lastMessage || channel.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#EFEAE2] relative overflow-hidden">
        {/* Subtle WhatsApp wallpaper doodle background */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Chat Header */}
        <div className="h-16 px-4 bg-[#F0F2F5] border-b border-gray-200 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <img
              src={activeChannel.avatar}
              alt={activeChannel.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                {activeChannel.name}
                {activeChannel.onlyAdmins && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-900 text-[#FF5B00] text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Exclusivo ADM
                  </span>
                )}
              </h3>
              <span className="text-[11px] text-gray-500 truncate block max-w-sm">
                {activeChannel.description || 'Canal ativo da equipe Vizio Mídia'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <button
              onClick={() => addToast('Recurso de chamada de áudio integrado ao Google Meet.', 'info')}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
              title="Chamada de Áudio"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToast('Iniciando sala de videoconferência da Vizio...', 'info')}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
              title="Chamada de Vídeo"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
          {isChannelRestricted ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/70 backdrop-blur-xs rounded-2xl max-w-md mx-auto my-auto border border-gray-200">
              <Lock className="w-12 h-12 text-[#FF5B00] mb-3" />
              <h4 className="font-bold text-gray-900 text-base mb-1">Canal Restrito da Diretoria</h4>
              <p className="text-xs text-gray-600">
                Este grupo é reservado exclusivamente para os 3 Administradores: Vinicius Maurelli, Fabrizio Rangel e Diego.
              </p>
            </div>
          ) : (
            <>
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}
                  >
                    <div
                      className={`relative px-3.5 py-2 rounded-2xl max-w-[85%] sm:max-w-[70%] shadow-2xs text-xs ${
                        isMe
                          ? 'bg-[#D9FDD3] text-gray-900 rounded-tr-none'
                          : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                      }`}
                    >
                      {/* Sender Name if group and not me */}
                      {!isMe && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-bold text-[11px] text-[#FF5B00]">
                            {msg.senderName}
                          </span>
                          {msg.senderRole === 'admin' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-gray-900 text-white">
                              ADM
                            </span>
                          )}
                        </div>
                      )}

                      {/* Image message format */}
                      {msg.type === 'image' && msg.mediaUrl ? (
                        <div className="space-y-1.5 py-1">
                          <img
                            src={msg.mediaUrl}
                            alt="Anexo"
                            className="rounded-xl max-h-56 object-cover w-full border border-gray-200"
                          />
                          {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                        </div>
                      ) : msg.type === 'file' ? (
                        <div className="flex items-center gap-3 p-2.5 bg-black/5 rounded-xl border border-black/5 my-1">
                          <div className="p-2.5 rounded-lg bg-orange-100 text-[#FF5B00]">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate text-gray-900">{msg.fileName || msg.text}</p>
                            <span className="text-[10px] text-gray-500">{msg.fileSize || '1.8 MB'} • Documento</span>
                          </div>
                          <button
                            onClick={() => addToast(`Download do arquivo "${msg.fileName || msg.text}" iniciado.`, 'info')}
                            className="p-1.5 rounded-lg hover:bg-black/10 text-gray-700 transition-colors"
                            title="Baixar arquivo"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ) : msg.type === 'audio' ? (
                        <div className="flex items-center gap-3 py-1 pr-4 min-w-[200px]">
                          <button
                            onClick={() => {
                              if (playingAudioId === msg.id) {
                                setPlayingAudioId(null);
                              } else {
                                setPlayingAudioId(msg.id);
                                playVizioBrandChime(0.15);
                                setTimeout(() => setPlayingAudioId(null), 3000);
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-[#FF5B00] text-white flex items-center justify-center shrink-0 hover:bg-[#E65F00] transition-colors"
                          >
                            {playingAudioId === msg.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1 space-y-1">
                            <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-[#FF5B00] ${
                                  playingAudioId === msg.id ? 'w-full transition-all duration-3000' : 'w-1/3'
                                }`}
                              />
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {msg.audioDuration || '0:14'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Timestamp & read receipts */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-500">
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Floating Emoji Drawer */}
        {emojiDrawerOpen && (
          <div className="absolute bottom-16 left-4 z-30 bg-white p-2.5 rounded-2xl shadow-xl border border-gray-200 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-100">
            {['🚀', '🔥', '👍', '👏', '💼', '✅', '📊', '☕', '💡', '🎯', '⭐', '🙌', '💪', '🤝'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  setEmojiDrawerOpen(false);
                }}
                className="p-1 text-base hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Message Composer Footer */}
        {!isChannelRestricted && (
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#F0F2F5] border-t border-gray-200 flex items-center gap-2 relative z-10"
          >
            <button
              type="button"
              onClick={() => setEmojiDrawerOpen(!emojiDrawerOpen)}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
              title="Inserir Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setAttachmentModalOpen(true)}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
              title="Anexar Arquivo ou Foto"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Digite uma mensagem..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2 bg-white rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF5B00] border border-gray-200 shadow-2xs"
            />

            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2.5 rounded-full bg-[#FF5B00] hover:bg-[#E65F00] text-white shadow-xs transition-colors shrink-0"
                title="Enviar Mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendVoiceNote}
                className={`p-2.5 rounded-full text-white shadow-xs transition-colors shrink-0 ${
                  recordingAudio ? 'bg-red-600 animate-pulse' : 'bg-[#FF5B00] hover:bg-[#E65F00]'
                }`}
                title="Gravar mensagem de áudio"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </form>
        )}
      </div>

      {/* MODAL 1: START NEW CHAT WITH ANY TEAM MEMBER */}
      {newChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#FF5B00]" />
                  Iniciar Nova Conversa
                </h3>
                <p className="text-xs text-gray-500">Selecione um membro da equipe ou gestor</p>
              </div>
              <button
                onClick={() => setNewChatModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableUsers
                .filter((u) => u.id !== currentUser.id && u.approved !== false)
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => startDirectChatWith(user)}
                    className="w-full p-3 rounded-xl hover:bg-gray-50 border border-gray-100 flex items-center justify-between transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <div className="font-bold text-xs text-gray-900 group-hover:text-[#FF5B00] flex items-center gap-1.5">
                          {user.name}
                          {user.role === 'admin' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#FF5B00]/10 text-[#FF5B00]">
                              ADM
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500">{user.roleTitle}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#FF5B00] opacity-0 group-hover:opacity-100 transition-opacity">
                      Conversar →
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SEND ATTACHMENT */}
      {attachmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-gray-900">Anexar Arquivo ou Foto</h3>
              <button
                onClick={() => setAttachmentModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <button
                onClick={() =>
                  sendAttachment(
                    'image',
                    'Criativo Final - Lâmina Carrossel 01',
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                    '2.4 MB'
                  )
                }
                className="p-4 rounded-xl border border-gray-200 hover:border-[#FF5B00] bg-gray-50 hover:bg-orange-50/50 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-xs text-gray-900 block">Enviar Criativo / Foto</span>
                  <span className="text-[10px] text-gray-500">Formato PNG / JPG</span>
                </div>
              </button>

              <button
                onClick={() =>
                  sendAttachment(
                    'file',
                    'Proposta Comercial & Briefing de Mídia.pdf',
                    '#',
                    '1.9 MB'
                  )
                }
                className="p-4 rounded-xl border border-gray-200 hover:border-[#FF5B00] bg-gray-50 hover:bg-orange-50/50 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="p-3 rounded-full bg-orange-100 text-[#FF5B00] group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-xs text-gray-900 block">Enviar Proposta / PDF</span>
                  <span className="text-[10px] text-gray-500">Documento Corporativo</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
