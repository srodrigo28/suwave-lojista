"use client";

import { AuthPhone } from "../_components/auth-shell";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { forgotPasswordSchema, zodErrors } from "../_components/form-schemas";
import { forgotSellerPassword } from "../_components/seller-api";

export default function Page() {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"email", string>>>({});
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setFieldErrors({});
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      const errors = zodErrors<"email">(parsed.error);
      setFieldErrors(errors);
      toast.error(errors.email ?? "Informe um e-mail válido.");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotSellerPassword(parsed.data.email);
      toast.success("Enviamos as instruções para seu e-mail.");
      setSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível enviar o link agora.";
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
          <FaCheckCircle className="text-[56px] text-[#05b96e]" aria-hidden="true" />
          <div className="text-center">
            <h1 className="text-[24px] font-black text-[#111317]">E-mail enviado!</h1>
            <p className="mt-2 text-sm font-bold text-[#5a616b]">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha. O link expira em 24 horas.
            </p>
          </div>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#05b96e] text-sm font-black text-white no-underline shadow-[0_12px_20px_rgba(5,185,110,.22)]"
            href="/login"
          >
            Voltar ao login
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
          <strong className="text-sm font-black">Recuperar senha</strong>
          <span className="h-10 w-10" />
        </header>

        <section className="grid gap-5 px-6 py-6">
          <header>
            <h2 className="text-[22px] font-black leading-tight text-[#111317]">Esqueceu a senha?</h2>
            <p className="mt-2 text-sm font-bold leading-5 text-[#5a616b]">
              Informe o e-mail da sua conta e enviaremos as instruções para criar uma nova senha.
            </p>
          </header>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">E-mail</span>
              <div className={`flex h-12 items-center gap-3 rounded-[12px] border bg-[#f8fafb] px-4 ${fieldErrors.email ? "border-[#ef4444]" : "border-[#e6e9ef]"}`}>
                <FaEnvelope className="text-[#078323]" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  type="email"
                  value={email}
                />
              </div>
              {fieldErrors.email ? <small className="text-xs font-bold text-[#dc2626]">{fieldErrors.email}</small> : null}
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
              {isSubmitting ? "Enviando..." : "Enviar instruções"}
            </button>
          </form>
        </section>
      </div>
    </AuthPhone>
  );
}
