import Image from "next/image";
import Link from "next/link";
import {
  FaCheck,
  FaChevronDown,
  FaMapMarkerAlt,
  FaStore,
  FaWhatsapp,
} from "react-icons/fa";

const benefits = [
  "Mais visibilidade para o seu comércio",
  "Receba pedidos online",
  "Gestão de cardápio e entregas",
  "Relatórios e métricas de vendas",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f4f2] text-[#101010]">
      <section className="mx-auto min-h-screen w-full max-w-[1480px] bg-white shadow-[0_22px_80px_rgba(0,0,0,0.08)]">
        <header className="relative z-20 flex min-h-[110px] items-center gap-8 border-b border-[#ececec] bg-white px-7 lg:px-16">
          <Link aria-label="Suwave logista" className="shrink-0 text-inherit no-underline" href="/">
            <span className="flex items-end text-4xl font-black leading-none tracking-normal md:text-5xl">
              <span>SU</span>
              <span className="text-[#f6bd14]">W</span>
              <span>AVE</span>
            </span>
          </Link>

          <nav className="ml-auto hidden flex-1 items-center justify-end gap-8 text-base font-medium text-[#171717] lg:flex">
            <Link className="flex items-center gap-3 text-inherit no-underline" href="/store/profile">
              <FaMapMarkerAlt aria-hidden="true" className="text-3xl text-[#f6bd14]" />
              <span className="leading-snug">
                Confira se sua cidade
                <br />
                está disponível na Suwave
              </span>
              <FaChevronDown aria-hidden="true" className="text-[#f6bd14]" />
            </Link>

            <Link className="flex items-center gap-2 text-inherit no-underline" href="/dashboard">
              Sobre a Suwave
              <FaChevronDown aria-hidden="true" className="text-[#f6bd14]" />
            </Link>

            <Link
              aria-label="Atendimento pelo WhatsApp"
              className="grid h-12 w-12 place-items-center text-4xl text-[#25d366] no-underline"
              href="/login"
            >
              <FaWhatsapp aria-hidden="true" />
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <Link
              className="hidden h-12 items-center justify-center rounded-[8px] border border-[#222222] px-7 text-base font-bold text-[#111111] no-underline transition hover:bg-[#111111] hover:text-white sm:inline-flex"
              href="/login"
            >
              Entrar
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#f6bd14] px-6 text-base font-bold text-[#111111] no-underline transition hover:bg-[#e4aa08] md:px-8"
              href="/register"
            >
              Cadastrar comércio
            </Link>
          </div>
        </header>

        <section className="relative isolate min-h-[calc(100vh-110px)] overflow-hidden">
          <Image
            alt="Comerciante sorrindo em uma cafeteria moderna"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-[58%_center]"
            fill
            priority
            sizes="100vw"
            src="/logista/merchant-hero.png"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.94)_30%,rgba(255,255,255,0.2)_52%,rgba(255,255,255,0)_100%)] lg:bg-none" />

          <div className="flex min-h-[calc(100vh-110px)] max-w-[720px] flex-col justify-center px-7 py-12 md:px-16 lg:max-w-[660px] lg:py-16">
            <h1 className="text-5xl font-black leading-[1.05] tracking-normal text-[#080808] md:text-6xl lg:text-7xl">
              Faça parte da <span className="text-[#f6bd14]">Suwave</span> e aumente suas vendas
            </h1>

            <p className="mt-7 max-w-[550px] text-xl font-medium leading-8 text-[#575757] md:text-2xl md:leading-9">
              Conecte seu comércio a milhares de clientes em um só app. É prático, rápido e seguro.
            </p>

            <ul className="mt-8 grid gap-4 text-lg font-semibold text-[#171717] md:text-xl">
              {benefits.map((benefit) => (
                <li className="flex items-center gap-4" key={benefit}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[#f6bd14] text-sm text-[#f6bd14]">
                    <FaCheck aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-[52px] min-h-[52px] items-center justify-center rounded-[8px] bg-[#f6bd14] px-7 text-base font-black text-[#111111] no-underline transition hover:bg-[#e4aa08]"
                href="/register"
              >
                Cadastrar comércio
              </Link>
              <Link
                className="inline-flex h-[52px] min-h-[52px] items-center justify-center rounded-[8px] border border-[#222222] bg-white/70 px-7 text-base font-black text-[#111111] no-underline backdrop-blur transition hover:bg-[#111111] hover:text-white"
                href="/login"
              >
                Entrar
              </Link>
            </div>

            <article className="mt-10 max-w-[500px] rounded-[8px] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <div className="grid grid-cols-[76px_1fr] gap-5">
                <span className="grid h-[76px] w-[76px] place-items-center text-6xl text-[#f6bd14]">
                  <FaStore aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-2xl font-black leading-snug tracking-normal text-[#111111]">
                    Tudo o que você precisa em um só lugar
                  </h2>
                  <p className="mt-2 text-base font-medium leading-7 text-[#666666]">
                    Gerencie pedidos, entregas, cardápio, cupons e clientes de forma simples.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
