import { useEffect, useState } from 'react';
import { ArrowRight, Check, ListFilter, Search, Zap, FileText, Calendar, Bell, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { translate } from '@/lib/i18n';

type StepData = {
  icon: any;
  title: string;
  text: string;
  page: string;
};

const steps: StepData[] = [
  {
    icon: Zap,
    title: 'onboarding.welcome.title',
    text: 'onboarding.welcome.text',
    page: 'home',
  },
  {
    icon: ListFilter,
    title: 'onboarding.processes.title',
    text: 'onboarding.processes.text',
    page: 'processos',
  },
  {
    icon: FileText,
    title: 'onboarding.notes.title',
    text: 'onboarding.notes.text',
    page: 'notas',
  },
  {
    icon: Calendar,
    title: 'onboarding.agenda.title',
    text: 'onboarding.agenda.text',
    page: 'agenda',
  },
  {
    icon: Search,
    title: 'onboarding.search.title',
    text: 'onboarding.search.text',
    page: 'pesquisa',
  },
  {
    icon: Bell,
    title: 'onboarding.notifications.title',
    text: 'onboarding.notifications.text',
    page: 'notificacoes',
  },
  {
    icon: Settings,
    title: 'onboarding.settings.title',
    text: 'onboarding.settings.text',
    page: 'configuracoes',
  },
  {
    icon: Check,
    title: 'onboarding.done.title',
    text: 'onboarding.done.text',
    page: 'home',
  },
];

export default function Onboarding({ onFinish, setActivePage }: { onFinish: () => void; setActivePage: (page: string) => void; }) {
  const { language } = useAppStore();
  const [step, setStep] = useState(0);
  const item = steps[step];
  const Icon = item.icon;
  const last = step === steps.length - 1;

  useEffect(() => {
    if (item.page) {
      setActivePage(item.page);
    }
  }, [item.page, setActivePage]);

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5">
    <section className="w-full max-w-lg rounded-3xl border border-primary bg-card p-8 shadow-[0_0_45px_rgba(255,0,0,.35)]">
      <div className="mb-8 flex gap-2">{steps.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded ${index <= step ? 'bg-primary' : 'bg-white/15'}`} />)}</div>
      <div className="mb-6 inline-flex rounded-2xl bg-primary/15 p-4 text-primary"><Icon size={34} /></div>
      <h2 className="text-2xl font-bold text-white">{translate(language, item.title)}</h2>
      <p className="mt-3 min-h-14 text-textSecondary">{translate(language, item.text)}</p>
      <div className="mt-8 flex justify-between gap-3">
        <button onClick={onFinish} className="rounded-xl px-4 py-3 text-sm text-textSecondary hover:text-white">{translate(language, 'onboarding.button.skip')}</button>
        <button onClick={() => last ? onFinish() : goToStep(step + 1)} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-secondary">
          {last ? <><Check size={18} /> {translate(language, 'onboarding.button.start')}</> : <>{translate(language, 'onboarding.button.next')} <ArrowRight size={18} /></>}
        </button>
      </div>
    </section>
  </div>;
}
