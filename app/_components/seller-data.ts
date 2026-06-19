export type SellerPage = {
  action?: {
    href: string;
    label: string;
  };
  backHref?: string;
  cards?: Array<{
    eyebrow: string;
    title: string;
    value: string;
  }>;
  checklist?: string[];
  description: string;
  emptyState?: string;
  href: string;
  id: string;
  items?: Array<{
    href?: string;
    meta: string;
    status: string;
    title: string;
    value: string;
  }>;
  section: string;
  title: string;
};

export const sellerPages: Record<string, SellerPage> = {
  login: {
    action: { href: "/dashboard", label: "Entrar" },
    cards: [
      { eyebrow: "Acesso", title: "E-mail ou WhatsApp", value: "vendedor@suwave.local" },
      { eyebrow: "Conta", title: "Perfil lojista", value: "Ativo" },
    ],
    description: "Tela de entrada do lojista com acesso rápido para o painel.",
    href: "/login",
    id: "login",
    section: "Acesso",
    title: "Login lojista",
  },
  register: {
    action: { href: "/store/profile", label: "Começar cadastro" },
    checklist: ["Dados do responsável", "Dados da loja", "Cidade de operação", "Aceite dos termos"],
    description: "Cadastro inicial para transformar uma conta comum em loja operável.",
    href: "/register",
    id: "register",
    section: "Acesso",
    title: "Cadastro lojista",
  },
  "forgot-password": {
    action: { href: "/login", label: "Voltar ao login" },
    checklist: ["Informar e-mail", "Receber link seguro", "Criar nova senha"],
    description: "Recuperação de senha para o lojista voltar ao painel.",
    href: "/forgot-password",
    id: "forgot-password",
    section: "Acesso",
    title: "Recuperar senha",
  },
  dashboard: {
    action: { href: "/orders", label: "Ver pedidos" },
    cards: [
      { eyebrow: "Hoje", title: "Pedidos recebidos", value: "18" },
      { eyebrow: "Mês", title: "Faturamento", value: "R$ 8.420" },
      { eyebrow: "Catálogo", title: "Produtos ativos", value: "142" },
      { eyebrow: "Qualidade", title: "Avaliação média", value: "4,8" },
    ],
    description: "Visão geral da operação da loja, com vendas, pendências e atalhos.",
    href: "/dashboard",
    id: "dashboard",
    items: [
      { meta: "Hoje, 16:20", status: "Preparando", title: "Pedido #8391", value: "R$ 60,80" },
      { meta: "Hoje, 15:44", status: "Pago", title: "Pedido #4926", value: "R$ 389,90" },
      { meta: "Hoje, 11:05", status: "Separando", title: "Pedido #1742", value: "R$ 148,20" },
    ],
    section: "Operação",
    title: "Dashboard",
  },
  "store/profile": {
    action: { href: "/store/hours", label: "Configurar horários" },
    cards: [
      { eyebrow: "Loja", title: "Mercado Suwave", value: "Ativa" },
      { eyebrow: "Cidade", title: "Sinop - MT", value: "Local" },
    ],
    checklist: ["Logo e capa", "Descrição curta", "Categoria principal", "Contato comercial"],
    description: "Perfil público da loja com dados comerciais e apresentação.",
    href: "/store/profile",
    id: "store/profile",
    section: "Loja",
    title: "Perfil da loja",
  },
  "store/hours": {
    action: { href: "/store/delivery", label: "Configurar entrega" },
    checklist: ["Segunda a sexta", "Sábado", "Domingo e feriados", "Pausas automáticas"],
    description: "Horários de atendimento, recebimento de pedidos e pausas da operação.",
    href: "/store/hours",
    id: "store/hours",
    section: "Loja",
    title: "Horários",
  },
  "store/delivery": {
    action: { href: "/products", label: "Ir para produtos" },
    cards: [
      { eyebrow: "Raio", title: "Entrega local", value: "8 km" },
      { eyebrow: "Prazo", title: "Tempo médio", value: "45 min" },
    ],
    checklist: ["Área de atendimento", "Taxa por bairro", "Retirada no balcão", "Pedido mínimo"],
    description: "Regras simples para entrega local e retirada na loja.",
    href: "/store/delivery",
    id: "store/delivery",
    section: "Loja",
    title: "Entrega da loja",
  },
  products: {
    action: { href: "/products/new", label: "Novo produto" },
    cards: [
      { eyebrow: "Ativos", title: "Produtos publicados", value: "142" },
      { eyebrow: "Atenção", title: "Sem estoque", value: "7" },
    ],
    description: "Lista de produtos, anúncios e itens do cardápio do lojista.",
    href: "/products",
    id: "products",
    items: [
      { meta: "Moda", status: "Ativo", title: "Conjunto Masculino Básico", value: "R$ 89,90" },
      { meta: "Delivery", status: "Ativo", title: "Pizza grande promocional", value: "R$ 49,90" },
      { meta: "Veículos", status: "Revisão", title: "Ford Ranger XLT", value: "R$ 179.900" },
    ],
    section: "Produtos",
    title: "Meus produtos",
  },
  "products/new": {
    action: { href: "/products", label: "Salvar rascunho" },
    checklist: ["Fotos", "Nome", "Preço", "Categoria", "Estoque", "Publicação"],
    description: "Cadastro estático de produto com os campos esperados pelo app lojista.",
    href: "/products/new",
    id: "products/new",
    section: "Produtos",
    title: "Novo produto",
  },
  "products/categories": {
    action: { href: "/products/stock", label: "Ver estoque" },
    checklist: ["Comida e bebida", "Moda", "Serviços", "Veículos", "Imóveis"],
    description: "Categorias usadas pela loja para organizar vitrine e filtros.",
    href: "/products/categories",
    id: "products/categories",
    section: "Produtos",
    title: "Categorias",
  },
  "products/stock": {
    action: { href: "/orders", label: "Ver pedidos" },
    items: [
      { meta: "SKU 001", status: "12 un.", title: "Conjunto masculino", value: "OK" },
      { meta: "SKU 042", status: "3 un.", title: "Pizza promocional", value: "Baixo" },
      { meta: "SKU 087", status: "0 un.", title: "Tênis esportivo", value: "Zerado" },
    ],
    description: "Controle simples de disponibilidade e alertas de estoque.",
    href: "/products/stock",
    id: "products/stock",
    section: "Produtos",
    title: "Estoque",
  },
  orders: {
    action: { href: "/orders/current", label: "Pedido atual" },
    cards: [
      { eyebrow: "Fila", title: "Aguardando preparo", value: "6" },
      { eyebrow: "Entrega", title: "Em rota", value: "4" },
    ],
    description: "Pedidos recebidos para preparar, despachar e acompanhar.",
    href: "/orders",
    id: "orders",
    items: [
      { meta: "Pix aprovado", status: "Preparar", title: "Pedido #8391", value: "R$ 60,80" },
      { meta: "Cartão", status: "Separar", title: "Pedido #1742", value: "R$ 148,20" },
    ],
    section: "Pedidos",
    title: "Pedidos recebidos",
  },
  "orders/current": {
    action: { href: "/orders/history", label: "Histórico" },
    checklist: ["Confirmar pagamento", "Separar itens", "Chamar entrega", "Informar código"],
    description: "Detalhe operacional de um pedido em andamento.",
    href: "/orders/current",
    id: "orders/current",
    section: "Pedidos",
    title: "Pedido atual",
  },
  "orders/history": {
    action: { href: "/orders/returns", label: "Ver devoluções" },
    items: [
      { meta: "Ontem", status: "Entregue", title: "Pedido #4926", value: "R$ 389,90" },
      { meta: "08/06", status: "Entregue", title: "Pedido #4021", value: "R$ 72,30" },
    ],
    description: "Histórico de vendas finalizadas e canceladas.",
    href: "/orders/history",
    id: "orders/history",
    section: "Pedidos",
    title: "Histórico de pedidos",
  },
  "orders/returns": {
    action: { href: "/promotions", label: "Promoções" },
    emptyState: "Nenhuma devolução aberta no momento.",
    description: "Solicitações de troca, devolução e suporte pós-venda.",
    href: "/orders/returns",
    id: "orders/returns",
    section: "Pedidos",
    title: "Devoluções",
  },
  promotions: {
    action: { href: "/promotions/new", label: "Nova promoção" },
    cards: [
      { eyebrow: "Ativas", title: "Campanhas", value: "3" },
      { eyebrow: "Cupons", title: "Usos hoje", value: "27" },
    ],
    description: "Campanhas, descontos e cupons da loja.",
    href: "/promotions",
    id: "promotions",
    items: [
      { meta: "Até 30/06", status: "Ativa", title: "SUWAVE10", value: "10% OFF" },
      { meta: "Delivery", status: "Ativa", title: "DELIVERY15", value: "R$ 15" },
    ],
    section: "Comercial",
    title: "Promoções",
  },
  "promotions/new": {
    action: { href: "/promotions/cashback", label: "Configurar cashback" },
    checklist: ["Nome da campanha", "Tipo de desconto", "Pedido mínimo", "Validade"],
    description: "Criação estática de campanha promocional.",
    href: "/promotions/new",
    id: "promotions/new",
    section: "Comercial",
    title: "Nova promoção",
  },
  "promotions/cashback": {
    action: { href: "/finance", label: "Financeiro" },
    checklist: ["Percentual", "Produtos elegíveis", "Limite por cliente", "Prazo de liberação"],
    description: "Configuração de cashback para compras qualificadas.",
    href: "/promotions/cashback",
    id: "promotions/cashback",
    section: "Comercial",
    title: "Cashback",
  },
  finance: {
    action: { href: "/finance/statement", label: "Extrato" },
    cards: [
      { eyebrow: "Disponível", title: "Saldo", value: "R$ 4.280" },
      { eyebrow: "A receber", title: "Repasse", value: "R$ 2.140" },
    ],
    description: "Resumo financeiro da loja, vendas e repasses.",
    href: "/finance",
    id: "finance",
    section: "Financeiro",
    title: "Financeiro",
  },
  "finance/statement": {
    action: { href: "/finance/withdrawals", label: "Saques" },
    items: [
      { meta: "Hoje", status: "Entrada", title: "Pedido #8391", value: "+ R$ 60,80" },
      { meta: "Ontem", status: "Taxa", title: "Comissão Suwave", value: "- R$ 8,40" },
      { meta: "08/06", status: "Repasse", title: "Saque aprovado", value: "- R$ 800,00" },
    ],
    description: "Movimentações financeiras e taxas da operação.",
    href: "/finance/statement",
    id: "finance/statement",
    section: "Financeiro",
    title: "Extrato",
  },
  "finance/withdrawals": {
    action: { href: "/reviews", label: "Avaliações" },
    checklist: ["Saldo disponível", "Chave Pix", "Conta bancária", "Histórico de repasses"],
    description: "Solicitação e acompanhamento de repasses para o lojista.",
    href: "/finance/withdrawals",
    id: "finance/withdrawals",
    section: "Financeiro",
    title: "Saques",
  },
  reviews: {
    action: { href: "/reviews/reputation", label: "Reputação" },
    cards: [
      { eyebrow: "Média", title: "Avaliação", value: "4,8" },
      { eyebrow: "Total", title: "Comentários", value: "128" },
    ],
    description: "Avaliações recebidas pela loja e pelos pedidos.",
    href: "/reviews",
    id: "reviews",
    items: [
      { meta: "5 estrelas", status: "Respondida", title: "Entrega rápida", value: "Maria S." },
      { meta: "4 estrelas", status: "Pendente", title: "Bom atendimento", value: "João P." },
    ],
    section: "Qualidade",
    title: "Avaliações",
  },
  "reviews/reputation": {
    action: { href: "/settings", label: "Configurações" },
    checklist: ["Tempo de preparo", "Cancelamentos", "Notas dos clientes", "Respostas do lojista"],
    description: "Indicadores de reputação usados para destaque e confiança.",
    href: "/reviews/reputation",
    id: "reviews/reputation",
    section: "Qualidade",
    title: "Reputação",
  },
  settings: {
    action: { href: "/settings/team", label: "Equipe" },
    checklist: ["Dados da conta", "Notificações", "Permissões", "Preferências"],
    description: "Configurações gerais do app lojista.",
    href: "/settings",
    id: "settings",
    section: "Sistema",
    title: "Configurações",
  },
  "settings/team": {
    action: { href: "/settings/integrations", label: "Integrações" },
    items: [
      { meta: "Dono", status: "Ativo", title: "Ana Silva", value: "Admin" },
      { meta: "Operador", status: "Ativo", title: "Carlos Lima", value: "Pedidos" },
    ],
    description: "Usuários internos da loja e níveis de permissão.",
    href: "/settings/team",
    id: "settings/team",
    section: "Sistema",
    title: "Equipe",
  },
  "settings/integrations": {
    action: { href: "/dashboard", label: "Voltar ao início" },
    checklist: ["WhatsApp", "Pagamentos", "Impressora", "Mapas e entrega"],
    description: "Preparação para integrações operacionais do lojista.",
    href: "/settings/integrations",
    id: "settings/integrations",
    section: "Sistema",
    title: "Integrações",
  },
};

export const navigationGroups = [
  {
    label: "Acesso",
    links: [sellerPages.login, sellerPages.register, sellerPages["forgot-password"]],
  },
  {
    label: "Operação",
    links: [sellerPages.dashboard, sellerPages.orders, sellerPages.products, sellerPages.finance],
  },
  {
    label: "Loja",
    links: [sellerPages["store/profile"], sellerPages["store/hours"], sellerPages["store/delivery"]],
  },
  {
    label: "Catálogo",
    links: [sellerPages.products, sellerPages["products/new"], sellerPages["products/categories"], sellerPages["products/stock"]],
  },
  {
    label: "Pedidos",
    links: [sellerPages.orders, sellerPages["orders/current"], sellerPages["orders/history"], sellerPages["orders/returns"]],
  },
  {
    label: "Comercial",
    links: [sellerPages.promotions, sellerPages["promotions/new"], sellerPages["promotions/cashback"]],
  },
  {
    label: "Qualidade",
    links: [sellerPages.reviews, sellerPages["reviews/reputation"], sellerPages.settings],
  },
];
