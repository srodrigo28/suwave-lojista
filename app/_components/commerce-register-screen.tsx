"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, SelectHTMLAttributes, useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Search,
  Store,
} from "lucide-react";
import { maskCep, maskWhatsapp, onlyDigits } from "./masks";
import { fetchAddressByCep } from "./cep";
import { getSellerSession, updateSellerProfile } from "./seller-api";

type FieldProps = {
  children?: ReactNode;
  className?: string;
  label: string;
};

const states = ["MT", "MS", "GO", "SP", "PR", "SC", "RS"];
const citiesByState: Record<string, string[]> = {
  GO: ["Goiânia", "Anápolis", "Rio Verde"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop"],
  PR: ["Curitiba", "Londrina", "Maringá"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas"],
  SC: ["Florianópolis", "Joinville", "Blumenau"],
  SP: ["São Paulo", "Campinas", "Ribeirão Preto"],
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Field({ children, className, label }: FieldProps) {
  return (
    <label className={cx("grid min-w-0 gap-2", className)}>
      <span className="text-[15px] font-black leading-none text-[#101010]">{label}</span>
      {children}
    </label>
  );
}

function ShadInput({
  className,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return (
    <div
      className={cx(
        "flex h-12 items-center rounded-[8px] border border-[#d9d9d9] bg-white px-4 transition focus-within:border-[#f6bd14] focus-within:ring-2 focus-within:ring-[#f6bd14]/20",
        className,
      )}
    >
      <input
        {...props}
        className="min-w-0 flex-1 border-0 bg-transparent text-[15px] font-semibold text-[#171717] outline-none placeholder:text-[#7d8290]"
      />
      {icon ? <span className="ml-3 grid h-6 w-6 place-items-center text-[#737782]">{icon}</span> : null}
    </div>
  );
}

function ShadSelect({
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div
      className={cx(
        "relative flex h-12 items-center rounded-[8px] border border-[#d9d9d9] bg-white px-4 transition focus-within:border-[#f6bd14] focus-within:ring-2 focus-within:ring-[#f6bd14]/20",
        className,
      )}
    >
      <select
        {...props}
        className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent pr-8 text-[15px] font-semibold text-[#6e7280] outline-none"
      >
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-5 h-4 w-4 text-[#7b7f89]" />
    </div>
  );
}

function SectionTitle({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-7 w-7 place-items-center text-[25px] text-[#f6bd14]">{icon}</span>
      <h2 className="text-[22px] font-black leading-none tracking-normal text-[#101010]">{children}</h2>
    </div>
  );
}

function MapPreview() {
  const roads = [
    "left-[4%] top-[20%] h-[16px] w-[96%] -rotate-[4deg]",
    "left-[-3%] top-[55%] h-[16px] w-[110%] rotate-[1deg]",
    "left-[9%] top-[79%] h-[16px] w-[96%] -rotate-[8deg]",
    "left-[22%] top-[-14%] h-[16px] w-[60%] rotate-[76deg]",
    "left-[58%] top-[-8%] h-[16px] w-[58%] rotate-[93deg]",
    "left-[71%] top-[16%] h-[16px] w-[50%] rotate-[25deg]",
    "left-[-7%] top-[32%] h-[16px] w-[44%] rotate-[64deg]",
  ];

  return (
    <div className="relative mt-5 h-[220px] overflow-hidden rounded-[7px] border border-[#ededed] bg-[#f2eee9] md:h-[250px]">
      <div className="absolute -left-[5%] bottom-[-18%] h-[190px] w-[210px] rotate-[-9deg] rounded-[38px] bg-[#cdebb9]" />
      <div className="absolute -right-[5%] bottom-[-8%] h-[180px] w-[260px] rotate-[12deg] rounded-[44px] bg-[#cdebb9]" />
      <div className="absolute right-[1%] top-[16%] h-[72px] w-[120px] rotate-[22deg] rounded-[5px] bg-[#eef5f1]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.22)_1px,transparent_1px)] bg-[size:72px_54px]" />

      {roads.map((road) => (
        <span
          aria-hidden="true"
          className={cx("absolute rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,.02)]", road)}
          key={road}
        />
      ))}

      <span className="absolute left-[32%] top-[34%] rotate-[-5deg] text-[13px] font-black text-[#424242]">
        R. das Orquídeas
      </span>
      <span className="absolute left-[31%] top-[6%] rotate-[4deg] text-[13px] font-black text-[#424242]">
        Av. das Figueiras
      </span>
      <span className="absolute right-[18%] top-[8%] rotate-[8deg] text-[13px] font-black text-[#424242]">
        R. das Palmeiras
      </span>
      <span className="absolute bottom-[18%] left-[52%] rotate-[-8deg] text-[13px] font-black text-[#424242]">
        R. das Flores
      </span>
      <span className="absolute bottom-[24%] right-[34%] rotate-[82deg] text-[13px] font-black text-[#424242]">
        Rua B. Lambari
      </span>

      <span className="absolute left-[48%] top-[35%] grid h-[56px] w-[56px] -translate-x-1/2 place-items-center rounded-full bg-[#f6bd14] text-white shadow-[0_8px_14px_rgba(246,189,20,.3)] before:absolute before:bottom-[-12px] before:h-7 before:w-7 before:rotate-45 before:rounded-[5px] before:bg-[#f6bd14]">
        <MapPin aria-hidden="true" className="relative z-10 h-8 w-8" strokeWidth={2.8} />
      </span>

      <div className="absolute bottom-3 right-3 overflow-hidden rounded-[7px] border border-[#d4d4d4] bg-white shadow-[0_10px_24px_rgba(0,0,0,.12)]">
        <button
          aria-label="Aproximar mapa"
          className="grid h-12 w-12 place-items-center border-b border-[#e3e3e3] text-xl text-[#111111]"
          type="button"
        >
          <Plus aria-hidden="true" className="h-6 w-6" strokeWidth={3} />
        </button>
        <button aria-label="Afastar mapa" className="grid h-12 w-12 place-items-center text-xl text-[#111111]" type="button">
          <Minus aria-hidden="true" className="h-6 w-6" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

export function CommerceRegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [feedback, setFeedback] = useState("");
  const [cepFeedback, setCepFeedback] = useState("");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statesOptions = useMemo(() => (state && !states.includes(state) ? [...states, state] : states), [state]);
  const cities = useMemo(() => {
    const options = state ? citiesByState[state] ?? [] : [];
    return city && !options.includes(city) ? [...options, city] : options;
  }, [city, state]);

  useEffect(() => {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) {
      return;
    }

    let cancelled = false;

    const timeout = window.setTimeout(async () => {
      try {
        setIsLoadingCep(true);
        setCepFeedback("");
        const result = await fetchAddressByCep(digits);
        if (cancelled) {
          return;
        }

        setState(result.estado);
        setCity(result.cidade);
        setDistrict((current) => result.bairro || current);
        setAddress((current) => result.rua || current);
      } catch (error) {
        if (!cancelled) {
          setCepFeedback(error instanceof Error ? error.message : "Não foi possível consultar o CEP agora.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCep(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [cep]);

  function handleCepChange(value: string) {
    const nextCep = maskCep(value);
    if (onlyDigits(nextCep).length < 8) {
      setCepFeedback("");
      setIsLoadingCep(false);
    }
    setCep(nextCep);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    if (onlyDigits(phone).length < 10) {
      setFeedback("Informe um telefone com DDD.");
      return;
    }

    if (onlyDigits(cep).length !== 8) {
      setFeedback("Informe um CEP com 8 dígitos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const draft = {
        address: address.trim(),
        cep,
        city,
        district: district.trim(),
        email: email.trim().toLowerCase(),
        phone,
        state,
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem("suwave-logista-commerce-draft", JSON.stringify(draft));

      const session = getSellerSession();
      if (session?.accessToken) {
        await updateSellerProfile(session.accessToken, {
          city,
          state,
          store_name: district.trim() || "Minha loja",
          whatsapp: onlyDigits(phone),
        });
        router.push("/store/profile");
        return;
      }

      router.push("/register/confirm-email");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível continuar agora.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-4 text-[#101010] sm:px-7 sm:py-6">
      <section className="mx-auto min-h-[calc(100vh-48px)] w-full max-w-[1440px] rounded-[16px] bg-white px-5 py-8 shadow-[0_22px_70px_rgba(0,0,0,.08)] sm:px-10 lg:px-[62px] lg:py-10">
        <form className="mx-auto flex min-h-[calc(100vh-128px)] max-w-[1260px] flex-col" onSubmit={handleSubmit}>
          <header>
            <h1 className="text-[34px] font-black leading-tight tracking-normal text-[#050505] sm:text-[42px] lg:text-[48px]">
              Cadastrar <span className="text-[#f6bd14]">seu comércio</span>
            </h1>
            <p className="mt-3 text-[17px] font-semibold leading-7 text-[#6d7280]">
              Preencha os dados abaixo para fazer seu cadastro na Suwave.
            </p>
          </header>

          <section className="mt-9 grid gap-6">
            <SectionTitle icon={<Building2 aria-hidden="true" strokeWidth={2.4} />}>Dados comerciais</SectionTitle>
            <div className="grid gap-6 md:grid-cols-2 md:gap-x-[70px]">
              <Field label="E-mail">
                <ShadInput
                  autoComplete="email"
                  icon={<Mail aria-hidden="true" className="h-5 w-5" />}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite o e-mail"
                  required
                  type="email"
                  value={email}
                />
              </Field>
              <Field label="Telefone">
                <ShadInput
                  autoComplete="tel"
                  icon={<Phone aria-hidden="true" className="h-5 w-5" />}
                  inputMode="tel"
                  onChange={(event) => setPhone(maskWhatsapp(event.target.value))}
                  placeholder="(00) 00000-0000"
                  required
                  value={phone}
                />
              </Field>
            </div>
          </section>

          <hr className="my-7 border-[#e1e1e1]" />

          <section className="grid gap-6">
            <SectionTitle icon={<Store aria-hidden="true" strokeWidth={2.4} />}>Informações da loja</SectionTitle>
            <div className="grid gap-6 lg:grid-cols-[1fr_.9fr_.9fr_1.05fr]">
              <Field label="CEP">
                <ShadInput
                  icon={<Search aria-hidden="true" className="h-5 w-5" />}
                  inputMode="numeric"
                  onChange={(event) => handleCepChange(event.target.value)}
                  placeholder={isLoadingCep ? "Consultando..." : "00000-000"}
                  required
                  value={cep}
                />
                {cepFeedback ? <small className="text-xs font-bold text-[#dc2626]">{cepFeedback}</small> : null}
              </Field>
              <Field label="Estado">
                <ShadSelect
                  onChange={(event) => {
                    setState(event.target.value);
                    setCity("");
                  }}
                  required
                  value={state}
                >
                  <option value="">Selecione</option>
                  {statesOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </ShadSelect>
              </Field>
              <Field label="Cidade">
                <ShadSelect disabled={!state} onChange={(event) => setCity(event.target.value)} required value={city}>
                  <option value="">Selecione</option>
                  {cities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </ShadSelect>
              </Field>
              <Field label="Bairro">
                <ShadInput onChange={(event) => setDistrict(event.target.value)} placeholder="Digite o bairro" required value={district} />
              </Field>
            </div>

            <Field label="Endereço completo">
              <ShadInput
                autoComplete="street-address"
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Digite o endereço completo da sua loja"
                required
                value={address}
              />
            </Field>
          </section>

          <section className="mt-6">
            <div className="flex items-start gap-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center text-[27px] text-[#f6bd14]">
                <MapPin aria-hidden="true" strokeWidth={2.5} />
              </span>
              <div>
                <h2 className="text-[22px] font-black leading-none tracking-normal text-[#101010]">
                  Revise a localização da sua loja
                </h2>
                <p className="mt-3 max-w-[500px] text-[16px] font-semibold leading-6 text-[#6d7280]">
                  Se precisar, clique no mapa para editar.
                  <br />
                  Você também pode usar o zoom para editar com mais precisão.
                </p>
              </div>
            </div>
            <MapPreview />
          </section>

          {feedback ? (
            <p className="mt-4 rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] px-4 py-3 text-sm font-black text-[#9a3412]">
              {feedback}
            </p>
          ) : null}

          <footer className="mt-auto flex flex-col-reverse gap-3 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <Link
              className="inline-flex h-[58px] items-center justify-center gap-3 rounded-[8px] border border-[#cfd1d6] bg-white px-7 text-[17px] font-black text-[#111111] no-underline transition hover:bg-[#f7f7f7]"
              href="/"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={3} />
              Voltar
            </Link>
            <button
              className="inline-flex h-[58px] items-center justify-center gap-5 rounded-[8px] bg-[#f6bd14] px-9 text-[18px] font-black text-[#080808] transition hover:bg-[#e8ad06] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Continuando..." : "Continuar"}
              <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={3} />
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
}
