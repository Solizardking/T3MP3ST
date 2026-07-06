import React from "react";
import { Box, Text } from "ink";

type Tone = "ok" | "warn" | "danger" | "info" | "muted";

export interface Metric {
  label: string;
  value: string;
  tone?: Tone;
}

export interface SafetyItem {
  label: string;
  detail: string;
  tone?: Tone;
}

const TONE_COLORS: Record<Tone, string> = {
  ok: "greenBright",
  warn: "yellowBright",
  danger: "redBright",
  info: "cyanBright",
  muted: "gray",
};

export function toneColor(tone: Tone = "info"): string {
  return TONE_COLORS[tone];
}

export function operatorMode(): { label: string; tone: Tone; detail: string } {
  const paper = process.env.PHOENIX_PAPER_MODE === "1" || process.env.VULCAN_PAPER_MODE === "1";
  const authority = process.env.WALLET_AUTHORITY;
  if (paper) {
    return { label: "PAPER", tone: "ok", detail: "Paper mode requested; no real funds should move." };
  }
  if (!authority) {
    return { label: "READ-ONLY", tone: "warn", detail: "No WALLET_AUTHORITY set; market data only." };
  }
  return { label: "LIVE", tone: "danger", detail: "Authority present; orders can become irreversible mainnet transactions." };
}

export function formatTimestamp(value: number | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString();
}

export function formatPositionSide(positionAmt: number): string {
  if (positionAmt > 0) return "LONG";
  if (positionAmt < 0) return "SHORT";
  return "FLAT";
}

export function HeaderPanel({
  title,
  subtitle,
  symbol,
  ready,
  lastUpdated,
}: {
  title: string;
  subtitle: string;
  symbol: string;
  ready: boolean;
  lastUpdated?: number | null;
}) {
  const mode = operatorMode();
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1} paddingY={0} marginBottom={1}>
      <Text color="cyanBright">{title}</Text>
      <Text color="gray">{subtitle}</Text>
      <Text>
        Phoenix Perps on Solana | Market: {symbol} | Mode: <Text color={toneColor(mode.tone)}>{mode.label}</Text> | Feed:{" "}
        <Text color={ready ? "greenBright" : "yellowBright"}>{ready ? "LIVE" : "SYNCING"}</Text> | Updated: {formatTimestamp(lastUpdated)}
      </Text>
      <Text color={toneColor(mode.tone)}>{mode.detail}</Text>
    </Box>
  );
}

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <Box flexDirection="row" flexWrap="wrap">
      {metrics.map((metric) => (
        <Box key={metric.label} flexDirection="column" width={24} marginRight={2} marginBottom={1}>
          <Text color="gray">{metric.label}</Text>
          <Text color={toneColor(metric.tone)}>{metric.value}</Text>
        </Box>
      ))}
    </Box>
  );
}

export function SafetyPanel({ items }: { items: SafetyItem[] }) {
  return (
    <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1} paddingY={0} marginBottom={1}>
      <Text color="yellowBright">Risk gates</Text>
      {items.map((item) => (
        <Text key={item.label}>
          <Text color={toneColor(item.tone)}>{item.label}</Text>
          <Text color="gray"> - {item.detail}</Text>
        </Text>
      ))}
    </Box>
  );
}

export function FooterHint({ label = "Esc returns to strategy select. Ctrl+C exits." }: { label?: string }) {
  return <Text color="gray">{label}</Text>;
}
