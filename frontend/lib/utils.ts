import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "REAL_USER_VERIFIED":
      return "text-green-400";
    case "SPOOF_DETECTED":
      return "text-red-400";
    case "WAITING_FOR_HAND":
      return "text-amber-400";
    case "PROCESSING":
      return "text-cyan-400";
    default:
      return "text-gray-400";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "REAL_USER_VERIFIED":
      return "REAL USER VERIFIED";
    case "SPOOF_DETECTED":
      return "SPOOF DETECTED";
    case "WAITING_FOR_HAND":
      return "WAITING FOR HAND";
    case "PROCESSING":
      return "PROCESSING";
    default:
      return "UNKNOWN";
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
