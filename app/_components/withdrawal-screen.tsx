"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaMoneyBillWave, FaWallet } from "react-icons/fa";
import { AuthPhone } from "./auth-shell";
import {
  getSellerSession,
  getSellerWallet,
  listSellerWithdrawals,
  requestSellerWithdrawal,
  type SellerWallet,
  type SellerWithdrawal,
} from "./seller-api";

function centsFromMoney(value: string) {
  const normalized = value.replace(/[^\d,]/g, "").replace(",", ".");
  return Math.round(Number(normalized || "0") * 100);
}

function formatCents(cents: number) {
  return `R$ ${(cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const statusLabels: Record<string, string> = {
  approved: "Aprovado",
  paid: "Pago",
  pending_review: "Em analise",
  rejected: "Rejeitado",
};

export function WithdrawalScreen() {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState<"wallet" | "bank">("wallet");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [wallet, setWallet] = useState<SellerWallet | null>(null);
  const [withdrawals, setWithdrawals] = useState<SellerWithdrawal[]>([]);

  useEffect(() => {
    const session = getSellerSession();
    if (!session?.accessToken) {
      return;
    }

    let active = true;
    Promise.all([
      getSellerWallet(session.accessToken),
      listSellerWithdrawals(session.accessToken),
    ])
      .then(([walletData, withdrawalData]) => {
        if (active) {
          setWallet(walletData);
          setWithdrawals(withdrawalData);
        }
      })
      .catch((error) => {
        if (active) {
          setFeedback(error instanceof Error ? error.message : "Nao foi possivel carregar os saques.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSellerSession();
    if (!session?.accessToken) {
      setFeedback("Entre com uma conta lojista para solicitar saque.");
      return;
    }

    const amountCents = centsFromMoney(amount);
    setSubmitting(true);
    setFeedback("");

    try {
      const withdrawal = await requestSellerWithdrawal(session.accessToken, {
        amount_cents: amountCents,
        destination,
      });
      setWithdrawals((current) => [withdrawal, ...current]);
      setAmount("");
      const updatedWallet = await getSellerWallet(session.accessToken);
      setWallet(updatedWallet);
      setFeedback("Solicitacao de saque criada.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Nao foi possivel solicitar o saque.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPhone>
      <div className="h-[calc(100%-58px)] overflow-y-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header className="flex h-[54px] items-center justify-between border-b border-[#f0f1f3] px-5">
          <Link aria-label="Voltar para financeiro" className="grid h-10 w-10 place-items-center text-[#111317]" href="/finance">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Saques</strong>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eefaf1] text-[#078323]">
            <FaWallet aria-hidden="true" />
          </span>
        </header>

        <section className="grid gap-5 px-6 py-6">
          <div className="rounded-[8px] bg-[#102017] p-5 text-white">
            <span className="text-[11px] font-black uppercase tracking-normal text-[#9ff2c2]">Financeiro real</span>
            <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">
              {wallet?.affiliate.available_commission ?? "Comissao disponivel"}
            </h1>
            <p className="mt-2 text-sm font-bold leading-5 text-white/75">
              Minimo {wallet?.affiliate.min_withdrawal ?? "R$ 0,00"} · {wallet?.affiliate.status_label ?? "Conta nao carregada"}
            </p>
          </div>

          <form className="grid gap-4 rounded-[8px] border border-[#eceef2] bg-white p-3" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Valor do saque</span>
              <input
                className="h-12 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4 text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="R$ 50,00"
                required
                value={amount}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Destino</span>
              <select
                className="h-12 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4 text-sm font-bold text-[#111317] outline-0"
                onChange={(event) => setDestination(event.target.value as "wallet" | "bank")}
                value={destination}
              >
                {(wallet?.affiliate.withdrawal_options ?? [
                  { description: "", id: "wallet", label: "Carteira" },
                  { description: "", id: "bank", label: "Banco/Pix" },
                ]).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

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
              {submitting ? <FaCheckCircle aria-hidden="true" /> : <FaMoneyBillWave aria-hidden="true" />}
              {submitting ? "Enviando..." : "Solicitar saque"}
            </button>
          </form>

          <section className="rounded-[8px] border border-[#eceef2] bg-white p-3">
            <h2 className="mb-3 text-[15px] font-black">Historico de saques</h2>
            <div className="grid gap-0">
              {withdrawals.length ? (
                withdrawals.map((withdrawal, index) => (
                  <article
                    className={`grid min-h-[62px] grid-cols-[42px_1fr_auto] items-center gap-3 py-3 ${
                      index ? "border-t border-[#eef0f4]" : ""
                    }`}
                    key={withdrawal.id}
                  >
                    <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#eefaf1] text-[#078323]">
                      <FaMoneyBillWave aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <strong className="block truncate text-sm font-black text-[#111317]">
                        {formatCents(withdrawal.amount_cents)}
                      </strong>
                      <small className="block truncate text-[11px] font-bold text-[#6b7280]">
                        {withdrawal.destination === "bank" ? "Banco/Pix" : "Carteira"} · {statusLabels[withdrawal.status] ?? withdrawal.status}
                      </small>
                    </div>
                    <b className="whitespace-nowrap text-xs font-black text-[#078323]">
                      {new Date(withdrawal.requested_at).toLocaleDateString("pt-BR")}
                    </b>
                  </article>
                ))
              ) : (
                <p className="py-6 text-center text-sm font-bold leading-5 text-[#6b7280]">Nenhum saque solicitado.</p>
              )}
            </div>
          </section>
        </section>
      </div>
    </AuthPhone>
  );
}
