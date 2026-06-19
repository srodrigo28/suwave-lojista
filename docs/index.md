# SUWAVE Logista — índice de módulos por segmento

Atualizado em 13/06/2026.

Este índice mapeia os documentos e arquivos de código usados para organizar o
app `app/logista` em segmentos de vendedor: **Foods**, **Roupas** e
**Oficina / Máquinas**. Objetivo: reaproveitar o que já existe (tipos de
produto, categorias do marketplace) e não perder o fluxo entre sessões.

## Fonte de verdade (geral do projeto)

- Índice geral do fluxo: `../../docs/index.md`
- Controlador geral: `../../../docs/DOCS-CONTROLE.md`
- Status rápido atual: `../../../docs/STATUS-ATUAL.md`
- Plano detalhado/contrato: `../../../docs/contrato-plano.md`
- README do app lojista: `../README.md`

## Código relevante para os 3 módulos

| Arquivo | Papel |
| --- | --- |
| `../app/_components/seller-api.ts` | `SellerProductPayload` — define `type`, `category_id`, `subcategory_id`, `attributes`. |
| `../app/_components/product-form-screen.tsx` | Tela de cadastro/edição de produto — `productTypes` (mapa tipo → categoria/subcategoria) e `defaultAttributes`. |
| `../../api/app/schemas/product_schema.py` | Validação no backend — `ProductUpdateSchema.type` aceita `vehicle`, `fashion`, `food`, `real_estate`, `service`. |
| `../../web/src/app/listings/_components/listing-categories-screen.tsx` | Categorias/subcategorias do marketplace (cliente) — referência para `category_id`/`subcategory_id` válidos. |

## Mapeamento dos 3 módulos do Logista (implementado em 13/06/2026)

`product-form-screen.tsx` agora agrupa o seletor "Tipo" por módulo
(`<optgroup>`), usando uma `key` própria por opção (independente do `type`
enviado para a API), permitindo dois itens com o mesmo `type` (`service`,
`vehicle`) em módulos diferentes.

| Módulo | `key` | Tipo (`SellerProductPayload.type`) | `category_id` / `subcategory_id` |
| --- | --- | --- | --- |
| **Foods** | `food` | `food` | `delivery` / `food` |
| **Roupas** | `fashion` | `fashion` | `marketplace` / `fashion` |
| **Oficina / Máquinas** | `oficina` | `service` | `services` / `mechanics` |
| **Oficina / Máquinas** | `machinery` | `vehicle` | `classifieds` / `machinery` |
| Outros | `service`, `vehicle`, `real_estate` | `service` / `vehicle` / `real_estate` | mantidos como antes |

Decisão (13/06/2026): reaproveitar os tipos existentes `service` e `vehicle`
para o módulo "Oficina / Máquinas" — sem alterar `ProductUpdateSchema` na API.
`attributes` (campo livre, sem validação no backend) ganhou defaults próprios
para `oficina` (especialidade, área de atendimento) e `machinery` (marca,
condição, horas de uso, garantia).

## Próximos passos

1. Validar com lojistas reais de oficina/máquinas se a subcategoria
   `classifieds/machinery` precisa existir também no app cliente
   (`listing-categories-screen.tsx`) para os anúncios aparecerem corretamente.
2. Avaliar se o dashboard/labels do Logista devem variar por módulo
   (ex.: "Pedidos" vs "Ordens de serviço") — não incluído nesta etapa.
3. Atualizar `../../../docs/contrato-plano.md` quando o módulo for validado em
   produção.
