import { onlyDigits } from "./masks";

export type CepAddress = {
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  rua: string;
};

type ViaCepResponse = {
  bairro?: string;
  cep?: string;
  erro?: boolean;
  localidade?: string;
  logradouro?: string;
  uf?: string;
};

const cepCache = new Map<string, CepAddress>();

export async function fetchAddressByCep(value: string): Promise<CepAddress> {
  const cep = onlyDigits(value);

  if (cep.length !== 8) {
    throw new Error("Informe um CEP com 8 dígitos.");
  }

  const cached = cepCache.get(cep);
  if (cached) {
    return cached;
  }

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) {
    throw new Error("Não foi possível consultar o CEP agora.");
  }

  const data = (await response.json()) as ViaCepResponse;
  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }

  const address = {
    bairro: data.bairro ?? "",
    cep: data.cep ?? value,
    cidade: data.localidade ?? "",
    estado: data.uf ?? "",
    rua: data.logradouro ?? "",
  };

  cepCache.set(cep, address);
  return address;
}
