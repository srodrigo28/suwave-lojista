"use client";

import { AuthPhone } from "../_components/auth-shell";
import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaLock } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { resetPasswordSchema, zodErrors } from "../_components/form-schemas";
import { resetSellerPassword } from "../_components/seller-api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"confirm" | "password" | "token", string>>>({});
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setFieldErrors({});
    const parsed = resetPasswordSchema.safeParse({ confirm, password, token });
    if (!parsed.success) {
      const errors = zodErrors<"confirm" | "password" | "token">(parsed.error);
      setFieldErrors(errors);
      toast.error(Object.values(errors)[0] ?? "Revise os campos da nova senha.");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetSellerPassword(parsed.data.token, parsed.data.password);
      toast.success("Senha redefinida com sucesso.");
      setSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível redefinir sua senha.";
      setFeedback(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <AuthPhone>
        <div className="h-[calc(100%-58px)] flex flex-col items-center justify-center gap-6 px-6 pb-8">
          <FaCheckCircle className="text-[56px] text-positive" aria-hidden="true" />
          <div className="text-center">
            <h1 className="text-[24px] font-black text-ink">Senha redefinida!</h1>
            <p className="mt-2 text-sm font-bold text-ink-3">
              Sua senha foi alterada com sucesso. Entre com a nova senha para acessar sua loja.
            </p>
          </div>
          <Link
            className="flex h-12 w-full items-center justify-center press rounded-[12px] bg-positive text-sm font-black text-white no-underline shadow-[0_12px_20px_rgba(5,185,110,.22)]"
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
            <h1 className="text-[22px] font-black text-ink">Link inválido</h1>
            <p className="mt-2 text-sm font-bold text-ink-3">
              Este link de redefinição é inválido ou já foi usado. Solicite um novo link.
            </p>
          </div>
          <Link
            className="flex h-12 w-full items-center justify-center press rounded-[12px] bg-positive text-sm font-black text-white no-underline"
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
      <div className="h-[calc(100%-58px)] overflow-y-auto bg-surface [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header className="flex h-[54px] items-center justify-between border-b border-line px-5">
          <Link aria-label="Voltar para login" className="grid h-10 w-10 place-items-center text-ink" href="/login">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Nova senha</strong>
          <span className="h-10 w-10" />
        </header>

        <section className="stagger grid gap-5 px-6 py-6">
          <header>
            <h2 className="text-[22px] font-black leading-tight text-ink">Criar nova senha</h2>
            <p className="mt-2 text-sm font-bold leading-5 text-ink-3">
              Escolha uma senha segura com pelo menos 6 caracteres.
            </p>
          </header>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-black text-ink-2">Nova senha</span>
              <div className={`flex h-12 items-center gap-3 rounded-[12px] border bg-surface-2 px-4 ${fieldErrors.password ? "border-danger" : "border-line"}`}>
                <FaLock className="text-positive-strong" aria-hidden="true" />
                <input
                  autoComplete="new-password"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-ink outline-0 transition focus:border-brand focus:ring-2 focus:ring-brand/25 placeholder:text-ink-3"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  type="password"
                  value={password}
                />
              </div>
              {fieldErrors.password ? <small className="text-xs font-bold text-danger">{fieldErrors.password}</small> : null}
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-ink-2">Confirmar senha</span>
              <div className={`flex h-12 items-center gap-3 rounded-[12px] border bg-surface-2 px-4 ${fieldErrors.confirm ? "border-danger" : "border-line"}`}>
                <FaLock className="text-positive-strong" aria-hidden="true" />
                <input
                  autoComplete="new-password"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-ink outline-0 transition focus:border-brand focus:ring-2 focus:ring-brand/25 placeholder:text-ink-3"
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder="Repita a senha"
                  type="password"
                  value={confirm}
                />
              </div>
              {fieldErrors.confirm ? <small className="text-xs font-bold text-danger">{fieldErrors.confirm}</small> : null}
            </label>

            {feedback ? (
              <p className="rounded-[8px] bg-[#fff7ed] px-3 py-2 text-xs font-black leading-5 text-[#9a3412]">
                {feedback}
              </p>
            ) : null}

            <button
              className="mt-2 flex h-12 items-center justify-center press rounded-[12px] bg-positive text-sm font-black text-white no-underline shadow-[0_12px_20px_rgba(5,185,110,.22)]"
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
