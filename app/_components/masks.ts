export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function maskWhatsapp(value: string) {
  const rawDigits = onlyDigits(value);
  const nationalDigits =
    rawDigits.length > 11 && rawDigits.startsWith("55")
      ? rawDigits.slice(2)
      : rawDigits;
  const digits = nationalDigits.slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  if (digits.length <= 6) {
    return digits.replace(/(\d{2})(\d{1,4})/, "($1) $2");
  }

  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
  }

  return digits.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
}

export function maskCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return digits.replace(/(\d{5})(\d{1,3})/, "$1-$2");
}

export function maskCnpj(value: string) {
  return onlyDigits(value)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function maskCpf(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function maskCurrencyBRL(value: string) {
  const digits = onlyDigits(value);
  const cents = Number(digits || "0");

  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(cents / 100);
}

export function unmaskCurrencyBRL(value: string) {
  return Number(onlyDigits(value) || "0") / 100;
}

export function maskTime(value: string) {
  const digits = onlyDigits(value).slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return digits.replace(/(\d{2})(\d{1,2})/, "$1:$2");
}

export function maskUf(value: string) {
  return value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
}
