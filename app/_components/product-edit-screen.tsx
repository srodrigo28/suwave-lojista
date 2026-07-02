"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaEdit, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthPhone } from "./auth-shell";
import { productSchema, zodErrors } from "./form-schemas";
import { maskCurrencyBRL, maskUf } from "./masks";
import {
  getSellerProduct,
  getSellerSession,
  updateSellerProduct,
  type SellerProduct,
  type SellerProductPayload,
} from "./seller-api";

const productTypes: Array<{ id: SellerProductPayload["type"]; label: string; category: string; subcategory: string }> = [
  { id: "food", label: "Delivery", category: "delivery", subcategory: "food" },
  { id: "fashion", label: "Moda", category: "marketplace", subcategory: "fashion" },
  { id: "service", label: "Serviço", category: "services", subcategory: "local-service" },
  { id: "vehicle", label: "Veículo", category: "classifieds", subcategory: "vehicle" },
  { id: "real_estate", label: "Imóvel", category: "classifieds", subcategory: "real-estate" },
];

function normalizeType(value: string): SellerProductPayload["type"] {
  return productTypes.some((item) => item.id === value) ? (value as SellerProductPayload["type"]) : "food";
}

function defaultAttributes(type: SellerProductPayload["type"], title: string, price: string, current?: SellerProduct) {
  if (current?.attributes && Object.keys(current.attributes).length) {
    return current.attributes;
  }

  const defaults = {
    fashion: { color: "A definir", condition: "novo", gender: "unissex", size: "unico" },
    food: { availability: "diaria", preparation_time: "45 min", store: "Loja Suwave" },
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

  return { [type]: defaults[type] };
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
      <span className="text-xs font-black text-ink-2">{label}</span>
      <input
        className="h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-bold text-ink outline-0 transition focus:border-brand focus:ring-2 focus:ring-brand/25 placeholder:text-ink-3"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

export function ProductEditScreen() {
  const params = useParams<{ productId: string }>();
  const productId = decodeURIComponent(params.productId ?? "");
  const [city, setCity] = useState("Sinop");
  const [currentProduct, setCurrentProduct] = useState<SellerProduct | null>(null);
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"category" | "price" | "stock" | "title", string>>>({});
  const [feedback, setFeedback] = useState("");
  const [price, setPrice] = useState("");
  const [state, setState] = useState("MT");
  const [status, setStatus] = useState<SellerProductPayload["status"]>("draft");
  const [stock, setStock] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<SellerProductPayload["type"]>("food");

  const selectedType = useMemo(() => productTypes.find((item) => item.id === type) ?? productTypes[0], [type]);

  useEffect(() => {
    if (!productId) {
      return;
    }

    let active = true;
    getSellerProduct(productId)
      .then((product) => {
        if (!active) {
          return;
        }
        setCurrentProduct(product);
        setCity(product.city || "Sinop");
        setDescription(product.description ?? "");
        setPrice(product.price);
        setState(product.state ?? "MT");
        setStatus(
          ["draft", "pending_review", "published", "paused"].includes(product.status)
            ? (product.status as SellerProductPayload["status"])
            : "draft",
        );
        setStock(product.stock_quantity === null ? "" : String(product.stock_quantity));
        setTitle(product.title);
        setType(normalizeType(product.type));
      })
      .catch((error) => {
        if (active) {
          const message = error instanceof Error ? error.message : "Não foi possível carregar o produto.";
          setFeedback(message);
          toast.error(message);
        }
      });

    return () => {
      active = false;
    };
  }, [productId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSellerSession();
    if (!session?.accessToken) {
      const message = "Entre com uma conta lojista para editar o produto.";
      setFeedback(message);
      toast.error(message);
      return;
    }

    setFieldErrors({});
    const parsed = productSchema.safeParse({
      category: type,
      price,
      stock: stock.trim() ? stock : "0",
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
      const product = await updateSellerProduct(session.accessToken, productId, {
        attributes: defaultAttributes(type, title, price, currentProduct ?? undefined),
        category_id: currentProduct?.category_id || selectedType.category,
        city,
        description,
        price,
        state: state.toUpperCase(),
        status,
        stock_quantity: stock.trim() ? Number(stock) : null,
        subcategory_id: currentProduct?.subcategory_id || selectedType.subcategory,
        title,
        type,
      });
      setCurrentProduct(product);
      setFeedback(`Produto atualizado: ${product.title}`);
      toast.success(`Produto atualizado: ${product.title}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível editar o produto.";
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
          <Link aria-label="Voltar para produtos" className="grid h-10 w-10 place-items-center text-ink" href="/products">
            <FaArrowLeft aria-hidden="true" />
          </Link>
          <strong className="text-sm font-black">Editar produto</strong>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-positive-soft text-positive-strong">
            <FaEdit aria-hidden="true" />
          </span>
        </header>

        <section className="stagger grid gap-5 px-6 py-6">
          <div className="rounded-[8px] bg-forest p-5 text-white">
            <span className="text-[11px] font-black uppercase tracking-normal text-[#9ff2c2]">Catálogo real</span>
            <h1 className="mt-2 text-[28px] font-black leading-tight tracking-normal">
              {title || "Editar item"}
            </h1>
            <p className="mt-2 text-sm font-bold leading-5 text-white/75">
              Atualize preço, estoque, status e dados principais do anúncio.
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-black text-ink-2">Tipo</span>
              <select
                className="h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-bold text-ink outline-0 transition focus:border-brand focus:ring-2 focus:ring-brand/25"
                onChange={(event) => setType(event.target.value as SellerProductPayload["type"])}
                value={type}
              >
                {productTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <Field label="Título" onChange={setTitle} placeholder="Pizza grande promocional" value={title} />
            {fieldErrors.title ? <small className="-mt-2 text-xs font-bold text-danger">{fieldErrors.title}</small> : null}
            <label className="grid gap-2">
              <span className="text-xs font-black text-ink-2">Descrição</span>
              <textarea
                className="min-h-24 rounded-[12px] border border-line bg-surface-2 px-4 py-3 text-sm font-bold text-ink outline-0 transition focus:border-brand focus:ring-2 focus:ring-brand/25 placeholder:text-ink-3"
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
              <small className="-mt-2 text-xs font-bold text-danger">
                {fieldErrors.price ?? fieldErrors.stock}
              </small>
            ) : null}
            <div className="grid grid-cols-[1fr_86px] gap-3">
              <Field label="Cidade" onChange={setCity} value={city} />
              <Field label="UF" onChange={(value) => setState(maskUf(value))} value={state} />
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-black text-ink-2">Publicação</span>
              <select
                className="h-12 rounded-[12px] border border-line bg-surface-2 px-4 text-sm font-bold text-ink outline-0 transition focus:border-brand focus:ring-2 focus:ring-brand/25"
                onChange={(event) => setStatus(event.target.value as SellerProductPayload["status"])}
                value={status}
              >
                <option value="draft">Rascunho</option>
                <option value="pending_review">Enviar para revisão</option>
                <option value="published">Publicado</option>
                <option value="paused">Pausado</option>
              </select>
            </label>

            {feedback ? (
              <p className="rounded-[8px] bg-positive-soft px-3 py-2 text-xs font-black leading-5 text-positive-strong">
                {feedback}
              </p>
            ) : null}

            <button
              className="flex h-12 items-center justify-center gap-2 press rounded-[12px] bg-positive text-sm font-black text-white shadow-[0_12px_20px_rgba(5,185,110,.22)] disabled:opacity-60"
              disabled={submitting || !productId}
              type="submit"
            >
              {submitting ? <FaCheckCircle aria-hidden="true" /> : <FaSave aria-hidden="true" />}
              {submitting ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </section>
      </div>
    </AuthPhone>
  );
}
