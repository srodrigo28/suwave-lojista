"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaSave, FaStore } from "react-icons/fa";
import { AuthPhone } from "./auth-shell";
import { maskWhatsapp, onlyDigits } from "./masks";
import { getSellerBundle, getSellerSession, updateSellerProfile } from "./seller-api";

function Field({
  inputMode,
  label,
  onChange,
  placeholder,
  required,
  value,
}: {
  inputMode?: "text" | "tel";
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-[#4b5563]">{label}</span>
      <input
        className="h-12 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4 text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
    </label>
  );
}

export function ProfileFormScreen() {
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState("");
  const [storeName, setStoreName] = useState("");
  const [state, setState] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const session = getSellerSession();
    if (!session?.accessToken) {
      return;
    }

    let active = true;
    getSellerBundle(session.accessToken)
      .then(({ profile }) => {
        if (!active) {
          return;
        }
        setCity(profile.city ?? "");
        setDescription(profile.description ?? "");
        setStoreName(profile.store_name || profile.full_name);
        setState(profile.state ?? "");
        setWhatsapp(maskWhatsapp(profile.whatsapp ?? ""));
      })
      .catch((error) => {
        if (active) {
          setFeedback(error instanceof Error ? error.message : "Nao foi possivel carregar o perfil.");
        }
      })

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSellerSession();
    if (!session?.accessToken) {
      setFeedback("Entre com uma conta lojista para salvar a loja.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const profile = await updateSellerProfile(session.accessToken, {
        city,
        description,
        state: state.toUpperCase(),
        store_name: storeName,
        whatsapp: onlyDigits(whatsapp),
      });
      setStoreName(profile.store_name);
      setFeedback("Perfil da loja atualizado.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Nao foi possivel salvar o perfil.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPhone>
      <div className="h-[calc(100%-58px)] overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header className="flex h-[54px] items-center justify-between border-b border-[#f0f1f3] px-5">
          <Link aria-label="Voltar para dashboard" className="grid h-10 w-10 place-items-center text-[#111317]" href="/dashboard">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Perfil da loja</strong>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eefaf1] text-[#078323]">
            <FaStore aria-hidden="true" />
          </span>
        </header>

        <section className="grid gap-5 px-6 py-6">
          <div className="rounded-[8px] bg-[#102017] p-5 text-white">
            <span className="text-[11px] font-black uppercase tracking-normal text-[#9ff2c2]">Loja real</span>
            <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">
              {storeName || "Dados comerciais"}
            </h1>
            <p className="mt-2 text-sm font-bold leading-5 text-white/75">
              Nome, cidade e contato usados na operacao do lojista.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Field label="Nome da loja" onChange={setStoreName} placeholder="Mercado Suwave" required value={storeName} />
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Descricao</span>
              <textarea
                className="min-h-24 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4 py-3 text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Resumo curto da loja"
                value={description}
              />
            </label>
            <Field inputMode="tel" label="WhatsApp comercial" onChange={(value) => setWhatsapp(maskWhatsapp(value))} placeholder="(66) 99999-0000" value={whatsapp} />
            <div className="grid grid-cols-[1fr_86px] gap-3">
              <Field label="Cidade" onChange={setCity} placeholder="Sinop" value={city} />
              <Field label="UF" onChange={(value) => setState(value.slice(0, 2).toUpperCase())} placeholder="MT" value={state} />
            </div>

            {feedback ? (
              <p className="rounded-[8px] bg-[#eefaf1] px-3 py-2 text-xs font-black leading-5 text-[#087c1e]">
                {feedback}
              </p>
            ) : null}

            <button
              className="flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[#05b96e] text-sm font-black text-white shadow-[0_12px_20px_rgba(5,185,110,.22)] disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? <FaCheckCircle aria-hidden="true" /> : <FaSave aria-hidden="true" />}
              {submitting ? "Salvando..." : "Salvar perfil"}
            </button>
          </form>
        </section>
      </div>
    </AuthPhone>
  );
}
