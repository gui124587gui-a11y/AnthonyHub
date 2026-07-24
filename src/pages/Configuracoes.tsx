import React, { useEffect, useState } from 'react';
import { Settings, User, Sun, Moon, Bell, Globe, Monitor, Keyboard, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translate } from '../lib/i18n';
import type { Locale } from '../lib/i18n';

export default function Configuracoes() {
  const {
    theme,
    toggleTheme,
    userProfile,
    updateUserProfile,
    appMetadata,
    updateAppMetadata,
    addHistoryItem,
    language,
    setLanguage,
    notificationSettings,
    toggleNotificationSetting,
    keyboardShortcuts,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState('account');
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [emailInput, setEmailInput] = useState(userProfile.email);
  const [copyrightInput, setCopyrightInput] = useState(appMetadata.copyrightYear);
  const [descriptionInput, setDescriptionInput] = useState(appMetadata.description);
  const [updateStatus, setUpdateStatus] = useState('idle');
  const [updateMessage, setUpdateMessage] = useState('');
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [updateReady, setUpdateReady] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);
  const [appVersion, setAppVersion] = useState('1.0.0');
  const [appBuild, setAppBuild] = useState<string | null>(null);
  const [isPackaged, setIsPackaged] = useState(false);

  useEffect(() => {
    setNameInput(userProfile.name);
    setEmailInput(userProfile.email);
    setCopyrightInput(appMetadata.copyrightYear);
    setDescriptionInput(appMetadata.description);

    const loadPrefs = async () => {
      if (typeof window !== 'undefined' && (window as any).electronAPI?.getUpdatePreferences) {
        const result = await (window as any).electronAPI.getUpdatePreferences();
        if (result?.ok && result?.prefs) {
          setAutoDownload(result.prefs.autoDownload ?? false);
        }
      }
    };

    loadPrefs();
    const loadAppVersion = async () => {
      if (typeof window !== 'undefined' && (window as any).electronAPI?.getAppVersion) {
        const res = await (window as any).electronAPI.getAppVersion();
        if (res) {
          setAppVersion(res.version || '1.0.0');
          setAppBuild(res.build || null);
          setIsPackaged(res.isPackaged ?? false);
        }
      }
    };

    loadAppVersion();

    if (typeof window !== 'undefined' && (window as any).electronAPI?.onUpdateMessage) {
      (window as any).electronAPI.onUpdateMessage((status: any) => {
        setUpdateStatus(status.status);

        switch (status.status) {
          case 'checking':
            setUpdateMessage('Verificando atualizações...');
            setDownloadProgress(null);
            setUpdateReady(false);
            break;
          case 'update-available':
            setUpdateMessage('Nova versão encontrada! Deseja baixar agora?');
            setDownloadProgress(null);
            setUpdateReady(false);
            break;
          case 'update-not-available':
            setUpdateMessage('Nenhuma atualização disponível.');
            setDownloadProgress(null);
            setUpdateReady(false);
            break;
          case 'download-started':
            setUpdateMessage('Download iniciado...');
            setDownloadProgress(0);
            setUpdateReady(false);
            break;
          case 'download-progress':
            setUpdateMessage(`Baixando atualização: ${Math.round(status.progress)}%`);
            setDownloadProgress(Math.round(status.progress));
            break;
          case 'update-downloaded':
            setUpdateMessage('Atualização baixada! Pronto para instalar e reiniciar.');
            setDownloadProgress(100);
            setUpdateReady(true);
            break;
          case 'error':
            setUpdateMessage(`Erro: ${status.error || 'Falha ao verificar atualização.'}`);
            setDownloadProgress(null);
            setUpdateReady(false);
            break;
          default:
            break;
        }
      });
    }
  }, []);

  const handleToggleAutoDownload = async () => {
    const newValue = !autoDownload;
    setAutoDownload(newValue);
    if (typeof window !== 'undefined' && (window as any).electronAPI?.setUpdatePreferences) {
      await (window as any).electronAPI.setUpdatePreferences({ autoDownload: newValue });
    }
  };

  const handleCheckForUpdates = async () => {
    if (typeof window !== 'undefined' && (window as any).electronAPI?.checkForUpdates) {
      setUpdateStatus('checking');
      setUpdateMessage('Verificando atualizações...');
      const res = await (window as any).electronAPI.checkForUpdates();
      if (!res?.ok) {
        setUpdateStatus('error');
        setUpdateMessage(`Erro ao verificar atualizações: ${res?.error ?? 'desconhecido'}`);
      }
    } else {
      setUpdateStatus('error');
      setUpdateMessage('API de atualização não disponível. Verifique se o app está rodando em Electron com preload ativado.');
    }
  };

  const handleDownloadUpdate = async () => {
    if (!isPackaged) {
      setUpdateStatus('error');
      setUpdateMessage('Auto-update só funciona em build empacotado. Rode a build para testar.');
      return;
    }

    if (typeof window !== 'undefined' && (window as any).electronAPI?.downloadUpdate) {
      setUpdateStatus('download-started');
      setUpdateMessage('Iniciando download...');
      const res = await (window as any).electronAPI.downloadUpdate();
      if (!res?.ok) {
        setUpdateStatus('error');
        setUpdateMessage(`Erro ao iniciar download: ${res?.error ?? 'desconhecido'}`);
      }
    } else {
      setUpdateStatus('error');
      setUpdateMessage('API de atualização não disponível. Verifique se o app está rodando em Electron com preload ativado.');
    }
  };

  const handleInstallUpdate = async () => {
    if (!isPackaged) {
      setUpdateStatus('error');
      setUpdateMessage('Auto-update só funciona em build empacotado. Rode a build para testar.');
      return;
    }

    if (typeof window !== 'undefined' && (window as any).electronAPI?.installUpdate) {
      const res = await (window as any).electronAPI.installUpdate();
      if (!res?.ok) {
        setUpdateStatus('error');
        setUpdateMessage(`Erro ao instalar atualização: ${res?.error ?? 'desconhecido'}`);
      }
    } else {
      setUpdateStatus('error');
      setUpdateMessage('API de atualização não disponível. Verifique se o app está rodando em Electron com preload ativado.');
    }
  };

  const handleClearStore = async () => {
    if (window.confirm('Tem certeza que quer limpar todos os dados? Isso resetará tudo!')) {
      if (typeof window !== 'undefined' && (window as any).electronAPI?.clearStoreData) {
        await (window as any).electronAPI.clearStoreData();
        window.location.reload();
      }
    }
  };

  const tabs = [
    { id: 'account', label: 'Conta', icon: User },
    { id: 'theme', label: 'Tema', icon: Monitor },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'language', label: 'Idioma', icon: Globe },
    { id: 'shortcuts', label: 'Atalhos', icon: Keyboard },
    { id: 'updates', label: 'Atualizações', icon: RefreshCw },
    { id: 'about', label: 'Sobre', icon: Info },
  ];

  return (
    <div className="p-8 overflow-y-auto h-[calc(100vh-80px)] fade-in">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-textPrimary mb-8 flex items-center gap-3">
          <Settings size={32} />
          {translate(language, 'settings.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-textSecondary hover:bg-cardHover hover:text-textPrimary'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{translate(language, `settings.tabs.${tab.id}` as any)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-8">
              {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-textPrimary mb-6">{translate(language, 'settings.profile.title')}</h2>
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-cardHover border border-primary/20">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                      <span className="text-3xl font-bold text-white">{userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}</span>
                    </div>
                  )}
                  <label className="absolute inset-x-0 bottom-0 mx-auto mb-1 flex cursor-pointer items-center justify-center rounded-full bg-black/60 px-3 py-1 text-xs text-white transition hover:bg-black/80">
                    Alterar Foto
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          updateUserProfile({ avatarUrl: url });
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-textPrimary">{userProfile.name || 'Sem nome'}</h3>
                  <p className="text-textSecondary">{userProfile.email || 'Sem e-mail'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">{translate(language, 'settings.profile.name')}</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass text-textPrimary focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">{translate(language, 'settings.profile.email')}</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass text-textPrimary focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  updateUserProfile({ name: nameInput, email: emailInput });
                  addHistoryItem({
                    type: 'note',
                    title: 'Perfil',
                    description: 'Atualizou perfil do usuário',
                  });
                }}
                className="mt-6 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl transition-all text-white font-medium"
              >
                {translate(language, 'settings.profile.save')}
              </button>
            </div>
          )}

              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-textPrimary mb-6">{translate(language, 'settings.theme.title')}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent hover:border-primary/30'
                      }`}
                    >
                      <div className="w-full h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl mb-3 flex items-center justify-center">
                        <Moon size={32} className="text-primary" />
                      </div>
                      <p className="font-medium text-textPrimary">{translate(language, 'settings.theme.dark')}</p>
                    </button>
                    <button
                      onClick={() => theme !== 'light' && toggleTheme()}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        theme === 'light'
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent hover:border-primary/30'
                      }`}
                    >
                      <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 flex items-center justify-center">
                        <Sun size={32} className="text-primary" />
                      </div>
                      <p className="font-medium text-textPrimary">{translate(language, 'settings.theme.light')}</p>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-cardHover">
                      <div>
                        <p className="font-medium text-textPrimary">Efeito Glassmorphism</p>
                        <p className="text-sm text-textSecondary">Fundo transparente com desfoque</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-cardHover">
                      <div>
                        <p className="font-medium text-textPrimary">Animações</p>
                        <p className="text-sm text-textSecondary">Transições suaves entre telas</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-cardHover mt-8">
                    <h3 className="text-lg font-semibold text-textPrimary mb-4">{translate(language, 'settings.dangerZone.title')}</h3>
                    <button
                      onClick={handleClearStore}
                      className="w-full py-3 px-6 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} />
                      {translate(language, 'settings.dangerZone.clear')}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-textPrimary mb-6">{translate(language, 'settings.notifications.title')}</h2>
                  <div className="space-y-4">
                    {(
                      [
                        { key: 'system', title: 'Notificações do Sistema', desc: 'Alertas sobre atualizações e manutenção' },
                        { key: 'agenda', title: 'Lembretes de Agenda', desc: 'Notificações sobre eventos e tarefas agendadas' },
                        { key: 'backup', title: 'Backup Concluído', desc: 'Aviso quando backups forem finalizados' },
                        { key: 'sound', title: 'Notificações Sonoras', desc: 'Tocar som ao receber notificações' },
                      ] as const
                    ).map((item) => {
                      const enabled = notificationSettings[item.key];
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => toggleNotificationSetting(item.key)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${enabled ? 'bg-primary/15 border border-primary' : 'bg-cardHover border border-transparent hover:border-primary/30'}`}
                        >
                          <div>
                            <p className="font-medium text-textPrimary">{item.title}</p>
                            <p className="text-sm text-textSecondary">{item.desc}</p>
                          </div>
                          <span className={`inline-flex h-8 w-16 items-center rounded-full p-1 transition-colors ${enabled ? 'bg-primary' : 'bg-white/10'}`}>
                            <span className={`h-6 w-6 rounded-full bg-white transition-transform ${enabled ? 'translate-x-8' : 'translate-x-0'}`} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-textPrimary mb-6">{translate(language, 'settings.language.title')}</h2>
                  <div className="space-y-3">
                    {([
                      { value: 'pt-BR' as Locale, label: 'Português (Brasil)' },
                      { value: 'en-US' as Locale, label: 'English (US)' },
                      { value: 'es-ES' as Locale, label: 'Español' },
                      { value: 'fr-FR' as Locale, label: 'Français' },
                      { value: 'de-DE' as Locale, label: 'Deutsch' },
                    ] as const).map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => setLanguage(lang.value)}
                        className={`w-full text-left p-4 rounded-xl transition-all border ${
                          language === lang.value
                            ? 'border-primary bg-primary/10 text-textPrimary'
                            : 'border-transparent bg-cardHover text-textSecondary hover:bg-primary/10 hover:text-textPrimary'
                        }`}
                      >
                        <p className="font-medium">{lang.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'shortcuts' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-textPrimary mb-6">{translate(language, 'settings.shortcuts.title')}</h2>
                  <div className="space-y-4">
                    {keyboardShortcuts.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-cardHover">
                        <div>
                          <p className="font-medium text-textPrimary">{item.action}</p>
                          <p className="text-sm text-textSecondary">{item.description}</p>
                        </div>
                        <kbd className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-mono text-sm">{item.shortcut}</kbd>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'updates' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-textPrimary mb-6">{translate(language, 'settings.updates.title')}</h2>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 p-6 rounded-3xl bg-cardHover">
                      <div className="flex flex-col gap-2">
                        <p className="font-medium text-textPrimary">Atualizações via GitHub Releases</p>
                        <p className="text-sm text-textSecondary">
                          O app verifica e baixa atualizações quando disponível. Você pode controlar se o download deve ser automático.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all"
                          onClick={handleCheckForUpdates}
                        >
                          Verificar Atualizações
                        </button>
                        <label className="flex items-center gap-3 text-textSecondary">
                          <input
                            type="checkbox"
                            checked={autoDownload}
                            onChange={handleToggleAutoDownload}
                            className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                          />
                          {translate(language, 'settings.updates.autoDownload')}
                        </label>
                      </div>

                      <div className="rounded-2xl border border-primary/10 bg-slate-950/40 p-4">
                        <p className="text-sm text-textSecondary">Status da atualização</p>
                        <p className="mt-2 text-textPrimary font-medium">{updateMessage || translate(language, 'settings.updates.noUpdate')}</p>
                        {downloadProgress !== null && (
                          <div className="mt-3 h-3 rounded-full bg-primary/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${downloadProgress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {updateStatus === 'update-available' && !autoDownload && (
                        <div className="flex flex-wrap gap-3">
                          <button
                            className="px-4 py-2 rounded-xl bg-secondary text-white hover:bg-secondary/90 transition-all"
                            onClick={handleDownloadUpdate}
                          >
                            Baixar agora
                          </button>
                        </div>
                      )}

                      {updateReady && (
                        <div className="flex flex-wrap gap-3">
                          <button
                            className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-500/90 transition-all"
                            onClick={handleInstallUpdate}
                          >
                            Instalar e Reiniciar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl glass space-y-3">
                      <p className="text-textSecondary text-sm">
                        O auto-update oficial usa GitHub Releases. Configure seu repositório e defina o token
                        em `GH_TOKEN` para publicar novas versões automaticamente.
                      </p>
                      <button
                        className="px-4 py-2 rounded-xl glass text-textPrimary border border-primary/20 hover:bg-cardHover transition-all"
                        onClick={() => {
                          const url = 'https://update-js.vercel.app/';
                          if (typeof window !== 'undefined' && (window as any).electronAPI?.openExternal) {
                            (window as any).electronAPI.openExternal(url);
                          } else {
                            window.open(url, '_blank');
                          }
                        }}
                      >
                        Abrir site de updates
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6 text-center">
                  <div className="p-8">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl font-bold text-white">GH</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                      AnthonyHub
                    </h2>
                    <p className="text-textSecondary mb-6">Versão {appVersion}{appBuild ? ` (build ${appBuild})` : ''}</p>
                    <p className="text-textSecondary mb-8 max-w-md mx-auto">
                      O centro de controle definitivo para produtividade, automação e monitoramento de hardware.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <a href="#" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 transition-all text-white font-medium">
                        Site Oficial
                      </a>
                      <a href="#" className="px-6 py-3 rounded-xl glass hover:bg-cardHover transition-all text-textPrimary font-medium">
                        Documentação
                      </a>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-primary/10">
                    <p className="text-sm text-textSecondary">
                      © {appMetadata.copyrightYear} AnthonyHub. Todos os direitos reservados.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
