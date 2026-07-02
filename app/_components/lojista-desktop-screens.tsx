"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { fetchAddressByCep } from "./cep";
import { profileSchema, zodErrors } from "./form-schemas";
import { maskCep, maskCnpj, maskCurrencyBRL, maskUf, maskWhatsapp } from "./masks";

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

type DesktopShellProps = {
  active: "inicio" | "perfil";
  children: React.ReactNode;
};

type ProfileField =
  | "category"
  | "cep"
  | "city"
  | "cnpj"
  | "email"
  | "minimumOrder"
  | "neighborhood"
  | "number"
  | "ownerName"
  | "ownerPhone"
  | "state"
  | "street"
  | "storeName"
  | "whatsapp";

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
      <span className="text-[48px] font-black leading-none tracking-normal text-ink">
        SU<span className="text-brand">W</span>AVE
      </span>
    </Link>
  );
}

function Sidebar({ active }: { active: DesktopShellProps["active"] }) {
  return (
    <aside className="sticky top-0 h-screen w-[263px] shrink-0 border-r border-line bg-surface px-0 py-[34px]">
      <div className="px-[28px]">
        <SuwaveLogo />
      </div>

      <nav className="mt-[43px] grid gap-[24px] px-[4px]">
        {navGroups.map((group, groupIndex) => (
          <div
            className={`grid gap-[8px] ${groupIndex ? "border-t border-line pt-[18px]" : ""}`}
            key={group.map((item) => item.label).join("-")}
          >
            {group.map(({ href, icon: Icon, label }) => {
              const isActive = active === "inicio" ? label === "Início" : label === "Perfil";

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`press relative flex h-[46px] items-center gap-[24px] rounded-[8px] px-[26px] text-[16px] font-black no-underline transition ${
                    isActive ? "bg-brand-soft text-ink" : "text-ink hover:translate-x-[2px] hover:bg-surface-2"
                  }`}
                  href={href}
                  key={label}
                >
                  {isActive ? <span className="absolute left-0 top-2 h-[30px] w-[2px] bg-brand" /> : null}
                  <Icon
                    aria-hidden="true"
                    className={isActive ? "h-[22px] w-[22px] text-brand" : "h-[22px] w-[22px] text-ink"}
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
    <header className="relative flex h-[100px] shrink-0 items-center justify-center border-b border-line bg-surface">
      <button
        aria-label="Loja ativada"
        className="press flex h-[50px] items-center gap-[11px] rounded-[9px] border border-line bg-surface px-[16px] text-[17px] font-black text-ink hover:border-line-strong hover:shadow-[0_6px_16px_rgba(0,0,0,.06)]"
        type="button"
      >
        <span className="relative h-[27px] w-[48px] rounded-full bg-line transition-colors">
          <span className="absolute left-[3px] top-[3px] h-[21px] w-[21px] rounded-full bg-surface shadow-[0_1px_4px_rgba(0,0,0,.16)] transition-transform duration-300" />
        </span>
        Loja Ativada
      </button>

      <Link
        aria-label="Notificações"
        className="press absolute right-[31px] top-[34px] grid h-[42px] w-[42px] place-items-center text-ink no-underline"
        href="/orders"
      >
        <Bell aria-hidden="true" className="h-[29px] w-[29px]" strokeWidth={2.1} />
        <span className="badge-pulse absolute right-[1px] top-[-2px] grid h-[23px] min-w-[23px] place-items-center rounded-full bg-danger px-[6px] text-[12px] font-black leading-none text-white">
          3
        </span>
      </Link>
    </header>
  );
}

function LojistaDesktopShell({ active, children }: DesktopShellProps) {
  return (
    <main className="min-h-screen overflow-x-auto bg-surface text-ink">
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
      <span className="grid h-[88px] w-[88px] place-items-center rounded-full border border-[#28cc74] bg-surface">
        <span className="grid h-[43px] w-[43px] place-items-center rounded-full bg-[#22c55e] text-white">
          <Check aria-hidden="true" className="h-[30px] w-[30px]" strokeWidth={3} />
        </span>
      </span>
    );
  }

  return (
    <span
      className={`grid h-[88px] w-[88px] place-items-center rounded-full bg-surface text-[34px] font-medium text-ink ${
        index === 1 ? "border border-brand" : "border border-[#b8b8b8]"
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
        <h1 className="anim-rise text-[38px] font-black leading-tight tracking-normal text-ink">
          Seja bem-vindo à Suwave!
        </h1>
        <p className="anim-rise anim-d1 mt-[18px] text-[19px] font-medium leading-7 text-ink-2">
          Falta muito pouco para sua loja começar a vender.
        </p>
        <p className="anim-rise anim-d2 mt-[8px] text-[19px] font-medium leading-7 text-ink-2">
          Conclua todas as etapas abaixo para ativar sua loja e alcançar mais clientes.
        </p>

        <section className="anim-rise anim-d3 mt-[50px] rounded-[10px] border border-line bg-surface px-[19px] pb-[27px] pt-[30px]">
          <h2 className="ml-[27px] text-[26px] font-black leading-tight text-ink">
            Conclua todas as etapas antes de começar a vender
          </h2>

          <div className="stagger relative mt-[50px] grid grid-cols-5">
            <span className="absolute left-[9.6%] right-[9.6%] top-[43px] h-[4px] bg-[#b8b8b8]" />
            <span className="absolute left-[9.6%] top-[43px] h-[4px] w-[10.2%] bg-[#22c55e]" />

            {onboardingSteps.map((step, index) => {
              const hrefByStep: Record<number, string> = {
                1: "/store/profile",
                2: "/store/delivery",
                4: "/products",
              };
              const content = (
                <>
                <ProgressCircle index={index} />
                <h3 className="mt-[25px] text-[17px] font-black leading-tight text-ink">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-[15px] max-w-[190px] text-[15px] font-medium leading-[1.7] text-ink-2">
                  {step.description}
                </p>
                </>
              );

              return hrefByStep[index] ? (
                <Link
                  className="relative z-10 grid justify-items-center px-[12px] text-center no-underline transition hover:opacity-80"
                  href={hrefByStep[index]}
                  key={step.title}
                >
                  {content}
                </Link>
              ) : (
                <article className="relative z-10 grid justify-items-center px-[12px] text-center" key={step.title}>
                  {content}
                </article>
              );
            })}
          </div>

          <section className="anim-rise anim-d5 hover-lift mt-[58px] flex min-h-[94px] items-center gap-[20px] rounded-[8px] border border-[#f4d789] bg-brand-soft px-[20px]">
            <span className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-full bg-brand text-white">
              <Star aria-hidden="true" className="h-[31px] w-[31px]" strokeWidth={2.3} />
            </span>
            <div>
              <h3 className="text-[20px] font-black leading-tight">Dica Suwave</h3>
              <p className="mt-[8px] text-[16px] font-medium text-ink-2">
                Lojas completas têm mais visibilidade, conquistam mais clientes e vendem muito mais!
              </p>
            </div>
          </section>

          <section className="anim-rise anim-d6 hover-lift mt-[33px] flex min-h-[110px] items-center justify-between gap-[24px] rounded-[8px] border border-line bg-surface px-[18px]">
            <div className="flex items-center gap-[20px]">
              <span className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border border-line bg-surface-2 text-[#b8b8b8]">
                <Lock aria-hidden="true" className="h-[26px] w-[26px]" strokeWidth={2.2} />
              </span>
              <div>
                <h3 className="text-[19px] font-black leading-tight">Complete todas as etapas para liberar sua loja.</h3>
                <p className="mt-[12px] text-[15px] font-medium text-ink-2">
                  Após concluir todas as etapas, o botão abaixo será liberado para você começar a vender.
                </p>
              </div>
            </div>
            <button
              className="press flex h-[58px] min-w-[234px] items-center justify-center gap-[14px] rounded-[8px] bg-line px-[24px] text-[18px] font-black text-[#9b9b9b]"
              onClick={() => toast.info("Complete todas as etapas para liberar sua loja.")}
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

function ProfileInfoCard({
  icon: Icon,
  isOpen,
  onClick,
  subtitle,
  title,
}: (typeof profileCards)[number] & { isOpen?: boolean; onClick?: () => void }) {
  return (
    <button
      className="press flex h-[91px] w-full items-center rounded-[8px] border border-line bg-surface px-[23px] text-left hover:border-line-strong hover:bg-brand-soft"
      onClick={onClick}
      type="button"
    >
      <span className="grid h-[47px] w-[47px] shrink-0 place-items-center rounded-[10px] bg-brand-soft text-warning">
        <Icon aria-hidden="true" className="h-[27px] w-[27px]" strokeWidth={2.1} />
      </span>
      <span className="ml-[30px] min-w-0 flex-1">
        <strong className="block text-[18px] font-black leading-tight text-ink">{title}</strong>
        <small className="mt-[8px] block truncate text-[14px] font-medium text-ink-2">{subtitle}</small>
      </span>
      <ChevronDown
        aria-hidden="true"
        className={`h-[25px] w-[25px] text-ink transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        strokeWidth={2.4}
      />
    </button>
  );
}

export function LojistaPerfilScreen() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [cep, setCep] = useState("78550-000");
  const [city, setCity] = useState("Sinop");
  const [cnpj, setCnpj] = useState("12.345.678/0001-90");
  const [email, setEmail] = useState("contato@saboresia.com.br");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ProfileField, string>>>({});
  const [minimumOrder, setMinimumOrder] = useState("R$ 20,00");
  const [neighborhood, setNeighborhood] = useState("Centro");
  const [number, setNumber] = useState("174");
  const [ownerName, setOwnerName] = useState("Representante Saboresia");
  const [ownerPhone, setOwnerPhone] = useState("(66) 99999-0000");
  const [state, setState] = useState("MT");
  const [street, setStreet] = useState("Avenida Alameda");
  const [storeName, setStoreName] = useState("Saboresia");
  const [whatsapp, setWhatsapp] = useState("(66) 99999-0000");
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      return;
    }

    let active = true;

    async function loadAddress() {
      setIsCepLoading(true);
      try {
        const address = await fetchAddressByCep(digits);
        if (!active) {
          return;
        }
        setStreet(address.rua || street);
        setNeighborhood(address.bairro || neighborhood);
        setCity(address.cidade || city);
        setState(address.estado || state);
        setFieldErrors((current) => ({ ...current, cep: undefined }));
        toast.success("Endereço preenchido pelo CEP.");
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : "Não foi possível consultar o CEP.";
          setFieldErrors((current) => ({ ...current, cep: message }));
          toast.error(message);
        }
      } finally {
        if (active) {
          setIsCepLoading(false);
        }
      }
    }

    void loadAddress();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  function handleProfileSave() {
    setFieldErrors({});
    const parsed = profileSchema.safeParse({
      category,
      cep,
      city,
      cnpj,
      email,
      minimumOrder,
      neighborhood,
      number,
      ownerName,
      ownerPhone,
      state,
      street,
      storeName,
      whatsapp,
    });

    if (!parsed.success) {
      const errors = zodErrors<ProfileField>(parsed.error);
      setFieldErrors(errors);
      toast.error(Object.values(errors)[0] ?? "Revise os campos do perfil.");
      return;
    }

    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      toast.success("Perfil atualizado com sucesso.");
    }, 550);
  }

  return (
    <LojistaDesktopShell active="perfil">
      <section className="flex-1 px-[23px] pb-[32px] pt-[26px]">
        <header className="anim-rise flex items-center gap-[27px] pl-[22px]">
          <button
            className="press grid h-[138px] w-[138px] shrink-0 place-items-center rounded-full border border-dashed border-line-strong bg-surface-2 text-ink hover:border-brand hover:bg-brand-soft"
            type="button"
          >
            <span className="grid justify-items-center">
              <Camera aria-hidden="true" className="h-[34px] w-[34px] text-ink-3" strokeWidth={2.2} />
              <span className="mt-[10px] text-[14px] font-bold">Adicionar logo</span>
            </span>
          </button>

          <div className="pt-[6px]">
            <div className="flex items-center gap-[18px]">
              <h1 className="text-[31px] font-black leading-tight tracking-normal text-ink">{storeName}</h1>
              <button
                aria-label="Editar nome fantasia"
                className="grid h-[29px] w-[29px] place-items-center rounded-full bg-brand-soft text-brand"
                type="button"
              >
                <Pencil aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </button>
            </div>
            <p className="mt-[10px] text-[16px] font-medium text-ink-2">Nome fantasia</p>
            <p className="mt-[18px] flex items-center gap-[13px] text-[16px] font-medium text-ink-2">
              <MapPin aria-hidden="true" className="h-[20px] w-[20px] text-ink" strokeWidth={2.25} />
              Avenida Alameda 174, Sinop - MT, 78550-000
            </p>
          </div>
        </header>

        <div className="stagger mt-[4px] grid grid-cols-[minmax(520px,562px)_minmax(540px,1fr)] gap-[23px]">
          <section>
            <div className="grid gap-0">
              {profileCards.map((card) => (
                <div key={card.title}>
                  <ProfileInfoCard
                    icon={card.icon}
                    isOpen={activePanel === card.title}
                    onClick={() => setActivePanel((current) => (current === card.title ? null : card.title))}
                    subtitle={card.subtitle}
                    title={card.title}
                  />
                  {activePanel === card.title ? (
                    <div className="anim-rise grid gap-3 border-x border-line bg-brand-soft px-[23px] py-4">
                      {card.title === "Dados comerciais" ? (
                        <>
                          <input className={`h-11 rounded-[8px] border px-3 text-sm font-bold outline-0 ${fieldErrors.email ? "border-danger" : "border-line"}`} onChange={(event) => setEmail(event.target.value)} placeholder="E-mail" value={email} />
                          {fieldErrors.email ? <small className="font-bold text-danger">{fieldErrors.email}</small> : null}
                          <input className={`h-11 rounded-[8px] border px-3 text-sm font-bold outline-0 ${fieldErrors.whatsapp ? "border-danger" : "border-line"}`} onChange={(event) => setWhatsapp(maskWhatsapp(event.target.value))} placeholder="Telefone" value={whatsapp} />
                          {fieldErrors.whatsapp ? <small className="font-bold text-danger">{fieldErrors.whatsapp}</small> : null}
                        </>
                      ) : null}
                      {card.title === "Endereço da loja" ? (
                        <>
                          <input className={`h-11 rounded-[8px] border px-3 text-sm font-bold outline-0 ${fieldErrors.cep ? "border-danger" : "border-line"}`} onChange={(event) => setCep(maskCep(event.target.value))} placeholder="CEP" value={cep} />
                          {fieldErrors.cep ? <small className="font-bold text-danger">{fieldErrors.cep}</small> : null}
                          {isCepLoading ? <small className="font-bold text-warning">Consultando CEP...</small> : null}
                          <div className="grid grid-cols-[1fr_90px] gap-3">
                            <input className="h-11 rounded-[8px] border border-line px-3 text-sm font-bold outline-0" onChange={(event) => setStreet(event.target.value)} placeholder="Rua" value={street} />
                            <input className="h-11 rounded-[8px] border border-line px-3 text-sm font-bold outline-0" onChange={(event) => setNumber(event.target.value)} placeholder="Número" value={number} />
                          </div>
                          <div className="grid grid-cols-[1fr_1fr_70px] gap-3">
                            <input className="h-11 rounded-[8px] border border-line px-3 text-sm font-bold outline-0" onChange={(event) => setNeighborhood(event.target.value)} placeholder="Bairro" value={neighborhood} />
                            <input className="h-11 rounded-[8px] border border-line px-3 text-sm font-bold outline-0" onChange={(event) => setCity(event.target.value)} placeholder="Cidade" value={city} />
                            <input className="h-11 rounded-[8px] border border-line px-3 text-sm font-bold outline-0" onChange={(event) => setState(maskUf(event.target.value))} placeholder="UF" value={state} />
                          </div>
                        </>
                      ) : null}
                      {card.title === "Dados do sócio" ? (
                        <>
                          <input className={`h-11 rounded-[8px] border px-3 text-sm font-bold outline-0 ${fieldErrors.ownerName ? "border-danger" : "border-line"}`} onChange={(event) => setOwnerName(event.target.value)} placeholder="Nome do representante" value={ownerName} />
                          {fieldErrors.ownerName ? <small className="font-bold text-danger">{fieldErrors.ownerName}</small> : null}
                          <input className={`h-11 rounded-[8px] border px-3 text-sm font-bold outline-0 ${fieldErrors.ownerPhone ? "border-danger" : "border-line"}`} onChange={(event) => setOwnerPhone(maskWhatsapp(event.target.value))} placeholder="Telefone do representante" value={ownerPhone} />
                          {fieldErrors.ownerPhone ? <small className="font-bold text-danger">{fieldErrors.ownerPhone}</small> : null}
                        </>
                      ) : null}
                      {card.title === "Informação da loja" ? (
                        <>
                          <input className={`h-11 rounded-[8px] border px-3 text-sm font-bold outline-0 ${fieldErrors.storeName ? "border-danger" : "border-line"}`} onChange={(event) => setStoreName(event.target.value)} placeholder="Nome fantasia" value={storeName} />
                          {fieldErrors.storeName ? <small className="font-bold text-danger">{fieldErrors.storeName}</small> : null}
                          <input className={`h-11 rounded-[8px] border px-3 text-sm font-bold outline-0 ${fieldErrors.cnpj ? "border-danger" : "border-line"}`} onChange={(event) => setCnpj(maskCnpj(event.target.value))} placeholder="CNPJ" value={cnpj} />
                          {fieldErrors.cnpj ? <small className="font-bold text-danger">{fieldErrors.cnpj}</small> : null}
                        </>
                      ) : (
                        card.title === "Dados bancários" || card.title === "Formas de pagamento" ? (
                          <p className="text-sm font-bold text-ink-2">Configuração disponível em breve. O perfil pode ser salvo com os dados atuais.</p>
                        ) : null
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <section className="rounded-[8px] border border-line bg-surface px-[23px] pb-[19px] pt-[18px]">
              <h2 className="text-[16px] font-black leading-tight text-ink">Selecione uma categoria abaixo</h2>
              <div className="mt-[17px] grid grid-cols-4 gap-[14px]">
                {categories.map((categoryOption) => (
                  <button
                    className={`press grid h-[87px] grid-rows-[auto_1fr] gap-[6px] rounded-[7px] border bg-surface px-[10px] pb-[17px] pt-[13px] text-[13px] font-medium leading-tight text-ink hover:border-brand/60 ${
                      fieldErrors.category
                        ? "border-danger"
                        : category === categoryOption
                          ? "border-brand"
                          : "border-line"
                    }`}
                    key={categoryOption}
                    onClick={() => {
                      setCategory(categoryOption);
                      setFieldErrors((current) => ({ ...current, category: undefined }));
                    }}
                    type="button"
                  >
                    <span className="grid h-[17px] w-[17px] place-items-center justify-self-end rounded-full border-2 border-[#8e94a1]">
                      {category === categoryOption ? <span className="h-[7px] w-[7px] rounded-full bg-brand" /> : null}
                    </span>
                    <span className="self-end text-center">{categoryOption}</span>
                  </button>
                ))}
              </div>
              {!category || fieldErrors.category ? (
                <p className="mt-[18px] text-[14px] font-black text-danger">
                  {fieldErrors.category ?? "Essa seleção é obrigatória."}
                </p>
              ) : null}
            </section>
          </section>

          <section className="grid content-start gap-[20px]">
            <section className="rounded-[8px] border border-line bg-surface px-[30px] pb-[24px] pt-[26px]">
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-[16px]">
                  <span className="grid h-[33px] w-[33px] place-items-center rounded-full bg-brand-soft text-brand">
                    <Clock3 aria-hidden="true" className="h-[23px] w-[23px]" strokeWidth={2.2} />
                  </span>
                  <h2 className="text-[17px] font-black leading-tight text-ink">Horários de Funcionamento</h2>
                </div>
                <button className="text-[15px] font-black text-brand" type="button">
                  Editar
                </button>
              </header>

              <table className="mt-[31px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line text-[14px] font-medium text-ink-2">
                    <th className="pb-[13px] font-medium">Dia da Semana</th>
                    <th className="pb-[13px] text-center font-medium">Abertura</th>
                    <th className="pb-[13px] text-center font-medium">Fechamento</th>
                    <th className="pb-[13px] text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map(([day, open, close]) => (
                    <tr className="border-b border-line last:border-b-0" key={day}>
                      <td className="py-[12px] text-[14px] font-black text-ink">{day}</td>
                      <td className="py-[12px] text-center text-[14px] font-black text-ink">{open}</td>
                      <td className="py-[12px] text-center text-[14px] font-black text-ink">{close}</td>
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

            <section className="rounded-[8px] border border-line bg-surface px-[23px] pb-[22px] pt-[24px]">
              <h2 className="text-[17px] font-black leading-tight text-ink">Pedido Mínimo</h2>
              <div className="mt-[31px] flex items-center gap-[43px]">
                <label className="text-[16px] font-black text-ink" htmlFor="minimum-order">
                  Pedido mínimo
                </label>
                <div className="flex h-[54px] w-[220px] items-center justify-between rounded-[8px] border border-line-strong bg-surface px-[18px]">
                  <input
                    className="w-[120px] border-0 bg-transparent text-[20px] font-black text-ink outline-0"
                    id="minimum-order"
                    onChange={(event) => setMinimumOrder(maskCurrencyBRL(event.target.value))}
                    value={minimumOrder}
                  />
                  <span className="grid gap-[7px] text-ink">
                    <ChevronDown aria-hidden="true" className="h-[18px] w-[18px] rotate-180" strokeWidth={3} />
                    <ChevronDown aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={3} />
                  </span>
                </div>
              </div>
              <p className="mt-[20px] text-[14px] font-medium text-ink-2">
                O valor mínimo para realizar pedido na sua loja online.
              </p>
              <div className="mt-[60px] flex justify-end">
                <button
                  className="press flex h-[49px] w-[304px] items-center justify-center gap-[17px] rounded-[6px] bg-brand text-[18px] font-black text-ink hover:bg-brand-strong hover:shadow-[0_10px_24px_rgba(255,176,0,.35)] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSaving}
                  onClick={handleProfileSave}
                  type="button"
                >
                  <RefreshCw aria-hidden="true" className={`h-[21px] w-[21px] ${isSaving ? "animate-spin" : ""}`} strokeWidth={2.4} />
                  {isSaving ? "Atualizando..." : "Atualizar perfil"}
                </button>
              </div>
            </section>
          </section>
        </div>
      </section>
    </LojistaDesktopShell>
  );
}
