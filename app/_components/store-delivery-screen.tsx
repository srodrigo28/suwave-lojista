"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaMotorcycle, FaSave } from "react-icons/fa";
import { AuthPhone } from "./auth-shell";
import {
  getSellerSession,
  getSellerSettings,
  updateSellerSettings,
  type SellerDeliverySettings,
} from "./seller-api";

const defaultDelivery: SellerDeliverySettings = {
  average_time_minutes: 45,
  delivery_fee: "R$ 7,90",
  enabled: true,
  minimum_order: "R$ 20,00",
  pickup_enabled: true,
  radius_km: 8,
};

function Field({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-[#4b5563]">{label}</span>
      <input
        className="h-12 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4 text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

export function StoreDeliveryScreen() {
  const [delivery, setDelivery] = useState(defaultDelivery);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const session = getSellerSession();
    if (!session?.accessToken) {
      return;
    }

    let active = true;
    getSellerSettings(session.accessToken)
      .then((settings) => {
        if (active) {
          setDelivery(settings.delivery);
        }
      })
      .catch((error) => {
        if (active) {
          setFeedback(error instanceof Error ? error.message : "Nao foi possivel carregar entrega.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function updateDelivery(patch: Partial<SellerDeliverySettings>) {
    setDelivery((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSellerSession();
    if (!session?.accessToken) {
      setFeedback("Entre com uma conta lojista para salvar entrega.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const settings = await updateSellerSettings(session.accessToken, { delivery });
      setDelivery(settings.delivery);
      setFeedback("Regras de entrega atualizadas.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Nao foi possivel salvar entrega.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPhone>
      <div className="h-[calc(100%-58px)] overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header className="flex h-[54px] items-center justify-between border-b border-[#f0f1f3] px-5">
          <Link aria-label="Voltar para loja" className="grid h-10 w-10 place-items-center text-[#111317]" href="/store/profile">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Entrega</strong>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eefaf1] text-[#078323]">
            <FaMotorcycle aria-hidden="true" />
          </span>
        </header>

        <section className="grid gap-5 px-6 py-6">
          <div className="rounded-[8px] bg-[#102017] p-5 text-white">
            <span className="text-[11px] font-black uppercase tracking-normal text-[#9ff2c2]">Logistica real</span>
            <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">
              {delivery.enabled ? `${delivery.radius_km} km de raio` : "Entrega pausada"}
            </h1>
            <p className="mt-2 text-sm font-bold leading-5 text-white/75">
              Taxa {delivery.delivery_fee} · {delivery.average_time_minutes} min em media.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <section className="rounded-[8px] border border-[#eceef2] bg-white p-3">
              <div className="grid gap-3">
                <label className="flex items-center justify-between gap-3 text-sm font-black text-[#111317]">
                  Entrega ativa
                  <input
                    checked={delivery.enabled}
                    className="h-5 w-5 accent-[#05b96e]"
                    onChange={(event) => updateDelivery({ enabled: event.target.checked })}
                    type="checkbox"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm font-black text-[#111317]">
                  Retirada no balcao
                  <input
                    checked={delivery.pickup_enabled}
                    className="h-5 w-5 accent-[#05b96e]"
                    onChange={(event) => updateDelivery({ pickup_enabled: event.target.checked })}
                    type="checkbox"
                  />
                </label>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Raio km"
                onChange={(value) => updateDelivery({ radius_km: Number(value || 0) })}
                type="number"
                value={String(delivery.radius_km)}
              />
              <Field
                label="Tempo min"
                onChange={(value) => updateDelivery({ average_time_minutes: Number(value || 0) })}
                type="number"
                value={String(delivery.average_time_minutes)}
              />
            </div>
            <Field
              label="Taxa de entrega"
              onChange={(value) => updateDelivery({ delivery_fee: value })}
              placeholder="R$ 7,90"
              value={delivery.delivery_fee}
            />
            <Field
              label="Pedido minimo"
              onChange={(value) => updateDelivery({ minimum_order: value })}
              placeholder="R$ 20,00"
              value={delivery.minimum_order}
            />

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
              {submitting ? "Salvando..." : "Salvar entrega"}
            </button>
          </form>
        </section>
      </div>
    </AuthPhone>
  );
}
