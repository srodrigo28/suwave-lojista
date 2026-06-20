# SUWAVE Logista

App web do lojista/vendedor.

Atualizado em 11/06/2026.

## Estado atual

- Next.js e TypeScript.
- App visual criado com 28 rotas `page.tsx`, contando a rota dinamica de edicao de produto.
- Fluxos de acesso, dashboard, loja, produtos, pedidos, comercial, financeiro, qualidade e configuracoes.
- Tela de splash/login ajustada ao visual solicitado com moldura de celular e marca `SUWAVE LOGISTA`.
- Fase operacional ligada a API real: login JWT, resumo, perfil editavel, produtos, estoque, pedidos, horarios, entrega e saques.
- Fallback visual preservado quando nao ha sessao/API disponivel.

## APIs base para integracao

- `GET /api/v1/seller/summary`
- `GET /api/v1/seller/profile`
- `PUT /api/v1/seller/profile`
- `GET /api/v1/products/me`
- `POST /api/v1/products`
- `PUT /api/v1/products/{product_id}`
- `DELETE /api/v1/products/{product_id}`
- `PATCH /api/v1/products/{product_id}/status`
- `GET /api/v1/orders/seller`
- `GET /api/v1/seller/settings`
- `PUT /api/v1/seller/settings`
- `GET /api/v1/finance/wallet`
- `GET /api/v1/finance/affiliate/withdrawals`
- `POST /api/v1/finance/affiliate/withdrawals`

## Comandos

```powershell
npm install
npm run dev
npm run lint
npm run build
```

## Commit e push

Repositorio: `https://github.com/srodrigo28/suwave-logista.git`

Fluxo:

```powershell
git status --short --branch
npm run lint
npm run build
git add <arquivos-do-logista>
git commit -m "feat(logista): descricao"
git push origin main
```

Leituras de apoio:

- `docs/index.md`
- `..\..\docs\MAPA-COMMIT-PUSH-QUALIDADE-MODULOS.md`

## Proximas frentes

- Reputacao/avaliacoes.
- Equipe/configuracoes.
- Ajustes finos de regras comerciais.
- Modulos por segmento de vendedor (Foods, Roupas, Oficina/Maquinas) — ver `docs/index.md`.
