import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { translate } from '@/lib/i18n';

export default function Notificacoes() {
  const agenda = useAppStore((s) => s.agenda);
  const language = useAppStore((s) => s.language);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{translate(language, 'notifications.title')}</h2>
      <p className="text-sm text-textSecondary mb-4">{translate(language, 'notifications.description')}</p>

      <div className="space-y-3">
        {agenda.length === 0 && <div className="text-textSecondary">{translate(language, 'notifications.empty')}</div>}
        {agenda.map((a) => (
          <div key={a.id} className="p-3 rounded-lg bg-card/40 border border-primary/6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-sm text-textSecondary">{a.date} {a.time}</div>
              </div>
              <div className="text-sm text-textSecondary">{a.color}</div>
            </div>
            {a.description && <div className="mt-2 text-sm text-textSecondary">{a.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
