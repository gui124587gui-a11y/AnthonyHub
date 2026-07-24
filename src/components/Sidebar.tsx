import React from 'react';
import {
  Home,
  Layers,
  Zap,
  BookOpen,
  Star,
  Search,
  HardDrive,
  ListFilter,
  FileText,
  Calendar,
  Link,
  BarChart3,
  Music,
  Settings,
  Menu,
  ChevronLeft,
  History,
  Sparkles,
  Trash2,
  Bot,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { translate } from '@/lib/i18n';

const navItems = [
  { id: 'home', icon: Home, label: 'sidebar.home' },
  { id: 'workspaces', icon: Layers, label: 'sidebar.workspaces' },
  { id: 'atalhos', icon: Zap, label: 'sidebar.shortcuts' },
  { id: 'biblioteca', icon: BookOpen, label: 'sidebar.library' },
  { id: 'favoritos', icon: Star, label: 'sidebar.favorites' },
  { id: 'pesquisa', icon: Search, label: 'sidebar.search' },
  { id: 'backup', icon: HardDrive, label: 'sidebar.backup' },
  { id: 'processos', icon: ListFilter, label: 'sidebar.processes' },
  { id: 'chatbot', icon: Bot, label: 'sidebar.chatbot' },
  { id: 'notas', icon: FileText, label: 'sidebar.notes' },
  { id: 'agenda', icon: Calendar, label: 'sidebar.agenda' },
  { id: 'links', icon: Link, label: 'sidebar.links' },
  { id: 'musica', icon: Music, label: 'sidebar.music' },
  { id: 'installer', icon: Sparkles, label: 'sidebar.installer' },
  { id: 'uninstaller', icon: Trash2, label: 'sidebar.uninstaller' },
  { id: 'historico', icon: History, label: 'sidebar.history' },
  { id: 'configuracoes', icon: Settings, label: 'sidebar.settings' },
];

export default function Sidebar() {
  const { activePage, setActivePage, sidebarCollapsed, toggleSidebar, language } = useAppStore();

  return (
    <div className={cn(
      "h-screen glass border-r border-primary/10 flex flex-col transition-all duration-300",
      sidebarCollapsed ? "w-20" : "w-72"
    )}>
      {/* Logo and Hamburger */}
      <div className="p-4 border-b border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AnthonyHub
              </h1>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-cardHover transition-colors"
        >
          {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
              activePage === item.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-textSecondary hover:bg-cardHover hover:text-textPrimary"
            )}
            title={sidebarCollapsed ? translate(language, item.label) : undefined}
          >
            <item.icon size={20} />
            {!sidebarCollapsed && <span className="font-medium">{translate(language, item.label)}</span>}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-primary/10">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-cardHover transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-textPrimary">Anthony</p>
              <p className="text-xs text-textSecondary">Bem-vindo de volta!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
