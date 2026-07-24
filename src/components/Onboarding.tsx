import { useEffect, useState } from 'react';
import { ArrowRight, Check, ListFilter, Search, Zap, FileText, Calendar, Bell, Settings } from 'lucide-react';

const steps = [
  {
    icon: Zap,
    title: 'Bem-vindo ao AnthonyHub',
    text: 'Vamos te mostrar como usar cada área do hub para melhorar sua produtividade.',
    page: 'home',
  },
  {
    icon: ListFilter,
    title: 'Processos pesados',
    text: 'Aqui você vê quais processos estão consumindo mais CPU e memória. Finalize apenas os que não forem essenciais.',
    page: 'processos',
  },
  {
    icon: FileText,
    title: 'Notas e informações',
    text: 'Use “Notas” para guardar lembretes rápidos e ideias importantes.',
    page: 'notas',
  },
  {
    icon: Calendar,
    title: 'Agenda',
    text: 'A seção “Agenda” te ajuda a lembrar compromissos e tarefas do dia.',
    page: 'agenda',
  },
  {
    icon: Search,
    title: 'Pesquisa rápida',
    text: 'A busca te leva direto ao que você precisa no hub, sem perder tempo.',
    page: 'pesquisa',
  },
  {
    icon: Bell,
    title: 'Notificações',
    text: 'A aba “Notificações” mostra seus avisos e lembretes mais importantes.',
    page: 'notificacoes',
  },
  {
    icon: Settings,
    title: 'Configurações',
    text: 'Em “Configurações” você ajusta tema, idioma, notificações e atalhos.',
    page: 'configuracoes',
  },
  {
    icon: Check,
    title: 'Pronto para começar',
    text: 'Agora você já sabe onde encontrar as principais áreas do AnthonyHub. Use o menu para navegar quando quiser.',
    page: 'home',
  },
];

export default function Onboarding({ onFinish, setActivePage }: { onFinish: () => void; setActivePage: (page: string) => void; }) {
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
      <h2 className="text-2xl font-bold text-white">{item.title}</h2>
      <p className="mt-3 min-h-14 text-textSecondary">{item.text}</p>
      <div className="mt-8 flex justify-between gap-3">
        <button onClick={onFinish} className="rounded-xl px-4 py-3 text-sm text-textSecondary hover:text-white">Pular tutorial</button>
        <button onClick={() => last ? onFinish() : goToStep(step + 1)} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-secondary">
          {last ? <><Check size={18} /> Começar</> : <>Próximo <ArrowRight size={18} /></>}
        </button>
      </div>
    </section>
  </div>;
}
