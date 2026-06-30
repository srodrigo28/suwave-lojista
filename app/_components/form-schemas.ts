import { z } from "zod";
import { onlyDigits, unmaskCurrencyBRL } from "./masks";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe o e-mail.")
  .email("Informe um e-mail válido.")
  .transform((value) => value.toLowerCase());

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha."),
});

export const registerSchema = z.object({
  email: emailSchema,
  fullName: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .refine((value) => value.split(/\s+/).filter(Boolean).length >= 2, "Informe nome e sobrenome."),
  password: z.string().min(6, "Use uma senha com pelo menos 6 caracteres."),
  whatsapp: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length >= 10 && value.length <= 11, "Informe um WhatsApp com DDD."),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    confirm: z.string().min(1, "Confirme a nova senha."),
    password: z.string().min(6, "Use uma senha com pelo menos 6 caracteres."),
    token: z.string().min(1, "Link inválido. Solicite um novo link de redefinição."),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem.",
    path: ["confirm"],
  });

export const profileSchema = z.object({
  category: z.string().min(1, "Essa seleção é obrigatória."),
  cep: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length === 8, "Informe um CEP válido."),
  city: z.string().trim().min(2, "Informe a cidade."),
  cnpj: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length === 14, "Informe um CNPJ válido."),
  email: emailSchema,
  minimumOrder: z
    .string()
    .refine((value) => unmaskCurrencyBRL(value) > 0, "Informe um pedido mínimo maior que zero."),
  neighborhood: z.string().trim().min(2, "Informe o bairro."),
  number: z.string().trim().min(1, "Informe o número."),
  ownerName: z.string().trim().min(3, "Informe o nome do sócio."),
  ownerPhone: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length >= 10 && value.length <= 11, "Informe um telefone com DDD."),
  state: z.string().trim().length(2, "Informe a UF."),
  street: z.string().trim().min(2, "Informe a rua."),
  storeName: z.string().trim().min(2, "Informe o nome fantasia."),
  whatsapp: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length >= 10 && value.length <= 11, "Informe um telefone com DDD."),
});

export const deliverySchema = z.object({
  cep: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length === 8, "Informe um CEP válido."),
  fee: z.string().refine((value) => unmaskCurrencyBRL(value) >= 0, "Informe uma taxa válida."),
  radius: z.coerce.number().positive("Informe um raio maior que zero."),
});

export const productSchema = z.object({
  category: z.string().min(1, "Selecione uma categoria."),
  price: z.string().refine((value) => unmaskCurrencyBRL(value) > 0, "Informe um preço válido."),
  stock: z.coerce.number().int("Informe um estoque inteiro.").min(0, "O estoque não pode ser negativo."),
  title: z.string().trim().min(3, "Informe o nome do produto."),
});

export function zodErrors<T extends string>(error: z.ZodError): Partial<Record<T, string>> {
  return Object.fromEntries(
    error.issues
      .filter((issue) => issue.path.length)
      .map((issue) => [String(issue.path[0]), issue.message]),
  ) as Partial<Record<T, string>>;
}
