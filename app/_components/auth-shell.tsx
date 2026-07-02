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
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { loginSchema, registerSchema, zodErrors } from "./form-schemas";
import { maskWhatsapp } from "./masks";
import {
  checkSellerAccountAvailability,
  linkSellerCredential,
  linkSellerRole,
  loginSeller,
  registerSeller,
} from "./seller-api";

function DeviceStatusBar() {
  return (
    <div className="relative z-10 grid h-[58px] grid-cols-[1fr_138px_1fr] items-center bg-surface px-[22px] pt-3 text-[17px] font-bold">
      <strong className="leading-none tracking-normal">9:41</strong>
      <div className="mx-auto flex h-[38px] w-[124px] items-center justify-end rounded-full bg-black pr-4">
        <span className="h-[5px] w-[5px] rounded-full bg-[#082338] shadow-[0_0_9px_#1598ff]" />
      </div>
      <div className="flex items-center justify-end gap-[9px]">
        <span className="h-4 w-5 bg-ink [clip-path:polygon(0_100%,0_68%,18%_68%,18%_100%,28%_100%,28%_48%,46%_48%,46%_100%,56%_100%,56%_25%,74%_25%,74%_100%,84%_100%,84%_0,100%_0,100%_100%)]" />
        <span className="relative h-[15px] w-[18px] translate-y-[3px] rounded-full border-t-4 border-ink before:absolute before:inset-x-[3px] before:top-[3px] before:rounded-full before:border-t-[3px] before:border-ink after:absolute after:left-[7px] after:top-[9px] after:h-[3px] after:w-[3px] after:rounded-full after:bg-ink" />
        <span className="relative h-3 w-6 rounded-[3px] border-2 border-ink before:absolute before:inset-0.5 before:rounded-[1px] before:bg-ink after:absolute after:-right-[5px] after:top-0.5 after:h-[5px] after:w-0.5 after:rounded-r-sm after:bg-ink" />
      </div>
    </div>
  );
}

export function AuthPhone({ children, splash }: { children: ReactNode; splash?: ReactNode }) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-[clamp(0px,1.8vw,18px)]">
      <section className="h-[min(100svh-12px,1134px)] w-[min(100%,544px)] overflow-hidden rounded-[clamp(0px,5.2vw,60px)] border-4 border-[#232323] bg-[#050505] p-[clamp(0px,1vw,16px)] shadow-[0_0_0_2px_#666,0_28px_90px_rgba(0,0,0,.34)]">
        <div className="relative h-full overflow-hidden rounded-[clamp(0px,4.4vw,48px)] bg-surface text-ink">
          <DeviceStatusBar />
          {children}
          {splash}
        </div>
      </section>
    </main>
  );
}

export function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"email" | "password", string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setFieldErrors({});
    const parsed = loginSchema.safeParse({ email: identifier, password });
    if (!parsed.success) {
      const errors = zodErrors<"email" | "password">(parsed.error);
      setFieldErrors(errors);
      toast.error(Object.values(errors)[0] ?? "Revise os campos para entrar.");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginSeller(parsed.data.email, parsed.data.password);
      toast.success("Login realizado com sucesso.");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível entrar agora.";
      setFeedback(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-3 px-6 text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col items-stretch pt-[106px]">
        <header className="text-center">
          <Link aria-label="Suwave logista" className="anim-rise inline-grid justify-items-center text-inherit no-underline" href="/">
            <span className="text-[43px] font-black leading-none tracking-normal text-ink">
              SU<span className="text-brand">W</span>AVE
            </span>
            <span className="mt-2 text-[13px] font-black uppercase leading-none tracking-[0.58em] text-ink">
              LOGISTA
            </span>
          </Link>
          <h1 className="anim-rise anim-d1 mt-[43px] text-[22px] font-black leading-tight tracking-normal text-ink">
            Bem-vindo de volta!
          </h1>
          <p className="anim-rise anim-d2 mt-2 text-[15px] font-medium leading-6 text-ink-3">
            Faça login para acessar sua conta.
          </p>
        </header>

        <form className="anim-rise anim-d3 mt-[47px] grid gap-[27px]" onSubmit={handleSubmit}>
          <label className="grid gap-3">
            <span className="text-[14px] font-black leading-none text-ink">E-mail</span>
            <span className={`flex h-[56px] items-center gap-[18px] rounded-[8px] border bg-transparent px-[15px] text-ink-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25 ${fieldErrors.email ? "border-danger" : "border-line-strong"}`}>
              <FaEnvelope aria-hidden="true" className="h-[21px] w-[21px] shrink-0" />
              <input
                className="min-w-0 flex-1 border-0 bg-transparent text-[16px] font-semibold text-ink outline-0 placeholder:text-ink-3"
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Digite seu e-mail"
                type="email"
                value={identifier}
              />
            </span>
            {fieldErrors.email ? <small className="text-xs font-bold text-danger">{fieldErrors.email}</small> : null}
          </label>

          <label className="grid gap-3">
            <span className="text-[14px] font-black leading-none text-ink">Senha</span>
            <span className={`flex h-[56px] items-center gap-[18px] rounded-[8px] border bg-transparent px-[15px] text-ink-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25 ${fieldErrors.password ? "border-danger" : "border-line-strong"}`}>
              <FaLock aria-hidden="true" className="h-[21px] w-[21px] shrink-0" />
              <input
                className="min-w-0 flex-1 border-0 bg-transparent text-[16px] font-semibold text-ink outline-0 placeholder:text-ink-3"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-3 transition hover:bg-surface-2"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="h-[21px] w-[21px]" strokeWidth={2.1} />
                ) : (
                  <Eye aria-hidden="true" className="h-[21px] w-[21px]" strokeWidth={2.1} />
                )}
              </button>
            </span>
            {fieldErrors.password ? <small className="text-xs font-bold text-danger">{fieldErrors.password}</small> : null}
          </label>

          <Link
            className="-mt-1 justify-self-end text-[14px] font-black leading-none text-brand no-underline transition hover:text-brand-strong hover:underline hover:underline-offset-4"
            href="/forgot-password"
          >
            Esqueceu sua senha?
          </Link>

          {feedback ? (
            <p className="-my-2 rounded-[8px] bg-[#fff7ed] px-3 py-2 text-xs font-black leading-5 text-[#9a3412]">
              {feedback}
            </p>
          ) : null}

          <button
            className="press mt-[3px] flex h-[63px] items-center justify-center rounded-[8px] bg-brand px-8 text-[25px] font-black text-[#050505] shadow-none hover:bg-brand-strong hover:shadow-[0_12px_28px_rgba(255,176,0,.35)] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link
          className="press anim-rise anim-d4 mt-[18px] flex h-[56px] items-center justify-center rounded-[8px] border border-brand bg-transparent px-8 text-[19px] font-bold text-ink no-underline hover:bg-brand-soft"
          href="/register"
        >
          Cadastrar senha
        </Link>
      </section>
    </main>
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
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"email" | "fullName" | "password" | "whatsapp", string>>
  >({});
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setFieldErrors({});
    const parsed = registerSchema.safeParse({ email, fullName, password, whatsapp });
    if (!parsed.success) {
      const errors = zodErrors<"email" | "fullName" | "password" | "whatsapp">(parsed.error);
      setFieldErrors(errors);
      toast.error(Object.values(errors)[0] ?? "Revise os campos do cadastro.");
      return;
    }

    setIsSubmitting(true);
    try {
      const availability = await checkSellerAccountAvailability({
        email: parsed.data.email,
        whatsapp: parsed.data.whatsapp,
      });

      const emailConflict = availability.conflicts.email;
      const waConflict = availability.conflicts.whatsapp;

      if (waConflict?.exists && !waConflict.same_account) {
        const message = "WhatsApp já cadastrado em outra conta SUWAVE. Use a conta existente ou outro número.";
        setFeedback(message);
        toast.error(message);
        return;
      }

      let session;

      if (emailConflict?.exists) {
        if (emailConflict.has_seller_role) {
          const message = emailConflict.message ?? "Este e-mail já possui cadastro de lojista. Faça login para acessar sua loja.";
          setFeedback(message);
          toast.error(message);
          router.push("/login");
          return;
        }

        try {
          session = await linkSellerCredential(parsed.data.email, parsed.data.password);
          toast.info(emailConflict.message ?? "Conta SUWAVE encontrada. Criamos o acesso de lojista nesta mesma conta.");
        } catch {
          const message = "Este e-mail já existe na SUWAVE. Informe a senha dessa conta ou recupere sua senha.";
          setFeedback(message);
          toast.error(message);
          return;
        }
      } else {
        session = await registerSeller({
          email: parsed.data.email,
          full_name: parsed.data.fullName,
          password: parsed.data.password,
          whatsapp: parsed.data.whatsapp,
        });
        await linkSellerRole(session.accessToken);
      }

      try {
        window.localStorage.setItem("suwave:logista:draft-email", parsed.data.email);
      } catch {
        // Local storage pode estar indisponivel em navegadores restritos.
      }
      toast.success("Cadastro validado com sucesso.");
      router.push("/store/profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível criar a conta agora.";
      setFeedback(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPhone>
      <div className="h-[calc(100%-58px)] overflow-y-auto bg-surface [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header className="flex h-[54px] items-center justify-between border-b border-line px-5">
          <Link aria-label="Voltar para login" className="grid h-10 w-10 place-items-center text-ink" href="/login">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Cadastro lojista</strong>
          <span className="h-10 w-10" />
        </header>

        <section className="stagger grid gap-5 px-6 py-6">
          <div className="rounded-[8px] bg-forest p-5 text-white">
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
              <span className="text-xs font-black text-ink-2">Seu nome completo</span>
              <input
                className={`h-12 rounded-[12px] border bg-surface-2 px-4 text-sm font-bold outline-0 transition focus:border-brand focus:ring-2 focus:ring-brand/25 ${fieldErrors.fullName ? "border-danger" : "border-line"}`}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Maria da Silva"
                value={fullName}
              />
              {fieldErrors.fullName ? <small className="text-xs font-bold text-danger">{fieldErrors.fullName}</small> : null}
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-ink-2">WhatsApp comercial</span>
              <div className={`flex h-12 items-center gap-3 rounded-[12px] border bg-surface-2 px-4 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25 ${fieldErrors.whatsapp ? "border-danger" : "border-line"}`}>
                <FaWhatsapp className="text-positive-strong" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold outline-0"
                  inputMode="tel"
                  onChange={(e) => setWhatsapp(maskWhatsapp(e.target.value))}
                  placeholder="(66) 99999-0000"
                  value={whatsapp}
                />
              </div>
              {fieldErrors.whatsapp ? <small className="text-xs font-bold text-danger">{fieldErrors.whatsapp}</small> : null}
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-ink-2">E-mail de acesso</span>
              <div className={`flex h-12 items-center gap-3 rounded-[12px] border bg-surface-2 px-4 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25 ${fieldErrors.email ? "border-danger" : "border-line"}`}>
                <FaEnvelope className="text-positive-strong" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold outline-0"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="loja@suwave.com"
                  type="email"
                  value={email}
                />
              </div>
              {fieldErrors.email ? <small className="text-xs font-bold text-danger">{fieldErrors.email}</small> : null}
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-ink-2">Senha</span>
              <div className={`flex h-12 items-center gap-3 rounded-[12px] border bg-surface-2 px-4 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25 ${fieldErrors.password ? "border-danger" : "border-line"}`}>
                <FaLock className="text-positive-strong" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold outline-0"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  type="password"
                  value={password}
                />
              </div>
              {fieldErrors.password ? <small className="text-xs font-bold text-danger">{fieldErrors.password}</small> : null}
            </label>

            {feedback ? (
              <p className="rounded-[8px] bg-[#fff7ed] px-3 py-2 text-xs font-black leading-5 text-[#9a3412]">
                {feedback}
              </p>
            ) : null}

            <button
              className="press mt-2 flex h-12 items-center justify-center rounded-[12px] bg-positive text-sm font-black text-white no-underline shadow-[0_12px_20px_rgba(5,185,110,.22)] hover:bg-[#04a763] hover:shadow-[0_14px_26px_rgba(5,185,110,.32)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Criando conta..." : "Continuar cadastro"}
            </button>
          </form>

          <section className="rounded-[8px] border border-line bg-surface p-3">
            <h2 className="mb-3 text-[15px] font-black">Próximos passos</h2>
            <div className="grid gap-2">
              {registerSteps.map((step, index) => (
                <div className="grid grid-cols-[32px_1fr] items-center gap-3 rounded-[7px] bg-surface-2 p-3" key={step}>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-positive-soft text-positive-strong">
                    {index === 0 ? <FaCheckCircle aria-hidden="true" /> : index + 1}
                  </span>
                  <strong className="text-sm font-extrabold text-ink">{step}</strong>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </AuthPhone>
  );
}
