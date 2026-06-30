"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaClock, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthPhone } from "./auth-shell";
import { maskTime } from "./masks";
import { getSellerSession, getSellerSettings, updateSellerSettings, type SellerHour } from "./seller-api";

const dayLabels: Record<string, string> = {
  friday: "Sexta",
  monday: "Segunda",
  saturday: "Sábado",
  sunday: "Domingo",
  thursday: "Quinta",
  tuesday: "Terça",
  wednesday: "Quarta",
};

const defaultHours: SellerHour[] = [
  { closes_at: "18:00", day: "monday", enabled: true, opens_at: "08:00" },
  { closes_at: "18:00", day: "tuesday", enabled: true, opens_at: "08:00" },
  { closes_at: "18:00", day: "wednesday", enabled: true, opens_at: "08:00" },
  { closes_at: "18:00", day: "thursday", enabled: true, opens_at: "08:00" },
  { closes_at: "18:00", day: "friday", enabled: true, opens_at: "08:00" },
  { closes_at: "12:00", day: "saturday", enabled: true, opens_at: "08:00" },
  { closes_at: "00:00", day: "sunday", enabled: false, opens_at: "00:00" },
];

export function StoreHoursScreen() {
  const [feedback, setFeedback] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hours, setHours] = useState<SellerHour[]>(defaultHours);
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
          setHours(settings.hours.length ? settings.hours : defaultHours);
        }
      })
      .catch((error) => {
        if (active) {
          const message = error instanceof Error ? error.message : "Não foi possível carregar horários.";
          setFeedback(message);
          toast.error(message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function updateHour(day: string, patch: Partial<SellerHour>) {
    setHours((current) => current.map((item) => (item.day === day ? { ...item, ...patch } : item)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSellerSession();
    if (!session?.accessToken) {
      const message = "Entre com uma conta lojista para salvar horários.";
      setFeedback(message);
      toast.error(message);
      return;
    }

    const errors: Record<string, string> = {};
    for (const hour of hours) {
      if (!hour.enabled) {
        continue;
      }
      if (!/^\d{2}:\d{2}$/.test(hour.opens_at) || !/^\d{2}:\d{2}$/.test(hour.closes_at)) {
        errors[hour.day] = "Informe horários no formato HH:mm.";
      } else if (hour.closes_at <= hour.opens_at) {
        errors[hour.day] = "O fechamento deve ser maior que a abertura.";
      }
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      toast.error(Object.values(errors)[0]);
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const settings = await updateSellerSettings(session.accessToken, { hours });
      setHours(settings.hours);
      setFeedback("Horários atualizados.");
      toast.success("Horários atualizados.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar horários.";
      setFeedback(message);
      toast.error(message);
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
          <strong className="text-sm font-black">Horários</strong>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eefaf1] text-[#078323]">
            <FaClock aria-hidden="true" />
          </span>
        </header>

        <section className="grid gap-5 px-6 py-6">
          <div className="rounded-[8px] bg-[#102017] p-5 text-white">
            <span className="text-[11px] font-black uppercase tracking-normal text-[#9ff2c2]">Operação real</span>
            <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">Atendimento semanal</h1>
            <p className="mt-2 text-sm font-bold leading-5 text-white/75">
              Configure quando a loja recebe pedidos e aparece como aberta.
            </p>
          </div>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            {hours.map((hour) => (
              <section className="rounded-[8px] border border-[#eceef2] bg-white p-3" key={hour.day}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <strong className="text-sm font-black text-[#111317]">{dayLabels[hour.day] ?? hour.day}</strong>
                  <label className="flex items-center gap-2 text-xs font-black text-[#4b5563]">
                    <input
                      checked={hour.enabled}
                      className="h-4 w-4 accent-[#05b96e]"
                      onChange={(event) => updateHour(hour.day, { enabled: event.target.checked })}
                      type="checkbox"
                    />
                    Aberto
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-2">
                    <span className="text-xs font-black text-[#4b5563]">Abre</span>
                    <input
                      className="h-11 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-3 text-sm font-bold outline-0"
                      onChange={(event) => updateHour(hour.day, { opens_at: maskTime(event.target.value) })}
                      inputMode="numeric"
                      value={hour.opens_at}
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-black text-[#4b5563]">Fecha</span>
                    <input
                      className="h-11 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-3 text-sm font-bold outline-0"
                      onChange={(event) => updateHour(hour.day, { closes_at: maskTime(event.target.value) })}
                      inputMode="numeric"
                      value={hour.closes_at}
                    />
                  </label>
                </div>
                {fieldErrors[hour.day] ? (
                  <p className="mt-3 text-xs font-black text-[#dc2626]">{fieldErrors[hour.day]}</p>
                ) : null}
              </section>
            ))}

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
              {submitting ? "Salvando..." : "Salvar horários"}
            </button>
          </form>
        </section>
      </div>
    </AuthPhone>
  );
}
