import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 13 && cleaned.startsWith("55")) {
    const ddd = cleaned.slice(2, 4);
    const num1 = cleaned.slice(4, 9);
    const num2 = cleaned.slice(9);
    return `+55 (${ddd}) ${num1}-${num2}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith("55")) {
    const ddd = cleaned.slice(2, 4);
    const num1 = cleaned.slice(4, 8);
    const num2 = cleaned.slice(8);
    return `+55 (${ddd}) ${num1}-${num2}`;
  }
  return phone;
}

export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo"
    });
  } catch {
    return isoString;
  }
}
