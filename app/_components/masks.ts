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
