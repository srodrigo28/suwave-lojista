"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Info, Mail } from "lucide-react";
import { toast } from "react-toastify";

function SuwaveLogo() {
  return (
    <Link aria-label="Suwave logista" className="inline-flex items-end text-inherit no-underline" href="/">
      <span className="text-[46px] font-black leading-none tracking-normal text-[#050505] sm:text-[58px]">
        SU
        <span className="text-[#f6bd14]">W</span>
        AVE
      </span>
    </Link>
  );
}

function EmailIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto mt-16 grid h-[190px] w-[230px] place-items-center">
      <span className="absolute h-[176px] w-[176px] rounded-full bg-[#fff1cc]" />
      <span className="absolute bottom-8 h-[78px] w-[148px] rounded-[6px] border-[3px] border-[#8b8f96] bg-white">
        <span className="absolute left-[-2px] top-[-1px] h-[74px] w-[74px] origin-top-right rotate-[-42deg] border-b-[3px] border-r-[3px] border-[#8b8f96]" />
        <span className="absolute right-[-2px] top-[-1px] h-[74px] w-[74px] origin-top-left rotate-[42deg] border-b-[3px] border-l-[3px] border-[#8b8f96]" />
      </span>
      <span className="absolute top-10 grid h-[96px] w-[96px] place-items-center rounded-[12px] bg-[#f6bd14] text-white shadow-[0_16px_24px_rgba(246,189,20,.24)] before:absolute before:bottom-[-19px] before:h-10 before:w-10 before:rotate-45 before:rounded-[5px] before:bg-[#f6bd14]">
        <span className="relative z-10 grid h-[58px] w-[58px] place-items-center rounded-full bg-white text-[#f6bd14]">
          <Check className="h-9 w-9" strokeWidth={3.2} />
        </span>
      </span>
      <span className="absolute right-3 top-12 h-9 w-10 border-r-[4px] border-t-[4px] border-[#f6bd14]" />
      <span className="absolute right-0 top-30 h-1 w-6 rotate-[14deg] rounded-full bg-[#f6bd14]" />
    </div>
  );
}

function getDraftEmail() {
  if (typeof window === "undefined") {
    return "seuemail@exemplo.com";
  }

  const rawDraft = window.localStorage.getItem("suwave-logista-commerce-draft");
  if (!rawDraft) {
    return "seuemail@exemplo.com";
  }

  try {
    const draft = JSON.parse(rawDraft) as { email?: string };
    return draft.email || "seuemail@exemplo.com";
  } catch {
    return "seuemail@exemplo.com";
  }
}

export function EmailConfirmationScreen() {
  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [email] = useState(() => getDraftEmail());
  const [code, setCode] = useState(["", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(596);
  const [feedback, setFeedback] = useState("");

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  function updateDigit(index: number, event: ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value.replace(/\D/g, "");
    if (rawValue.length > 1) {
      const pastedCode = rawValue.slice(0, 4).padEnd(4, "").split("");
      setCode(pastedCode);
      setFeedback("");
      inputRefs.current[Math.min(rawValue.length, 4) - 1]?.focus();
      return;
    }

    const digit = rawValue.slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);
    setFeedback("");

    if (digit && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function resendCode() {
    setSecondsLeft(596);
    setCode(["", "", "", ""]);
    setFeedback("Enviamos um novo código para o e-mail informado.");
    toast.success("Enviamos um novo código para o e-mail informado.");
    inputRefs.current[0]?.focus();
  }

  function continueFlow() {
    if (code.some((digit) => !digit)) {
      const message = "Digite os 4 dígitos para continuar.";
      setFeedback(message);
      toast.error(message);
      inputRefs.current[code.findIndex((digit) => !digit)]?.focus();
      return;
    }

    toast.success("E-mail confirmado com sucesso.");
    router.push("/register/waiting");
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-4 text-[#050505] sm:px-7 sm:py-6">
      <section className="mx-auto min-h-[calc(100vh-48px)] w-full max-w-[1080px] rounded-[16px] bg-white px-5 py-8 shadow-[0_22px_70px_rgba(0,0,0,.08)] sm:px-12 lg:px-[92px] lg:py-12">
        <div className="mx-auto flex min-h-[calc(100vh-144px)] max-w-[760px] flex-col">
          <header className="grid justify-items-center">
            <SuwaveLogo />
            <EmailIllustration />
            <h1 className="mt-8 text-center text-[34px] font-black leading-tight tracking-normal text-[#050505] sm:text-[48px]">
              Confirme seu e-mail
            </h1>
            <p className="mt-6 max-w-[620px] text-center text-[18px] font-semibold leading-8 text-[#6d7280]">
              Enviamos um código de verificação para o e-mail abaixo.
              <br />
              Digite o código para confirmar seu cadastro.
            </p>
          </header>

          <section className="mt-7 grid justify-items-center">
            <div className="flex items-center gap-5 text-[20px] font-black text-[#101010]">
              <Mail aria-hidden="true" className="h-8 w-8 text-[#f6bd14]" strokeWidth={2.3} />
              <span>{email}</span>
            </div>

            <p className="mt-12 text-center text-[20px] font-black text-[#101010]">Digite o código de 4 dígitos</p>
            <div className="mt-6 flex justify-center gap-5 sm:gap-7">
              {code.map((digit, index) => (
                <input
                  aria-label={`Dígito ${index + 1} do código`}
                  className="h-[76px] w-[76px] rounded-[13px] border-2 border-[#d9d9d9] bg-white text-center text-[34px] font-black text-[#101010] caret-[#101010] outline-none transition focus:border-[#f6bd14] focus:ring-2 focus:ring-[#f6bd14]/20 sm:h-[88px] sm:w-[88px]"
                  inputMode="numeric"
                  key={index}
                  maxLength={1}
                  onChange={(event) => updateDigit(index, event)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  value={digit}
                />
              ))}
            </div>

            <p className="mt-7 text-center text-[17px] font-semibold text-[#7a7d86]">
              O código expira em <strong className="font-black text-[#f6bd14]">{formattedTime}</strong>
            </p>
          </section>

          <section className="mx-auto mt-16 flex w-full max-w-[660px] gap-5 rounded-[13px] border border-[#e0e0e0] bg-[#fafafa] px-7 py-6 shadow-[0_8px_24px_rgba(0,0,0,.03)]">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#f6bd14] text-[#f6bd14]">
              <Info aria-hidden="true" className="h-7 w-7" strokeWidth={2.4} />
            </span>
            <div>
              <h2 className="text-[20px] font-black leading-tight text-[#101010]">Não recebeu o código?</h2>
              <p className="mt-3 text-[16px] font-semibold leading-6 text-[#777b85]">
                Verifique sua caixa de entrada, spam ou lixo eletrônico.
              </p>
              <button
                className="mt-3 text-[16px] font-black text-[#1565d8] transition hover:text-[#0b4ba8]"
                onClick={resendCode}
                type="button"
              >
                Reenviar código
              </button>
            </div>
          </section>

          {feedback ? (
            <p className="mx-auto mt-5 w-full max-w-[660px] rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] px-4 py-3 text-sm font-black text-[#9a3412]">
              {feedback}
            </p>
          ) : null}

          <footer className="mt-auto flex flex-col-reverse gap-3 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <Link
              className="inline-flex h-[66px] items-center justify-center gap-4 rounded-[9px] border border-[#cfd1d6] bg-white px-9 text-[20px] font-black text-[#111111] no-underline transition hover:bg-[#f7f7f7]"
              href="/register"
            >
              <ChevronLeft aria-hidden="true" className="h-6 w-6" strokeWidth={3} />
              Voltar
            </Link>
            <button
              className="inline-flex h-[66px] items-center justify-center gap-8 rounded-[9px] bg-[#f6bd14] px-12 text-[20px] font-black text-[#080808] transition hover:bg-[#e8ad06]"
              onClick={continueFlow}
              type="button"
            >
              Continuar
              <ChevronRight aria-hidden="true" className="h-6 w-6" strokeWidth={3} />
            </button>
          </footer>
        </div>
      </section>
    </main>
  );
}
