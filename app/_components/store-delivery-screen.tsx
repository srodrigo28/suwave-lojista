"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaMotorcycle, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthPhone } from "./auth-shell";
import { fetchAddressByCep } from "./cep";
import { deliverySchema, zodErrors } from "./form-schemas";
import { maskCep, maskCurrencyBRL } from "./masks";
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
      <span className="text-xs font-black text-ink-2">{label}</span>
      <input
        className="h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-bold text-ink outline-0 transition focus:border-brand focus:ring-2 focus:ring-brand/25 placeholder:text-ink-3"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

export function StoreDeliveryScreen() {
  const [cep, setCep] = useState("78550-000");
  const [addressPreview, setAddressPreview] = useState("Sinop - MT");
  const [delivery, setDelivery] = useState(defaultDelivery);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"cep" | "fee" | "radius", string>>>({});
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
          const message = error instanceof Error ? error.message : "Não foi possível carregar entrega.";
          setFeedback(message);
          toast.error(message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function updateDelivery(patch: Partial<SellerDeliverySettings>) {
    setDelivery((current) => ({ ...current, ...patch }));
  }

  async function handleCepChange(value: string) {
    const nextCep = maskCep(value);
    setCep(nextCep);
    setFieldErrors((current) => ({ ...current, cep: undefined }));

    if (nextCep.replace(/\D/g, "").length !== 8) {
      return;
    }

    try {
      const address = await fetchAddressByCep(nextCep);
      setAddressPreview(`${address.rua || "Endereço"} · ${address.cidade} - ${address.estado}`);
      toast.success("Endereço de entrega preenchido pelo CEP.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível consultar o CEP.";
      setFieldErrors((current) => ({ ...current, cep: message }));
      toast.error(message);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSellerSession();
    if (!session?.accessToken) {
      const message = "Entre com uma conta lojista para salvar entrega.";
      setFeedback(message);
      toast.error(message);
      return;
    }

    setFieldErrors({});
    const parsed = deliverySchema.safeParse({
      cep,
      fee: delivery.delivery_fee,
      radius: delivery.radius_km,
    });
    if (!parsed.success) {
      const errors = zodErrors<"cep" | "fee" | "radius">(parsed.error);
      setFieldErrors(errors);
      toast.error(Object.values(errors)[0] ?? "Revise as regras de entrega.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const settings = await updateSellerSettings(session.accessToken, { delivery });
      setDelivery(settings.delivery);
      setFeedback("Regras de entrega atualizadas.");
      toast.success("Regras de entrega atualizadas.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar entrega.";
      setFeedback(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPhone>
      <div className="h-[calc(100%-58px)] overflow-y-auto bg-surface [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header className="flex h-[54px] items-center justify-between border-b border-line px-5">
          <Link aria-label="Voltar para loja" className="grid h-10 w-10 place-items-center text-ink" href="/store/profile">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Entrega</strong>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-positive-soft text-positive-strong">
            <FaMotorcycle aria-hidden="true" />
          </span>
        </header>

        <section className="stagger grid gap-5 px-6 py-6">
          <div className="rounded-[8px] bg-forest p-5 text-white">
            <span className="text-[11px] font-black uppercase tracking-normal text-[#9ff2c2]">Logística real</span>
            <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">
              {delivery.enabled ? `${delivery.radius_km} km de raio` : "Entrega pausada"}
            </h1>
            <p className="mt-2 text-sm font-bold leading-5 text-white/75">
              Taxa {delivery.delivery_fee} · {delivery.average_time_minutes} min em média.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <section className="rounded-[8px] border border-line bg-surface p-3">
              <div className="grid gap-3">
                <label className="flex items-center justify-between gap-3 text-sm font-black text-ink">
                  Entrega ativa
                  <input
                    checked={delivery.enabled}
                    className="h-5 w-5 accent-positive"
                    onChange={(event) => updateDelivery({ enabled: event.target.checked })}
                    type="checkbox"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm font-black text-ink">
                  Retirada no balcao
                  <input
                    checked={delivery.pickup_enabled}
                    className="h-5 w-5 accent-positive"
                    onChange={(event) => updateDelivery({ pickup_enabled: event.target.checked })}
                    type="checkbox"
                  />
                </label>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2">
                <span className="text-xs font-black text-ink-2">CEP base</span>
                <input
                  className={`h-12 rounded-[12px] border bg-surface-2 px-4 text-sm font-bold text-ink outline-0 transition focus:border-brand focus:ring-2 focus:ring-brand/25 ${fieldErrors.cep ? "border-danger" : "border-line"}`}
                  onChange={(event) => handleCepChange(event.target.value)}
                  placeholder="78550-000"
                  value={cep}
                />
                {fieldErrors.cep ? <small className="text-xs font-bold text-danger">{fieldErrors.cep}</small> : null}
              </label>
              <div className="grid content-end rounded-[12px] border border-line bg-surface-2 px-4 py-3 text-xs font-black text-ink-2">
                {addressPreview}
              </div>
            </div>

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
              onChange={(value) => updateDelivery({ delivery_fee: maskCurrencyBRL(value) })}
              placeholder="R$ 7,90"
              value={delivery.delivery_fee}
            />
            <Field
              label="Pedido mínimo"
              onChange={(value) => updateDelivery({ minimum_order: maskCurrencyBRL(value) })}
              placeholder="R$ 20,00"
              value={delivery.minimum_order}
            />

            {feedback ? (
              <p className="rounded-[8px] bg-positive-soft px-3 py-2 text-xs font-black leading-5 text-positive-strong">
                {feedback}
              </p>
            ) : null}

            <button
              className="flex h-12 items-center justify-center gap-2 press rounded-[12px] bg-positive text-sm font-black text-white shadow-[0_12px_20px_rgba(5,185,110,.22)] disabled:opacity-60"
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
