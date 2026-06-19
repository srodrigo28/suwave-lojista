"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FaBell,
  FaBox,
  FaChartLine,
  FaChevronRight,
  FaCog,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaShoppingBag,
  FaStar,
  FaStore,
  FaTicketAlt,
  FaWallet,
} from "react-icons/fa";
import type { SellerPage } from "./seller-data";
import { useSellerLivePage } from "./use-seller-live-page";

const bottomLinks: Array<{ href: string; icon: IconType; name: string; floating?: boolean }> = [
  { href: "/dashboard", icon: FaStore, name: "Início" },
  { href: "/products", icon: FaBox, name: "Produtos" },
  { href: "/products/new", icon: FaPlus, name: "Novo", floating: true },
  { href: "/orders", icon: FaShoppingBag, name: "Pedidos" },
  { href: "/settings", icon: FaCog, name: "Mais" },
];

const quickTiles: Array<{ href: string; icon: IconType; label: string; tone: string }> = [
  { href: "/orders", icon: FaShoppingBag, label: "Pedidos", tone: "bg-lime-100 text-lime-700" },
  { href: "/products", icon: FaBox, label: "Produtos", tone: "bg-sky-100 text-sky-700" },
  { href: "/promotions", icon: FaTicketAlt, label: "Promoções", tone: "bg-amber-100 text-amber-700" },
  { href: "/finance", icon: FaWallet, label: "Financeiro", tone: "bg-emerald-100 text-emerald-700" },
  { href: "/reviews", icon: FaStar, label: "Avaliações", tone: "bg-violet-100 text-violet-700" },
  { href: "/store/profile", icon: FaStore, label: "Loja", tone: "bg-zinc-100 text-zinc-700" },
  { href: "/finance/statement", icon: FaCreditCard, label: "Extrato", tone: "bg-orange-100 text-orange-700" },
  { href: "/settings/team", icon: FaCog, label: "Equipe", tone: "bg-slate-100 text-slate-700" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function DeviceStatusBar() {
  return (
    <div className="relative z-10 grid h-[58px] grid-cols-[1fr_138px_1fr] items-center bg-white px-[22px] pt-3 text-[17px] font-bold">
      <strong className="leading-none tracking-normal">9:41</strong>
      <div className="mx-auto flex h-[38px] w-[124px] items-center justify-end rounded-full bg-black pr-4">
        <span className="h-[5px] w-[5px] rounded-full bg-[#082338] shadow-[0_0_9px_#1598ff]" />
      </div>
      <div className="flex items-center justify-end gap-[9px]">
        <span className="h-4 w-5 bg-black [clip-path:polygon(0_100%,0_68%,18%_68%,18%_100%,28%_100%,28%_48%,46%_48%,46%_100%,56%_100%,56%_25%,74%_25%,74%_100%,84%_100%,84%_0,100%_0,100%_100%)]" />
        <span className="relative h-[15px] w-[18px] translate-y-[3px] rounded-full border-t-4 border-black before:absolute before:inset-x-[3px] before:top-[3px] before:rounded-full before:border-t-[3px] before:border-black after:absolute after:left-[7px] after:top-[9px] after:h-[3px] after:w-[3px] after:rounded-full after:bg-black" />
        <span className="relative h-3 w-6 rounded-[3px] border-2 border-black before:absolute before:inset-0.5 before:rounded-[1px] before:bg-black after:absolute after:-right-[5px] after:top-0.5 after:h-[5px] after:w-0.5 after:rounded-r-sm after:bg-black" />
      </div>
    </div>
  );
}

function SellerHeader({ state }: { state: "fallback" | "live" | "loading" }) {
  const statusLabel =
    state === "live" ? "API live" : state === "loading" ? "Sincronizando" : "Modo visual";

  return (
    <header className="grid min-h-24 grid-cols-[minmax(102px,1fr)_auto_minmax(36px,1fr)] items-center gap-2 bg-white">
      <Link aria-label="Abrir financeiro" className="grid gap-1 leading-none text-inherit no-underline" href="/finance">
        <small className="text-sm">Suwave Logista</small>
        <strong className="text-lg font-bold text-[#087c1e]">{statusLabel}</strong>
        <span className="mt-2 flex w-max items-center gap-2 text-sm">
          <FaTicketAlt className="text-[22px] text-[#f6bf19]" aria-hidden="true" />
          Operacao <b>{state === "live" ? "real" : "demo"}</b>
        </span>
      </Link>

      <Link
        className="flex items-center gap-2 rounded-2xl px-2 py-3 text-sm font-bold text-black no-underline"
        href="/store/profile"
      >
        <FaMapMarkerAlt aria-hidden="true" />
        Sinop - MT
      </Link>

      <Link
        aria-label="Alertas da loja"
        className="relative ml-auto grid h-10 w-10 place-items-center rounded-full bg-white text-black no-underline shadow-[0_8px_20px_rgba(0,0,0,.08)]"
        href="/orders"
      >
        <FaBell aria-hidden="true" />
        <b className="absolute right-1 top-0 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#ef233c] text-[10px] text-white">
          4
        </b>
      </Link>
    </header>
  );
}

function SearchBar() {
  return (
    <label className="mb-3 flex h-12 items-center gap-3 rounded-[15px] border border-[#efefef] bg-[#f8f8f8] px-4 text-[#6e737d] shadow-[inset_0_1px_0_rgba(255,255,255,.75)]">
      <FaSearch aria-hidden="true" />
      <input
        aria-label="Buscar no app lojista"
        className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
        placeholder="Buscar pedidos, produtos e clientes"
        type="search"
      />
    </label>
  );
}

function TopArea({ state }: { state: "fallback" | "live" | "loading" }) {
  return (
    <div className="sticky top-0 z-30 -mx-[clamp(18px,3.4vw,25px)] border-b border-[#f1f2f4] bg-white px-[clamp(18px,3.4vw,25px)] pb-3">
      <SellerHeader state={state} />
      <SearchBar />
    </div>
  );
}

function PromoBanner({ page }: { page: SellerPage }) {
  return (
    <section className="relative mt-5 grid min-h-[168px] overflow-hidden rounded-[8px] bg-[#102017] p-4 text-white">
      <div className="relative z-10 max-w-[70%]">
        <span className="text-[11px] font-black uppercase tracking-normal text-[#9ff2c2]">
          {page.section}
        </span>
        <h1 className="mt-2 text-[27px] font-black leading-[1.02] tracking-normal">
          {page.title}
        </h1>
        <p className="mt-2 text-[13px] font-bold leading-[1.35] text-white/80">
          {page.description}
        </p>
        {page.action ? (
          <Link
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-[7px] bg-[#05b96e] px-3 text-xs font-black text-white no-underline"
            href={page.action.href}
          >
            {page.action.label}
            <FaChevronRight aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      <div className="absolute bottom-4 right-4 grid h-[94px] w-[94px] place-items-center rounded-[28px] bg-[#f6bf19] text-[42px] font-black text-[#102017] shadow-[inset_-10px_-10px_0_rgba(0,0,0,.08)]">
        <FaStore aria-hidden="true" />
      </div>
      <div className="absolute bottom-3 left-4 flex gap-1">
        <span className="h-1.5 w-5 rounded-full bg-white" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
      </div>
    </section>
  );
}

function QuickGrid() {
  return (
    <div className="mt-5 grid grid-cols-4 gap-x-3 gap-y-4">
      {quickTiles.map(({ href, icon: Icon, label, tone }) => (
        <Link
          className="grid justify-items-center gap-2 text-center text-[11px] font-black leading-tight text-[#1b1d22] no-underline"
          href={href}
          key={href}
        >
          <span className={`grid h-[54px] w-[54px] place-items-center rounded-[18px] text-[22px] ${tone}`}>
            <Icon aria-hidden="true" />
          </span>
          {label}
        </Link>
      ))}
    </div>
  );
}

function MetricCards({ page }: { page: SellerPage }) {
  if (!page.cards?.length) {
    return null;
  }

  return (
    <section className="mt-5 grid grid-cols-2 gap-3">
      {page.cards.map((card) => (
        <article className="rounded-[8px] border border-[#eceef2] bg-white p-3" key={card.title}>
          <small className="block text-[10px] font-black uppercase tracking-normal text-[#6b7280]">
            {card.eyebrow}
          </small>
          <strong className="mt-2 block text-[22px] font-black leading-none text-[#087c1e]">
            {card.value}
          </strong>
          <span className="mt-1 block text-xs font-bold leading-tight text-[#4b5563]">
            {card.title}
          </span>
        </article>
      ))}
    </section>
  );
}

function Checklist({ page }: { page: SellerPage }) {
  if (!page.checklist?.length) {
    return null;
  }

  return (
    <section className="mt-5 rounded-[8px] border border-[#eceef2] bg-white p-3">
      <h2 className="mb-3 text-[15px] font-black">Etapas da tela</h2>
      <div className="grid gap-2">
        {page.checklist.map((item, index) => (
          <div className="grid grid-cols-[30px_1fr] items-center gap-3 rounded-[7px] bg-[#f8fafb] p-3" key={item}>
            <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#eefaf1] text-xs font-black text-[#078323]">
              {index + 1}
            </span>
            <strong className="text-sm font-extrabold text-[#111317]">{item}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function ItemList({ page }: { page: SellerPage }) {
  if (!page.items?.length) {
    return null;
  }

  function RowContent({ item }: { item: NonNullable<SellerPage["items"]>[number] }) {
    return (
      <>
        <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#eefaf1] text-[#078323]">
          <FaChartLine aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <strong className="block truncate text-sm font-black text-[#111317]">{item.title}</strong>
          <small className="block truncate text-[11px] font-bold text-[#6b7280]">
            {item.meta} · {item.status}
          </small>
        </div>
        <b className="whitespace-nowrap text-xs font-black text-[#078323]">{item.value}</b>
      </>
    );
  }

  return (
    <section className="mt-5 rounded-[8px] border border-[#eceef2] bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-black">Lista principal</h2>
        <Link className="text-xs font-black text-[#b77900] no-underline" href={page.action?.href ?? "/dashboard"}>
          Ver tudo
        </Link>
      </div>
      <div className="grid gap-0">
        {page.items.map((item, index) => {
          const className = `grid min-h-[66px] grid-cols-[42px_1fr_auto] items-center gap-3 py-3 no-underline ${
            index ? "border-t border-[#eef0f4]" : ""
          }`;

          return item.href ? (
            <Link className={className} href={item.href} key={`${item.title}-${item.meta}`}>
              <RowContent item={item} />
            </Link>
          ) : (
            <article className={className} key={`${item.title}-${item.meta}`}>
              <RowContent item={item} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EmptyState({ page }: { page: SellerPage }) {
  if (!page.emptyState) {
    return null;
  }

  return (
    <section className="mt-5 grid min-h-44 place-items-center rounded-[8px] border border-dashed border-[#d9e0e8] bg-white p-6 text-center">
      <div>
        <strong className="block text-lg font-black text-[#111317]">Tudo em ordem</strong>
        <p className="mt-2 text-sm font-bold leading-5 text-[#4b5563]">{page.emptyState}</p>
      </div>
    </section>
  );
}

function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 grid h-[82px] grid-cols-5 border-t border-[#e9edf2] bg-white px-3 pb-3 pt-2">
      {bottomLinks.map(({ href, icon: Icon, name, floating }) => {
        const active = isActivePath(pathname, href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`relative grid place-items-center gap-1 text-[11px] font-black no-underline ${
              active ? "text-[#087c1e]" : "text-[#777d87]"
            } ${floating ? "-mt-7" : ""}`}
            href={href}
            key={href}
          >
            <span
              className={`grid place-items-center ${
                floating
                  ? "h-[54px] w-[54px] rounded-full bg-[#05b96e] text-xl text-white shadow-[0_10px_20px_rgba(5,185,110,.28)]"
                  : "text-[20px]"
              }`}
            >
              <Icon aria-hidden="true" />
            </span>
            <span className={floating ? "text-[#111317]" : ""}>{name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function PageContent({ page, state }: { page: SellerPage; state: "fallback" | "live" | "loading" }) {
  return (
    <div className="h-[calc(100%-58px)] bg-white">
      <section className="h-full overflow-y-auto px-[clamp(18px,3.4vw,25px)] pb-[104px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TopArea state={state} />
        <PromoBanner page={page} />
        <QuickGrid />
        <MetricCards page={page} />
        <Checklist page={page} />
        <ItemList page={page} />
        <EmptyState page={page} />
      </section>
      <BottomNavigation />
    </div>
  );
}

export function SellerShell({ page }: { page: SellerPage }) {
  const live = useSellerLivePage(page);

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(255,214,83,.42),transparent_28rem),linear-gradient(180deg,#1a1710_0%,#fff_54%,#fff_100%)] p-[clamp(0px,1.8vw,18px)]">
      <section className="h-[min(100svh-12px,1134px)] w-[min(100%,544px)] overflow-hidden rounded-[clamp(0px,5.2vw,60px)] border-4 border-[#232323] bg-[#050505] p-[clamp(0px,1vw,16px)] shadow-[0_0_0_2px_#666,0_28px_90px_rgba(0,0,0,.34)]">
        <div className="relative h-full overflow-hidden rounded-[clamp(0px,4.4vw,48px)] bg-white text-[#0c0d10]">
          <DeviceStatusBar />
          <PageContent page={live.page} state={live.state} />
        </div>
      </section>
    </main>
  );
}
