"use client";

import { AuthPhone } from "../_components/auth-shell";
import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaLock } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { resetSellerPassword } from "../_components/seller-api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    if (password.length < 6) {
      setFeedback("Use uma senha com pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setFeedback("As senhas não coincidem.");
      return;
    }
    if (!token) {
      setFeedback("Link inválido. Solicite um novo link de redefinição.");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetSellerPassword(token, password);
      setSuccess(true);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível redefinir sua senha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <AuthPhone>
        <div className="h-[calc(100%-58px)] flex flex-col items-center justify-center gap-6 px-6 pb-8">
          <FaCheckCircle className="text-[56px] text-[#05b96e]" aria-hidden="true" />
          <div className="text-center">
            <h1 className="text-[24px] font-black text-[#111317]">Senha redefinida!</h1>
            <p className="mt-2 text-sm font-bold text-[#5a616b]">
              Sua senha foi alterada com sucesso. Entre com a nova senha para acessar sua loja.
            </p>
          </div>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#05b96e] text-sm font-black text-white no-underline shadow-[0_12px_20px_rgba(5,185,110,.22)]"
            href="/login"
          >
            Entrar agora
          </Link>
        </div>
      </AuthPhone>
    );
  }

  if (!token) {
    return (
      <AuthPhone>
        <div className="h-[calc(100%-58px)] flex flex-col items-center justify-center gap-6 px-6 pb-8">
          <div className="text-center">
            <h1 className="text-[22px] font-black text-[#111317]">Link inválido</h1>
            <p className="mt-2 text-sm font-bold text-[#5a616b]">
              Este link de redefinição é inválido ou já foi usado. Solicite um novo link.
            </p>
          </div>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#05b96e] text-sm font-black text-white no-underline"
            href="/forgot-password"
          >
            Solicitar novo link
          </Link>
        </div>
      </AuthPhone>
    );
  }

  return (
    <AuthPhone>
      <div className="h-[calc(100%-58px)] overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header className="flex h-[54px] items-center justify-between border-b border-[#f0f1f3] px-5">
          <Link aria-label="Voltar para login" className="grid h-10 w-10 place-items-center text-[#111317]" href="/login">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Nova senha</strong>
          <span className="h-10 w-10" />
        </header>

        <section className="grid gap-5 px-6 py-6">
          <header>
            <h2 className="text-[22px] font-black leading-tight text-[#111317]">Criar nova senha</h2>
            <p className="mt-2 text-sm font-bold leading-5 text-[#5a616b]">
              Escolha uma senha segura com pelo menos 6 caracteres.
            </p>
          </header>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Nova senha</span>
              <div className="flex h-12 items-center gap-3 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4">
                <FaLock className="text-[#078323]" aria-hidden="true" />
                <input
                  autoComplete="new-password"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Confirmar senha</span>
              <div className="flex h-12 items-center gap-3 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4">
                <FaLock className="text-[#078323]" aria-hidden="true" />
                <input
                  autoComplete="new-password"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder="Repita a senha"
                  required
                  type="password"
                  value={confirm}
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
              {isSubmitting ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        </section>
      </div>
    </AuthPhone>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
