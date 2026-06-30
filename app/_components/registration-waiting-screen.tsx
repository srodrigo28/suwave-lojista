"use client";

"use client";

import Link from "next/link";
import { Building2, Check, LogOut, MailCheck, Search } from "lucide-react";
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

function DocumentCheckIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto mt-16 grid h-[230px] w-[300px] place-items-center">
      <span className="absolute h-[196px] w-[196px] rounded-full bg-[#fff1cc]" />
      <span className="absolute h-[220px] w-[220px] rounded-full border-2 border-dashed border-[#ead9b1]" />
      <span className="absolute left-4 top-12 text-2xl font-black text-[#f6bd14]">+</span>
      <span className="absolute right-7 top-11 text-2xl font-black text-[#f6bd14]">✦</span>
      <span className="absolute bottom-8 left-8 text-2xl font-black text-[#f6bd14]">◇</span>
      <span className="absolute bottom-12 right-1 text-2xl font-black text-[#f6bd14]">✣</span>

      <span className="absolute top-9 h-[150px] w-[122px] rounded-[8px] border border-[#e1e1e1] bg-white shadow-[0_16px_26px_rgba(0,0,0,.08)]">
        <span className="absolute right-0 top-0 h-9 w-9 rounded-bl-[8px] bg-[#d6d8dc] [clip-path:polygon(0_0,100%_100%,100%_0)]" />
        <Building2 className="absolute left-8 top-9 h-12 w-12 text-[#f6bd14]" strokeWidth={2.8} />
        <span className="absolute bottom-12 left-8 h-[3px] w-16 rounded-full bg-[#b6b6b6]" />
        <span className="absolute bottom-8 left-8 h-[3px] w-14 rounded-full bg-[#b6b6b6]" />
      </span>

      <span className="absolute bottom-9 right-[58px] grid h-[82px] w-[82px] place-items-center rounded-full border-[6px] border-[#585f68] bg-[#f6bd14] text-white shadow-[0_12px_24px_rgba(0,0,0,.14)]">
        <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-white text-[#f6bd14]">
          <Check className="h-9 w-9" strokeWidth={3.2} />
        </span>
      </span>
      <span className="absolute bottom-6 right-8 h-[58px] w-[18px] rotate-[-43deg] rounded-full border-[4px] border-[#585f68] bg-[#f6bd14]" />
      <Search className="absolute bottom-[64px] right-[82px] h-8 w-8 text-transparent" />
    </div>
  );
}

export function RegistrationWaitingScreen() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-4 text-[#050505] sm:px-7 sm:py-6">
      <section className="mx-auto min-h-[calc(100vh-48px)] w-full max-w-[1080px] rounded-[16px] bg-white px-5 py-8 shadow-[0_22px_70px_rgba(0,0,0,.08)] sm:px-12 lg:px-[92px] lg:py-12">
        <div className="mx-auto flex min-h-[calc(100vh-144px)] max-w-[760px] flex-col items-center">
          <SuwaveLogo />
          <DocumentCheckIllustration />

          <h1 className="mt-6 max-w-[660px] text-center text-[34px] font-black leading-tight tracking-normal text-[#050505] sm:text-[48px]">
            Estamos confirmando os dados do seu CNPJ.
          </h1>

          <p className="mt-8 max-w-[610px] text-center text-[18px] font-semibold leading-9 text-[#2f3138] sm:text-[22px]">
            Estamos muito felizes com o seu cadastro para entrada na Suwave. No momento estamos buscando as informações
            do seu CNPJ online. Porém, essa etapa pode durar até{" "}
            <strong className="font-black text-[#f6bd14]">48 horas.</strong>
          </p>

          <section className="mt-14 flex w-full max-w-[590px] items-center gap-7 rounded-[13px] bg-[#fff7df] px-7 py-7 shadow-[0_8px_24px_rgba(0,0,0,.03)]">
            <span className="grid h-[88px] w-[88px] shrink-0 place-items-center rounded-full bg-[#ffd25b] text-white">
              <span className="relative grid h-[52px] w-[60px] place-items-center rounded-[5px] bg-white text-[#f6bd14] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:[clip-path:polygon(0_0,50%_48%,100%_0,100%_100%,0_100%)] before:border before:border-[#f6bd14]">
                <MailCheck className="relative z-10 h-8 w-8" strokeWidth={2.7} />
              </span>
            </span>
            <span className="hidden h-[126px] w-px bg-[#e1d2aa] sm:block" />
            <div>
              <h2 className="text-[21px] font-black leading-tight text-[#101010]">Aguarde nosso contato.</h2>
              <p className="mt-4 text-[17px] font-semibold leading-8 text-[#101010]">
                Enviaremos um e-mail com os próximos passos e para assinatura do seu contrato.
              </p>
            </div>
          </section>

          <Link
            className="mt-auto inline-flex h-[66px] w-full max-w-[500px] items-center justify-center gap-5 rounded-[9px] border-2 border-[#f6bd14] bg-white px-10 text-[20px] font-black text-[#111111] no-underline transition hover:bg-[#fff8e8]"
            href="/"
            onClick={() => toast.info("Você saiu da etapa de cadastro.")}
          >
            <LogOut aria-hidden="true" className="h-7 w-7" strokeWidth={2.6} />
            Sair
          </Link>
        </div>
      </section>
    </main>
  );
}
