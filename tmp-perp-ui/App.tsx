import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { TrendApp } from "./TrendApp";
import { MakerApp } from "./MakerApp";
import { OffsetMakerApp } from "./OffsetMakerApp";

interface StrategyOption {
  id: "trend" | "maker" | "offset-maker";
  label: string;
  description: string;
  route: string;
  component: React.ComponentType<{ onExit: () => void }>;
}

const STRATEGIES: StrategyOption[] = [
  {
    id: "trend",
    label: "Phoenix TA Trend Guard",
    description: "SMA30 signal loop with Phoenix order controls, reduce-only exits, and live feed status.",
    route: "Vulcan parity: TA strategy, candles, mark price, open orders.",
    component: TrendApp,
  },
  {
    id: "maker",
    label: "Phoenix FIFO Maker",
    description: "Two-sided passive liquidity view for Phoenix's price-time order book and quote refresh loop.",
    route: "Vulcan parity: orderbook, limit orders, cancel/modify, account state.",
    component: MakerApp,
  },
  {
    id: "offset-maker",
    label: "Phoenix Depth Offset Maker",
    description: "Depth-aware maker lane that offsets quotes and retreats during strong book imbalance.",
    route: "Vulcan parity: grid-style quoting, orderbook depth, risk-triggered cancels.",
    component: OffsetMakerApp,
  },
];

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function App() {
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<StrategyOption | null>(null);

  useInput(
    (input, key) => {
      if (selected) return;
      if (key.upArrow) {
        setCursor((prev) => (prev - 1 + STRATEGIES.length) % STRATEGIES.length);
      } else if (key.downArrow) {
        setCursor((prev) => (prev + 1) % STRATEGIES.length);
      } else if (key.return) {
        const strategy = STRATEGIES[cursor];
        if (strategy) {
          setSelected(strategy);
        }
      }
    },
    { isActive: inputSupported && !selected }
  );

  if (selected) {
    const Selected = selected.component;
    return <Selected onExit={() => setSelected(null)} />;
  }

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1} paddingY={0} marginBottom={1}>
        <Text color="cyanBright">Vulcan Phoenix Perps Console</Text>
        <Text color="gray">Agent-friendly terminal UI for Phoenix perpetual futures on Solana.</Text>
        <Text color="yellowBright">Live mode can place irreversible mainnet orders. Use paper mode and strict wallet permissions for agent runs.</Text>
      </Box>
      <Text color="gray">Use Up/Down to select, Enter to start, Ctrl+C to exit.</Text>
      <Box flexDirection="column" marginTop={1}>
        {STRATEGIES.map((strategy, index) => {
          const active = index === cursor;
          return (
            <Box key={strategy.id} flexDirection="column" marginBottom={1} borderStyle={active ? "single" : undefined} borderColor={active ? "green" : undefined} paddingX={active ? 1 : 0}>
              <Text color={active ? "greenBright" : undefined}>
                {active ? ">" : " "} {strategy.label}
              </Text>
              <Text color="gray">  {strategy.description}</Text>
              <Text color="gray">  {strategy.route}</Text>
            </Box>
          );
        })}
      </Box>
      <Box flexDirection="column" marginTop={1}>
        <Text color="cyanBright">Phoenix docs map</Text>
        <Text color="gray">Market data: prices, orderbooks, candles, funding, trades.</Text>
        <Text color="gray">Trading: market/limit orders, take-profit, stop-loss, cross and isolated margin.</Text>
        <Text color="gray">Agent surface: Vulcan JSON output and local MCP server; keep dangerous mode opt-in only.</Text>
      </Box>
    </Box>
  );
}
