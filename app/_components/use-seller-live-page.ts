"use client";

import { useEffect, useMemo, useState } from "react";
import type { SellerPage } from "./seller-data";
import {
  getSellerBundle,
  getSellerSession,
  type SellerOrder,
  type SellerProduct,
  type SellerSummary,
} from "./seller-api";

type SellerBundle = Awaited<ReturnType<typeof getSellerBundle>>;

const statusLabels: Record<string, string> = {
  archived: "Arquivado",
  cancelled: "Cancelado",
  chargeback: "Chargeback",
  created: "Criado",
  delivered: "Entregue",
  draft: "Rascunho",
  paid: "Pago",
  paused: "Pausado",
  payment_expired: "Pix expirado",
  pending_payment: "Aguardando Pix",
  pending_review: "Revisao",
  preparing: "Preparando",
  published: "Ativo",
  refunded: "Estornado",
  reserved: "Reservado",
  sold: "Vendido",
  on_route: "Em rota",
};

function statusLabel(status: string) {
  return statusLabels[status] ?? status;
}

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    fashion: "Moda",
    food: "Delivery",
    real_estate: "Imovel",
    service: "Servico",
    vehicle: "Veiculo",
  };

  return labels[type] ?? type;
}

function productItem(product: SellerProduct) {
  return {
    href: `/products/${encodeURIComponent(product.id)}/edit`,
    meta: `${typeLabel(product.type)}${product.stock_quantity === null ? "" : ` · ${product.stock_quantity} un.`}`,
    status: statusLabel(product.status),
    title: product.title,
    value: product.price,
  };
}

function orderItem(order: SellerOrder) {
  return {
    meta: order.payment_method || order.placed_at,
    status: order.status_label || statusLabel(order.status),
    title: `Pedido #${order.short_id || order.id.slice(0, 6)}`,
    value: order.total,
  };
}

function cardsFromSummary(summary: SellerSummary) {
  return [
    { eyebrow: "Pedidos", title: "Recebidos", value: String(summary.orders_total) },
    { eyebrow: "Faturamento", title: "Total vendido", value: summary.revenue_total },
    { eyebrow: "Catalogo", title: "Produtos ativos", value: String(summary.active_products) },
    { eyebrow: "Pendencias", title: "Fila operacional", value: String(summary.orders_pending + summary.draft_products) },
  ];
}

function stockItems(products: SellerProduct[]) {
  return products
    .filter((product) => product.stock_quantity !== null)
    .sort((first, second) => (first.stock_quantity ?? 0) - (second.stock_quantity ?? 0))
    .slice(0, 8)
    .map((product) => ({
      href: `/products/${encodeURIComponent(product.id)}/edit`,
      meta: typeLabel(product.type),
      status: `${product.stock_quantity ?? 0} un.`,
      title: product.title,
      value: (product.stock_quantity ?? 0) <= 0 ? "Zerado" : (product.stock_quantity ?? 0) <= 3 ? "Baixo" : "OK",
    }));
}

function applyLiveData(page: SellerPage, bundle: SellerBundle): SellerPage {
  const { orders, products, profile, summary } = bundle;
  const cityLabel = [profile.city, profile.state].filter(Boolean).join(" - ");

  if (page.id === "dashboard") {
    return {
      ...page,
      cards: cardsFromSummary(summary),
      description: `${summary.store_name} em operacao com ${summary.orders_pending} pendencias abertas.`,
      items: (summary.recent_orders.length ? summary.recent_orders : orders).slice(0, 5).map(orderItem),
    };
  }

  if (page.id === "store/profile") {
    return {
      ...page,
      cards: [
        { eyebrow: "Loja", title: profile.store_name, value: statusLabel(profile.status) },
        { eyebrow: "Cidade", title: cityLabel || "Nao informada", value: profile.role },
      ],
      description: profile.description || page.description,
    };
  }

  if (page.id === "products") {
    return {
      ...page,
      cards: [
        { eyebrow: "Ativos", title: "Produtos publicados", value: String(summary.active_products) },
        { eyebrow: "Rascunhos", title: "Aguardam acao", value: String(summary.draft_products) },
      ],
      items: products.slice(0, 8).map(productItem),
    };
  }

  if (page.id === "products/stock") {
    return {
      ...page,
      items: stockItems(products),
    };
  }

  if (page.id === "orders" || page.id === "orders/current" || page.id === "orders/history") {
    const visibleOrders =
      page.id === "orders/history"
        ? orders.filter((order) => ["cancelled", "delivered", "refunded"].includes(order.status))
        : orders.filter((order) => !["cancelled", "delivered", "refunded"].includes(order.status));

    return {
      ...page,
      cards:
        page.id === "orders"
          ? [
              { eyebrow: "Fila", title: "Pendentes", value: String(summary.orders_pending) },
              { eyebrow: "Total", title: "Pedidos recebidos", value: String(summary.orders_total) },
            ]
          : page.cards,
      emptyState: visibleOrders.length ? undefined : "Nenhum pedido nesta lista no momento.",
      items: visibleOrders.slice(0, 8).map(orderItem),
    };
  }

  if (page.id === "finance" || page.id === "finance/statement") {
    return {
      ...page,
      cards: [
        { eyebrow: "Vendas", title: "Faturamento total", value: summary.revenue_total },
        { eyebrow: "Pedidos", title: "Recebidos", value: String(summary.orders_total) },
      ],
      items: orders.slice(0, 8).map(orderItem),
    };
  }

  return page;
}

export function useSellerLivePage(page: SellerPage) {
  const [bundle, setBundle] = useState<SellerBundle | null>(null);
  const [state, setState] = useState<"fallback" | "live" | "loading">("fallback");

  useEffect(() => {
    const session = getSellerSession();
    if (!session?.accessToken) {
      return;
    }

    let active = true;
    getSellerBundle(session.accessToken)
      .then((data) => {
        if (active) {
          setBundle(data);
          setState("live");
        }
      })
      .catch(() => {
        if (active) {
          setState("fallback");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const livePage = useMemo(() => (bundle ? applyLiveData(page, bundle) : page), [bundle, page]);

  return { page: livePage, state };
}
