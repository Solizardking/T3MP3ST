import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { tradingConfig } from "../config";
import { PhoenixExchangeAdapter } from "../exchanges/phoenix-adapter";
import { TrendEngine, type TrendEngineSnapshot } from "../core/trend-engine";
import { formatNumber } from "../utils/format";
import { DataTable, type TableColumn } from "./components/DataTable";
import {
  FooterHint,
  HeaderPanel,
  MetricGrid,
  SafetyPanel,
  formatPositionSide,
} from "./components/PhoenixPanels";

const READY_MESSAGE = "Waiting for Phoenix market data";

interface TrendAppProps {
  onExit: () => void;
}

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function TrendApp({ onExit }: TrendAppProps) {
  const [snapshot, setSnapshot] = useState<TrendEngineSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<TrendEngine | null>(null);

  useInput(
    (input, key) => {
      if (key.escape) {
        engineRef.current?.stop();
        onExit();
      }
    },
    { isActive: inputSupported }
  );

  useEffect(() => {
    const rpcUrl = process.env.SOLANA_RPC_URL;
    const authority = process.env.WALLET_AUTHORITY;
    if (!rpcUrl) {
      setError(new Error("Missing SOLANA_RPC_URL environment variable"));
      return;
    }
    try {
      const adapter = new PhoenixExchangeAdapter({
        rpcUrl,
        authority,
        symbol: tradingConfig.symbol,
      });
      const engine = new TrendEngine(tradingConfig, adapter);
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());
      const handler = (next: TrendEngineSnapshot) => {
        setSnapshot({ ...next, tradeLog: [...next.tradeLog] });
      };
      engine.on("update", handler);
      engine.start();
      return () => {
        engine.off("update", handler);
        engine.stop();
      };
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  if (error) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">Startup failed: {error.message}</Text>
        <Text color="gray">Check SOLANA_RPC_URL, WALLET_AUTHORITY, Phoenix API connectivity, and wallet permissions.</Text>
      </Box>
    );
  }

  if (!snapshot) {
    return (
      <Box padding={1}>
        <Text>Initializing Phoenix TA trend strategy...</Text>
      </Box>
    );
  }

  const { position, tradeLog, openOrders, trend, ready, lastPrice, sma30, sessionVolume } = snapshot;
  const hasPosition = Math.abs(position.positionAmt) > 1e-5;
  const lastLogs = tradeLog.slice(-5);
  const sortedOrders = [...openOrders].sort((a, b) => (Number(b.updateTime ?? 0) - Number(a.updateTime ?? 0)) || Number(b.orderId) - Number(a.orderId));
  const orderRows = sortedOrders.slice(0, 8).map((order) => ({
    id: order.orderId,
    side: order.side,
    type: order.type,
    price: order.price,
    qty: order.origQty,
    filled: order.executedQty,
    status: order.status,
  }));
  const orderColumns: TableColumn[] = [
    { key: "id", header: "ID", align: "right", minWidth: 6 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "type", header: "Type", minWidth: 10 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "qty", header: "Qty", align: "right", minWidth: 8 },
    { key: "filled", header: "Filled", align: "right", minWidth: 8 },
    { key: "status", header: "Status", minWidth: 10 },
  ];
  const trendLabel = trend === "做多" ? "LONG bias" : trend === "做空" ? "SHORT bias" : "No signal";
  const stopDistance = hasPosition && lastPrice != null
    ? Math.abs(lastPrice - position.entryPrice)
    : 0;

  return (
    <Box flexDirection="column" paddingX={1} paddingY={0}>
      <HeaderPanel
        title="Phoenix TA Trend Guard"
        subtitle="SMA30 signal lane for Phoenix perpetual futures on Solana."
        symbol={snapshot.symbol}
        ready={ready}
        lastUpdated={snapshot.lastUpdated}
      />

      <MetricGrid
        metrics={[
          { label: "Last price", value: `${formatNumber(lastPrice, 2)} USDC`, tone: "info" },
          { label: "SMA30", value: `${formatNumber(sma30, 2)} USDC`, tone: "muted" },
          { label: "Trend", value: trendLabel, tone: trendLabel === "No signal" ? "warn" : "ok" },
          { label: "Session volume", value: `${formatNumber(sessionVolume, 2)} USDC`, tone: "info" },
          { label: "Trades", value: String(snapshot.totalTrades), tone: "muted" },
          { label: "Total PnL", value: `${formatNumber(snapshot.totalProfit, 4)} USDC`, tone: snapshot.totalProfit >= 0 ? "ok" : "danger" },
        ]}
      />

      <Box flexDirection="row" marginBottom={1}>
        <Box flexDirection="column" marginRight={4}>
          <Text color="greenBright">Position</Text>
          {hasPosition ? (
            <>
              <Text>
                Side: {formatPositionSide(position.positionAmt)} | Size: {formatNumber(Math.abs(position.positionAmt), 4)} | Entry: {formatNumber(position.entryPrice, 2)}
              </Text>
              <Text>
                Mark: {formatNumber(position.markPrice, 2)} | PnL: {formatNumber(snapshot.pnl, 4)} USDC | Unrealized: {formatNumber(snapshot.unrealized, 4)} USDC
              </Text>
              <Text color="gray">
                Price distance from entry: {formatNumber(stopDistance, 2)} USDC
              </Text>
            </>
          ) : (
            <Text color="gray">Flat. No active position from the Phoenix account snapshot.</Text>
          )}
        </Box>
        <Box flexDirection="column">
          <Text color="greenBright">Signal guard</Text>
          {snapshot.lastOpenSignal.side ? (
            <Text>
              Last entry signal: {snapshot.lastOpenSignal.side} @ {formatNumber(snapshot.lastOpenSignal.price, 2)}
            </Text>
          ) : (
            <Text color="gray">No entry signal is active.</Text>
          )}
          <Text color="gray">Feed status: {ready ? "subscribed" : READY_MESSAGE}</Text>
        </Box>
      </Box>

      <SafetyPanel
        items={[
          { label: "Mode", detail: "Prefer Vulcan paper mode before enabling live authority.", tone: "warn" },
          { label: "Orders", detail: "Market and stop orders are irreversible once signed on Solana mainnet.", tone: "danger" },
          { label: "Risk", detail: "Phoenix account health, mark price, and funding should be reviewed outside raw PnL.", tone: "info" },
        ]}
      />

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">Open Phoenix orders</Text>
        {orderRows.length > 0 ? (
          <DataTable columns={orderColumns} rows={orderRows} emptyLabel="No open orders" />
        ) : (
          <Text color="gray">No open orders</Text>
        )}
      </Box>

      <Box flexDirection="column">
        <Text color="yellow">Recent strategy events</Text>
        {lastLogs.length > 0 ? (
          lastLogs.map((item, index) => (
            <Text key={`${item.time}-${index}`}>
              [{item.time}] [{item.type}] {item.detail}
            </Text>
          ))
        ) : (
          <Text color="gray">No log entries yet</Text>
        )}
      </Box>
      <FooterHint />
    </Box>
  );
}
