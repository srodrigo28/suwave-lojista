"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { FaArrowLeft, FaBoxOpen, FaCheckCircle, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthPhone } from "./auth-shell";
import { productSchema, zodErrors } from "./form-schemas";
import { maskCurrencyBRL, maskUf } from "./masks";
import { createSellerProduct, getSellerSession, type SellerProductPayload } from "./seller-api";

type ProductModule = "foods" | "roupas" | "oficina_maquinas" | "outros";

const PRODUCT_MODULES: Array<{ id: ProductModule; label: string }> = [
  { id: "foods", label: "Foods" },
  { id: "roupas", label: "Roupas" },
  { id: "oficina_maquinas", label: "Oficina / Máquinas" },
  { id: "outros", label: "Outros" },
];

const productTypes: Array<{
  category: string;
  key: string;
  label: string;
  module: ProductModule;
  subcategory: string;
  type: SellerProductPayload["type"];
}> = [
  { category: "delivery", key: "food", label: "Delivery", module: "foods", subcategory: "food", type: "food" },
  { category: "marketplace", key: "fashion", label: "Moda", module: "roupas", subcategory: "fashion", type: "fashion" },
  {
    category: "services",
    key: "oficina",
    label: "Oficina (serviço)",
    module: "oficina_maquinas",
    subcategory: "mechanics",
    type: "service",
  },
  {
    category: "classifieds",
    key: "machinery",
    label: "Máquinas e peças",
    module: "oficina_maquinas",
    subcategory: "machinery",
    type: "vehicle",
  },
  {
    category: "services",
    key: "service",
    label: "Serviço",
    module: "outros",
    subcategory: "local-service",
    type: "service",
  },
  { category: "classifieds", key: "vehicle", label: "Veículo", module: "outros", subcategory: "vehicle", type: "vehicle" },
  {
    category: "classifieds",
    key: "real_estate",
    label: "Imóvel",
    module: "outros",
    subcategory: "real-estate",
    type: "real_estate",
  },
];

function defaultAttributes(key: string, type: SellerProductPayload["type"], title: string, price: string) {
  const defaults: Record<string, Record<string, string>> = {
    fashion: { color: "A definir", condition: "novo", gender: "unissex", size: "unico" },
    food: { availability: "diaria", preparation_time: "45 min", store: "Loja Suwave" },
    machinery: {
      brand: "A definir",
      condition: "usada",
      equipment_type: title || "Máquina",
      hours_used: "0",
      warranty: "sem garantia",
    },
    oficina: { availability: "com agendamento", base_price: price, service_area: title || "Serviço de oficina", specialty: "Mecânica geral" },
    real_estate: { area: "0 m2", bathrooms: "1", bedrooms: "1", operation: "venda", property_type: "casa" },
    service: { availability: "com agendamento", base_price: price, service_area: title || "Serviço local" },
    vehicle: {
      brand: "A definir",
      color: "A definir",
      fuel: "flex",
      mileage: "0",
      model: title || "Modelo",
      model_year: String(new Date().getFullYear()),
      transmission: "manual",
    },
  };

  return { [type]: defaults[key] };
}

function Field({
  label,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
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
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

export function ProductFormScreen() {
  const [city, setCity] = useState("Sinop");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"category" | "price" | "stock" | "title", string>>>({});
  const [feedback, setFeedback] = useState("");
  const [price, setPrice] = useState("");
  const [state, setState] = useState("MT");
  const [status, setStatus] = useState<SellerProductPayload["status"]>("draft");
  const [stock, setStock] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [typeKey, setTypeKey] = useState("food");

  const selectedType = useMemo(() => productTypes.find((item) => item.key === typeKey) ?? productTypes[0], [typeKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSellerSession();
    if (!session?.accessToken) {
      const message = "Entre com uma conta lojista para salvar o produto.";
      setFeedback(message);
      toast.error(message);
      return;
    }

    setFieldErrors({});
    const parsed = productSchema.safeParse({
      category: typeKey,
      price,
      stock,
      title,
    });
    if (!parsed.success) {
      const errors = zodErrors<"category" | "price" | "stock" | "title">(parsed.error);
      setFieldErrors(errors);
      toast.error(Object.values(errors)[0] ?? "Revise os campos do produto.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const product = await createSellerProduct(session.accessToken, {
        attributes: defaultAttributes(selectedType.key, selectedType.type, title, price),
        category_id: selectedType.category,
        city,
        description,
        price,
        state: state.toUpperCase(),
        status,
        stock_quantity: stock.trim() ? Number(stock) : null,
        subcategory_id: selectedType.subcategory,
        title,
        type: selectedType.type,
      });
      setFeedback(`Produto salvo: ${product.title}`);
      toast.success(`Produto salvo: ${product.title}`);
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("1");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar o produto.";
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
          <Link aria-label="Voltar para produtos" className="grid h-10 w-10 place-items-center text-[#111317]" href="/products">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Novo produto</strong>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eefaf1] text-[#078323]">
            <FaBoxOpen aria-hidden="true" />
          </span>
        </header>

        <section className="grid gap-5 px-6 py-6">
          <div className="rounded-[8px] bg-[#102017] p-5 text-white">
            <span className="text-[11px] font-black uppercase tracking-normal text-[#9ff2c2]">Catálogo real</span>
            <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">Cadastrar item</h1>
            <p className="mt-2 text-sm font-bold leading-5 text-white/75">
              Salve rascunhos, produtos e anúncios no backend do lojista.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Tipo</span>
              <select
                className="h-12 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4 text-sm font-bold text-[#111317] outline-0"
                onChange={(event) => setTypeKey(event.target.value)}
                value={typeKey}
              >
                {PRODUCT_MODULES.map((productModule) => (
                  <optgroup key={productModule.id} label={productModule.label}>
                    {productTypes
                      .filter((item) => item.module === productModule.id)
                      .map((item) => (
                        <option key={item.key} value={item.key}>
                          {item.label}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <Field label="Título" onChange={setTitle} placeholder="Pizza grande promocional" value={title} />
            {fieldErrors.title ? <small className="-mt-2 text-xs font-bold text-[#dc2626]">{fieldErrors.title}</small> : null}
            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Descrição</span>
              <textarea
                className="min-h-24 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4 py-3 text-sm font-bold text-[#111317] outline-0 placeholder:text-[#9ca0a8]"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Detalhes do produto, preparo, condição ou disponibilidade"
                value={description}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Preço" onChange={(value) => setPrice(maskCurrencyBRL(value))} placeholder="R$ 49,90" value={price} />
              <Field label="Estoque" onChange={setStock} placeholder="1" type="number" value={stock} />
            </div>
            {fieldErrors.price || fieldErrors.stock ? (
              <small className="-mt-2 text-xs font-bold text-[#dc2626]">
                {fieldErrors.price ?? fieldErrors.stock}
              </small>
            ) : null}
            <div className="grid grid-cols-[1fr_86px] gap-3">
              <Field label="Cidade" onChange={setCity} value={city} />
              <Field label="UF" onChange={(value) => setState(maskUf(value))} value={state} />
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-black text-[#4b5563]">Publicação</span>
              <select
                className="h-12 rounded-[12px] border border-[#e6e9ef] bg-[#f8fafb] px-4 text-sm font-bold text-[#111317] outline-0"
                onChange={(event) => setStatus(event.target.value as SellerProductPayload["status"])}
                value={status}
              >
                <option value="draft">Salvar rascunho</option>
                <option value="pending_review">Enviar para revisão</option>
                <option value="published">Publicar</option>
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
              {submitting ? <FaCheckCircle aria-hidden="true" /> : <FaSave aria-hidden="true" />}
              {submitting ? "Salvando..." : "Salvar produto"}
            </button>
          </form>
        </section>
      </div>
    </AuthPhone>
  );
}
