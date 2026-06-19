"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelope,
  FaLock,
  FaWhatsapp,
} from "react-icons/fa";
import { maskWhatsapp } from "./masks";
import {
  checkSellerAccountAvailability,
  linkSellerRole,
  loginSeller,
  registerSeller,
  saveSellerSession,
} from "./seller-api";
import { SuwaveSplash, SuwaveWordmark } from "./suwave-wordmark";

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

export function AuthPhone({ children, splash }: { children: ReactNode; splash?: ReactNode }) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-white p-[clamp(0px,1.8vw,18px)]">
      <section className="h-[min(100svh-12px,1134px)] w-[min(100%,544px)] overflow-hidden rounded-[clamp(0px,5.2vw,60px)] border-4 border-[#232323] bg-[#050505] p-[clamp(0px,1vw,16px)] shadow-[0_0_0_2px_#666,0_28px_90px_rgba(0,0,0,.34)]">
        <div className="relative h-full overflow-hidden rounded-[clamp(0px,4.4vw,48px)] bg-white text-[#0c0d10]">
          <DeviceStatusBar />
          {children}
          {splash}
        </div>
      </section>
    </main>
  );
}

function BrandSplash() {
  return (
    <section className="grid min-h-[322px] content-center overflow-hidden bg-white px-7 pb-4 pt-10 text-[#050505]">
      <div className="grid justify-items-center gap-3">
        <SuwaveWordmark subtitle="LOGISTA" />
        <p className="max-w-[280px] text-center text-[13px] font-bold leading-5 text-[#68707b]">
          Gestão rápida para vender, acompanhar pedidos e controlar sua loja.
        </p>
      </div>
    </section>
  );
}

function LoginSplashOverlay() {
  return <SuwaveSplash subtitle="LOGISTA" />;
}

export function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setIsSubmitting(true);

    try {
      await loginSeller(identifier, password);
      router.push("/dashboard");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Nao foi possivel entrar agora.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPhone splash={<LoginSplashOverlay />}>
      <div className="h-[calc(100%-58px)] overflow-y-auto bg-white pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <BrandSplash />
        <section className="-mt-7 grid gap-5 rounded-t-[32px] bg-white px-6 pb-8 pt-7">
          <header>
            <span className="text-[11px] font-black uppercase tracking-normal text-[#078323]">
              Acesso do lojista
            </span>
            <h2 className="mt-2 text-[26px] font-black leading-tight tracking-normal text-[#111317]">
              Entre na sua loja
            </h2>
            <p className="mt-2 text-sm font-bold leading-5 text-[#5a616b]">
              Use o e-mail ou WhatsApp cadastrado para acessar o painel.
            </p>
          </header>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">E-mail ou WhatsApp</span>
              <div className="flex h-12 items-center gap-3 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4">
                <FaEnvelope className="text-[#078323]" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="vendedor@suwave.local"
                  required
                  value={identifier}
                />
              </div>
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Senha</span>
              <div className="flex h-12 items-center gap-3 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4">
                <FaLock className="text-[#078323]" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Sua senha"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </label>

            {feedback ? (
              <p className="rounded-[8px] bg-[#fff7ed] px-3 py-2 text-xs font-black leading-5 text-[#9a3412]">
                {feedback}
              </p>
            ) : null}

            <button
              className="mt-2 flex h-12 items-center justify-center rounded-[12px] bg-[#05b96e] text-sm font-black text-white no-underline shadow-[0_12px_20px_rgba(5,185,110,.22)]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="grid gap-3">
            <Link className="text-center text-xs font-black text-[#078323] no-underline" href="/forgot-password">
              Esqueci minha senha
            </Link>
            <Link
              className="flex h-11 items-center justify-center rounded-[12px] border border-[#e6e9ef] text-sm font-black text-[#111317] no-underline"
              href="/register"
            >
              Criar conta lojista
            </Link>
          </div>
        </section>
      </div>
    </AuthPhone>
  );
}

const registerSteps = [
  "Dados do responsável",
  "Nome e contato da loja",
  "Cidade de atendimento",
  "Categorias e horários",
];

export function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    const onlyDigits = (v: string) => v.replace(/\D/g, "");
    const wa = onlyDigits(whatsapp);
    if (wa.length < 10) {
      setFeedback("Informe um WhatsApp com DDD.");
      return;
    }
    if (password.length < 6) {
      setFeedback("Use uma senha com pelo menos 6 caracteres.");
      return;
    }

    setIsSubmitting(true);
    try {
      const availability = await checkSellerAccountAvailability({
        email: email.trim().toLowerCase(),
        whatsapp: wa,
      });

      const emailConflict = availability.conflicts.email;
      const waConflict = availability.conflicts.whatsapp;

      if (waConflict?.exists && !waConflict.same_account) {
        setFeedback("WhatsApp já cadastrado em outra conta SUWAVE. Use a conta existente ou outro número.");
        return;
      }

      let session;

      if (emailConflict?.exists) {
        try {
          session = await loginSeller(email.trim().toLowerCase(), password);
          await linkSellerRole(session.accessToken);
        } catch {
          setFeedback("Este e-mail já existe em outro app SUWAVE. Informe a senha dessa conta ou recupere sua senha.");
          return;
        }
      } else {
        session = await registerSeller({
          email: email.trim().toLowerCase(),
          full_name: fullName.trim(),
          password,
          whatsapp: wa,
        });
        await linkSellerRole(session.accessToken);
      }

      router.push("/store/profile");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível criar a conta agora.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPhone>
      <div className="h-[calc(100%-58px)] overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header className="flex h-[54px] items-center justify-between border-b border-[#f0f1f3] px-5">
          <Link aria-label="Voltar para login" className="grid h-10 w-10 place-items-center text-[#111317]" href="/login">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Cadastro lojista</strong>
          <span className="h-10 w-10" />
        </header>

        <section className="grid gap-5 px-6 py-6">
          <div className="rounded-[8px] bg-[#102017] p-5 text-white">
            <span className="text-[11px] font-black uppercase tracking-normal text-[#9ff2c2]">
              SUWAVE LOGISTA
            </span>
            <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">
              Prepare sua loja para vender
            </h1>
            <p className="mt-2 text-sm font-bold leading-5 text-white/75">
              Crie uma conta comercial, publique produtos e receba pedidos da sua cidade.
            </p>
          </div>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Seu nome completo</span>
              <input
                className="h-12 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4 text-sm font-bold outline-0"
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Maria da Silva"
                required
                value={fullName}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">WhatsApp comercial</span>
              <div className="flex h-12 items-center gap-3 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4">
                <FaWhatsapp className="text-[#078323]" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold outline-0"
                  inputMode="tel"
                  onChange={(e) => setWhatsapp(maskWhatsapp(e.target.value))}
                  placeholder="(66) 99999-0000"
                  required
                  value={whatsapp}
                />
              </div>
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">E-mail de acesso</span>
              <div className="flex h-12 items-center gap-3 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4">
                <FaEnvelope className="text-[#078323]" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold outline-0"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="loja@suwave.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Senha</span>
              <div className="flex h-12 items-center gap-3 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4">
                <FaLock className="text-[#078323]" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold outline-0"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </label>

            {feedback ? (
              <p className="rounded-[8px] bg-[#fff7ed] px-3 py-2 text-xs font-black leading-5 text-[#9a3412]">
                {feedback}
              </p>
            ) : null}

            <button
              className="mt-2 flex h-12 items-center justify-center rounded-[12px] bg-[#05b96e] text-sm font-black text-white no-underline shadow-[0_12px_20px_rgba(5,185,110,.22)]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Criando conta..." : "Continuar cadastro"}
            </button>
          </form>

          <section className="rounded-[8px] border border-[#eceef2] bg-white p-3">
            <h2 className="mb-3 text-[15px] font-black">Próximos passos</h2>
            <div className="grid gap-2">
              {registerSteps.map((step, index) => (
                <div className="grid grid-cols-[32px_1fr] items-center gap-3 rounded-[7px] bg-[#f8fafb] p-3" key={step}>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eefaf1] text-[#078323]">
                    {index === 0 ? <FaCheckCircle aria-hidden="true" /> : index + 1}
                  </span>
                  <strong className="text-sm font-extrabold text-[#111317]">{step}</strong>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </AuthPhone>
  );
}
