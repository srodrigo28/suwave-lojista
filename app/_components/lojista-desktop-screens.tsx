import Link from "next/link";
import {
  BadgePercent,
  Bell,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  CreditCard,
  FileText,
  Headphones,
  Home,
  Landmark,
  Lock,
  LogOut,
  MapPin,
  MessageSquare,
  Network,
  Package,
  Pencil,
  Play,
  RefreshCw,
  Star,
  Store,
  Truck,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

type DesktopShellProps = {
  active: "inicio" | "perfil";
  children: React.ReactNode;
};

const navGroups: NavItem[][] = [
  [
    { href: "/dashboard", icon: Home, label: "Início" },
    { href: "/orders", icon: ClipboardList, label: "Pedidos" },
    { href: "/store/profile", icon: UserRound, label: "Perfil" },
    { href: "/products", icon: Package, label: "Catálogo" },
    { href: "/settings/team", icon: UsersRound, label: "Clientes" },
    { href: "/promotions", icon: CalendarDays, label: "Eventos e Notícias" },
    { href: "/finance", icon: WalletCards, label: "Financeiro" },
  ],
  [
    { href: "/orders/current", icon: MessageSquare, label: "Mensagens" },
    { href: "/promotions/cashback", icon: Network, label: "Afiliado" },
    { href: "/promotions", icon: BadgePercent, label: "Cupons de Desconto" },
    { href: "/store/delivery", icon: Truck, label: "Envios" },
    { href: "/reviews", icon: Star, label: "Avaliações" },
  ],
  [
    { href: "/settings", icon: Play, label: "Como usar a Suwave" },
    { href: "/settings/integrations", icon: FileText, label: "Termos e Privacidade" },
    { href: "/forgot-password", icon: Headphones, label: "Fale com a Suwave" },
  ],
  [{ href: "/login", icon: LogOut, label: "Sair" }],
];

function SuwaveLogo() {
  return (
    <Link aria-label="Suwave" className="inline-flex text-inherit no-underline" href="/">
      <span className="text-[48px] font-black leading-none tracking-normal text-[#050505]">
        SU<span className="text-[#ffb000]">W</span>AVE
      </span>
    </Link>
  );
}

function Sidebar({ active }: { active: DesktopShellProps["active"] }) {
  return (
    <aside className="sticky top-0 h-screen w-[263px] shrink-0 border-r border-[#eeeeee] bg-white px-0 py-[34px]">
      <div className="px-[28px]">
        <SuwaveLogo />
      </div>

      <nav className="mt-[43px] grid gap-[24px] px-[4px]">
        {navGroups.map((group, groupIndex) => (
          <div
            className={`grid gap-[8px] ${groupIndex ? "border-t border-[#eeeeee] pt-[18px]" : ""}`}
            key={group.map((item) => item.label).join("-")}
          >
            {group.map(({ href, icon: Icon, label }) => {
              const isActive = active === "inicio" ? label === "Início" : label === "Perfil";

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex h-[46px] items-center gap-[24px] rounded-[8px] px-[26px] text-[16px] font-black no-underline transition ${
                    isActive ? "bg-[#fff4da] text-[#050505]" : "text-[#111111] hover:bg-[#fafafa]"
                  }`}
                  href={href}
                  key={label}
                >
                  {isActive ? <span className="absolute left-0 top-2 h-[30px] w-[2px] bg-[#ffb000]" /> : null}
                  <Icon
                    aria-hidden="true"
                    className={isActive ? "h-[22px] w-[22px] text-[#ffb000]" : "h-[22px] w-[22px] text-[#050505]"}
                    strokeWidth={2.15}
                  />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="relative flex h-[100px] shrink-0 items-center justify-center border-b border-[#eeeeee] bg-white">
      <button
        aria-label="Loja ativada"
        className="flex h-[50px] items-center gap-[11px] rounded-[9px] border border-[#e2e2e2] bg-white px-[16px] text-[17px] font-black text-[#111111]"
        type="button"
      >
        <span className="relative h-[27px] w-[48px] rounded-full bg-[#e5e5e5]">
          <span className="absolute left-[3px] top-[3px] h-[21px] w-[21px] rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,.16)]" />
        </span>
        Loja Ativada
      </button>

      <Link
        aria-label="Notificações"
        className="absolute right-[31px] top-[34px] grid h-[42px] w-[42px] place-items-center text-[#050505] no-underline"
        href="/orders"
      >
        <Bell aria-hidden="true" className="h-[29px] w-[29px]" strokeWidth={2.1} />
        <span className="absolute right-[1px] top-[-2px] grid h-[23px] min-w-[23px] place-items-center rounded-full bg-[#ff2b2b] px-[6px] text-[12px] font-black leading-none text-white">
          3
        </span>
      </Link>
    </header>
  );
}

function LojistaDesktopShell({ active, children }: DesktopShellProps) {
  return (
    <main className="min-h-screen overflow-x-auto bg-white text-[#050505]">
      <div className="flex min-h-screen min-w-[1280px]">
        <Sidebar active={active} />
        <section className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          {children}
        </section>
      </div>
    </main>
  );
}

const onboardingSteps = [
  {
    description: "Seu contrato foi assinado com sucesso.",
    title: "Contrato assinado",
  },
  {
    description: "Preencha as suas informações, como foto do perfil, horário de funcionamento e muito mais.",
    title: "Configure seu perfil",
  },
  {
    description: "Defina sua região de entrega, raios de atuação, tipos de entrega e muito mais.",
    title: "Configure seu envio",
  },
  {
    description: "Ative seu programa de afiliado para ver quem pode ser seu parceiro.",
    title: "Configure seu afiliado",
  },
  {
    description: "Adicione seus produtos ou serviços, organize categorias e deixe tudo pronto para venda.",
    title: "Configure seu catálogo",
  },
];

function ProgressCircle({ index }: { index: number }) {
  if (index === 0) {
    return (
      <span className="grid h-[88px] w-[88px] place-items-center rounded-full border border-[#28cc74] bg-white">
        <span className="grid h-[43px] w-[43px] place-items-center rounded-full bg-[#22c55e] text-white">
          <Check aria-hidden="true" className="h-[30px] w-[30px]" strokeWidth={3} />
        </span>
      </span>
    );
  }

  return (
    <span
      className={`grid h-[88px] w-[88px] place-items-center rounded-full bg-white text-[34px] font-medium text-[#050505] ${
        index === 1 ? "border border-[#ffbd00]" : "border border-[#b8b8b8]"
      }`}
    >
      {index + 1}
    </span>
  );
}

export function LojistaInicioScreen() {
  return (
    <LojistaDesktopShell active="inicio">
      <section className="flex-1 px-[72px] pb-[38px] pt-[75px]">
        <h1 className="text-[38px] font-black leading-tight tracking-normal text-[#050505]">
          Seja bem-vindo à Suwave!
        </h1>
        <p className="mt-[18px] text-[19px] font-medium leading-7 text-[#3d4351]">
          Falta muito pouco para sua loja começar a vender.
        </p>
        <p className="mt-[8px] text-[19px] font-medium leading-7 text-[#3d4351]">
          Conclua todas as etapas abaixo para ativar sua loja e alcançar mais clientes.
        </p>

        <section className="mt-[50px] rounded-[10px] border border-[#e3e3e3] bg-white px-[19px] pb-[27px] pt-[30px]">
          <h2 className="ml-[27px] text-[26px] font-black leading-tight text-[#050505]">
            Conclua todas as etapas antes de começar a vender
          </h2>

          <div className="relative mt-[50px] grid grid-cols-5">
            <span className="absolute left-[9.6%] right-[9.6%] top-[43px] h-[4px] bg-[#b8b8b8]" />
            <span className="absolute left-[9.6%] top-[43px] h-[4px] w-[10.2%] bg-[#22c55e]" />

            {onboardingSteps.map((step, index) => (
              <article className="relative z-10 grid justify-items-center px-[12px] text-center" key={step.title}>
                <ProgressCircle index={index} />
                <h3 className="mt-[25px] text-[17px] font-black leading-tight text-[#050505]">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-[15px] max-w-[190px] text-[15px] font-medium leading-[1.7] text-[#424653]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <section className="mt-[58px] flex min-h-[94px] items-center gap-[20px] rounded-[8px] border border-[#f4d789] bg-[#fffdf9] px-[20px]">
            <span className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-full bg-[#ffb000] text-white">
              <Star aria-hidden="true" className="h-[31px] w-[31px]" strokeWidth={2.3} />
            </span>
            <div>
              <h3 className="text-[20px] font-black leading-tight">Dica Suwave</h3>
              <p className="mt-[8px] text-[16px] font-medium text-[#333946]">
                Lojas completas têm mais visibilidade, conquistam mais clientes e vendem muito mais!
              </p>
            </div>
          </section>

          <section className="mt-[33px] flex min-h-[110px] items-center justify-between gap-[24px] rounded-[8px] border border-[#e3e3e3] bg-white px-[18px]">
            <div className="flex items-center gap-[20px]">
              <span className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border border-[#e6e6e6] bg-[#f9f9f9] text-[#b8b8b8]">
                <Lock aria-hidden="true" className="h-[26px] w-[26px]" strokeWidth={2.2} />
              </span>
              <div>
                <h3 className="text-[19px] font-black leading-tight">Complete todas as etapas para liberar sua loja.</h3>
                <p className="mt-[12px] text-[15px] font-medium text-[#4b4f5c]">
                  Após concluir todas as etapas, o botão abaixo será liberado para você começar a vender.
                </p>
              </div>
            </div>
            <button
              className="flex h-[58px] min-w-[234px] items-center justify-center gap-[14px] rounded-[8px] bg-[#eeeeee] px-[24px] text-[18px] font-black text-[#9b9b9b]"
              disabled
              type="button"
            >
              <Lock aria-hidden="true" className="h-[22px] w-[22px]" strokeWidth={2.2} />
              Começar a vender
            </button>
          </section>
        </section>
      </section>
    </LojistaDesktopShell>
  );
}

const profileCards = [
  { icon: Store, subtitle: "E-mail, telefone", title: "Dados comerciais" },
  { icon: MapPin, subtitle: "Rua, localização", title: "Endereço da loja" },
  { icon: UserRound, subtitle: "Nome e telefone do representante da empresa", title: "Dados do sócio" },
  { icon: FileText, subtitle: "CNPJ, razão social", title: "Informação da loja" },
  { icon: Landmark, subtitle: "Conta bancária da empresa para recebimentos", title: "Dados bancários" },
  { icon: CreditCard, subtitle: "Meios de pagamento aceitos na sua loja", title: "Formas de pagamento" },
];

const categories = ["Mercado", "Farmácia", "Comida e bebida", "Produtos em geral"];

const scheduleRows = [
  ["Segunda-feira", "08:00", "22:00"],
  ["Terça-feira", "08:00", "22:00"],
  ["Quarta-feira", "08:00", "22:00"],
  ["Quinta-feira", "08:00", "22:00"],
  ["Sexta-feira", "08:00", "23:00"],
  ["Sábado", "09:00", "23:00"],
  ["Domingo", "09:00", "22:00"],
];

function ProfileInfoCard({ icon: Icon, subtitle, title }: (typeof profileCards)[number]) {
  return (
    <button
      className="flex h-[91px] w-full items-center rounded-[8px] border border-[#e5e5e5] bg-white px-[23px] text-left"
      type="button"
    >
      <span className="grid h-[47px] w-[47px] shrink-0 place-items-center rounded-[10px] bg-[#fff3d8] text-[#8a6410]">
        <Icon aria-hidden="true" className="h-[27px] w-[27px]" strokeWidth={2.1} />
      </span>
      <span className="ml-[30px] min-w-0 flex-1">
        <strong className="block text-[18px] font-black leading-tight text-[#050505]">{title}</strong>
        <small className="mt-[8px] block truncate text-[14px] font-medium text-[#262d3c]">{subtitle}</small>
      </span>
      <ChevronDown aria-hidden="true" className="h-[25px] w-[25px] text-[#050505]" strokeWidth={2.4} />
    </button>
  );
}

export function LojistaPerfilScreen() {
  return (
    <LojistaDesktopShell active="perfil">
      <section className="flex-1 px-[23px] pb-[32px] pt-[26px]">
        <header className="flex items-center gap-[27px] pl-[22px]">
          <button
            className="grid h-[138px] w-[138px] shrink-0 place-items-center rounded-full border border-dashed border-[#cfd3da] bg-[#fbfbfb] text-[#2e3440]"
            type="button"
          >
            <span className="grid justify-items-center">
              <Camera aria-hidden="true" className="h-[34px] w-[34px] text-[#727784]" strokeWidth={2.2} />
              <span className="mt-[10px] text-[14px] font-bold">Adicionar logo</span>
            </span>
          </button>

          <div className="pt-[6px]">
            <div className="flex items-center gap-[18px]">
              <h1 className="text-[31px] font-black leading-tight tracking-normal text-[#050505]">Saboresia</h1>
              <button
                aria-label="Editar nome fantasia"
                className="grid h-[29px] w-[29px] place-items-center rounded-full bg-[#fff8e7] text-[#ffb000]"
                type="button"
              >
                <Pencil aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </button>
            </div>
            <p className="mt-[10px] text-[16px] font-medium text-[#283044]">Nome fantasia</p>
            <p className="mt-[18px] flex items-center gap-[13px] text-[16px] font-medium text-[#283044]">
              <MapPin aria-hidden="true" className="h-[20px] w-[20px] text-[#050505]" strokeWidth={2.25} />
              Avenida Alameda 174, Sinop - MT, 78550-000
            </p>
          </div>
        </header>

        <div className="mt-[4px] grid grid-cols-[minmax(520px,562px)_minmax(540px,1fr)] gap-[23px]">
          <section>
            <div className="grid gap-0">
              {profileCards.map((card) => (
                <ProfileInfoCard icon={card.icon} key={card.title} subtitle={card.subtitle} title={card.title} />
              ))}
            </div>

            <section className="rounded-[8px] border border-[#e5e5e5] bg-white px-[23px] pb-[19px] pt-[18px]">
              <h2 className="text-[16px] font-black leading-tight text-[#050505]">Selecione uma categoria abaixo</h2>
              <div className="mt-[17px] grid grid-cols-4 gap-[14px]">
                {categories.map((category) => (
                  <button
                    className="relative grid h-[87px] place-items-end justify-items-center rounded-[7px] border border-[#e5e5e5] bg-white px-[10px] pb-[19px] text-[14px] font-medium text-[#050505]"
                    key={category}
                    type="button"
                  >
                    <span className="absolute right-[13px] top-[13px] h-[17px] w-[17px] rounded-full border-2 border-[#8e94a1]" />
                    {category}
                  </button>
                ))}
              </div>
              <p className="mt-[18px] text-[14px] font-black text-[#ff2b2b]">Essa seleção é obrigatória.</p>
            </section>
          </section>

          <section className="grid content-start gap-[20px]">
            <section className="rounded-[8px] border border-[#e5e5e5] bg-white px-[30px] pb-[24px] pt-[26px]">
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-[16px]">
                  <span className="grid h-[33px] w-[33px] place-items-center rounded-full bg-[#fff4dc] text-[#ffb000]">
                    <Clock3 aria-hidden="true" className="h-[23px] w-[23px]" strokeWidth={2.2} />
                  </span>
                  <h2 className="text-[17px] font-black leading-tight text-[#050505]">Horários de Funcionamento</h2>
                </div>
                <button className="text-[15px] font-black text-[#ffb000]" type="button">
                  Editar
                </button>
              </header>

              <table className="mt-[31px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#e9e9e9] text-[14px] font-medium text-[#252d42]">
                    <th className="pb-[13px] font-medium">Dia da Semana</th>
                    <th className="pb-[13px] text-center font-medium">Abertura</th>
                    <th className="pb-[13px] text-center font-medium">Fechamento</th>
                    <th className="pb-[13px] text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map(([day, open, close]) => (
                    <tr className="border-b border-[#eeeeee] last:border-b-0" key={day}>
                      <td className="py-[12px] text-[14px] font-black text-[#050505]">{day}</td>
                      <td className="py-[12px] text-center text-[14px] font-black text-[#050505]">{open}</td>
                      <td className="py-[12px] text-center text-[14px] font-black text-[#050505]">{close}</td>
                      <td className="py-[12px] text-center">
                        <span className="inline-flex h-[25px] items-center rounded-full bg-[#dcfce7] px-[13px] text-[14px] font-black text-[#16a34a]">
                          Aberto
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="rounded-[8px] border border-[#e5e5e5] bg-white px-[23px] pb-[22px] pt-[24px]">
              <h2 className="text-[17px] font-black leading-tight text-[#050505]">Pedido Mínimo</h2>
              <div className="mt-[31px] flex items-center gap-[43px]">
                <label className="text-[16px] font-black text-[#050505]" htmlFor="minimum-order">
                  Pedido mínimo
                </label>
                <div className="flex h-[54px] w-[220px] items-center justify-between rounded-[8px] border border-[#e1e1e1] bg-white px-[18px]">
                  <input
                    className="w-[120px] border-0 bg-transparent text-[20px] font-black text-[#050505] outline-0"
                    id="minimum-order"
                    readOnly
                    value="R$ 20,00"
                  />
                  <span className="grid gap-[7px] text-[#050505]">
                    <ChevronDown aria-hidden="true" className="h-[18px] w-[18px] rotate-180" strokeWidth={3} />
                    <ChevronDown aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={3} />
                  </span>
                </div>
              </div>
              <p className="mt-[20px] text-[14px] font-medium text-[#283044]">
                O valor mínimo para realizar pedido na sua loja online.
              </p>
              <div className="mt-[60px] flex justify-end">
                <button
                  className="flex h-[49px] w-[304px] items-center justify-center gap-[17px] rounded-[6px] bg-[#ffb000] text-[18px] font-black text-[#050505]"
                  type="button"
                >
                  <RefreshCw aria-hidden="true" className="h-[21px] w-[21px]" strokeWidth={2.4} />
                  Atualizar perfil
                </button>
              </div>
            </section>
          </section>
        </div>
      </section>
    </LojistaDesktopShell>
  );
}
