import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { makerConfig } from "../config";
import { PhoenixExchangeAdapter } from "../exchanges/phoenix-adapter";
import { MakerEngine, type MakerEngineSnapshot } from "../core/maker-engine";
import { DataTable, type TableColumn } from "./components/DataTable";
import { formatNumber } from "../utils/format";
import {
  FooterHint,
  HeaderPanel,
  MetricGrid,
  SafetyPanel,
  formatPositionSide,
} from "./components/PhoenixPanels";

interface MakerAppProps {
  onExit: () => void;
}

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function MakerApp({ onExit }: MakerAppProps) {
  const [snapshot, setSnapshot] = useState<MakerEngineSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<MakerEngine | null>(null);

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
        symbol: makerConfig.symbol,
      });
      const engine = new MakerEngine(makerConfig, adapter);
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());
      const handler = (next: MakerEngineSnapshot) => {
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
        <Text>Initializing Phoenix FIFO maker...</Text>
      </Box>
    );
  }

  const topBid = snapshot.topBid;
  const topAsk = snapshot.topAsk;
  const spreadDisplay = snapshot.spread != null ? `${snapshot.spread.toFixed(4)} USDC` : "-";
  const hasPosition = Math.abs(snapshot.position.positionAmt) > 1e-5;
  const sortedOrders = [...snapshot.openOrders].sort((a, b) => (Number(b.updateTime ?? 0) - Number(a.updateTime ?? 0)) || Number(b.orderId) - Number(a.orderId));
  const openOrderRows = sortedOrders.slice(0, 8).map((order) => ({
    id: order.orderId,
    side: order.side,
    price: order.price,
    qty: order.origQty,
    filled: order.executedQty,
    reduceOnly: order.reduceOnly ? "yes" : "no",
    status: order.status,
  }));
  const openOrderColumns: TableColumn[] = [
    { key: "id", header: "ID", align: "right", minWidth: 6 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "qty", header: "Qty", align: "right", minWidth: 8 },
    { key: "filled", header: "Filled", align: "right", minWidth: 8 },
    { key: "reduceOnly", header: "RO", minWidth: 4 },
    { key: "status", header: "Status", minWidth: 10 },
  ];

  const desiredRows = snapshot.desiredOrders.map((order, index) => ({
    index: index + 1,
    side: order.side,
    price: order.price,
    amount: order.amount,
    reduceOnly: order.reduceOnly ? "yes" : "no",
  }));
  const desiredColumns: TableColumn[] = [
    { key: "index", header: "#", align: "right", minWidth: 2 },
    { key: "side", header: "Side", minWidth: 4 },
    { key: "price", header: "Price", align: "right", minWidth: 10 },
    { key: "amount", header: "Qty", align: "right", minWidth: 8 },
    { key: "reduceOnly", header: "RO", minWidth: 4 },
  ];

  const lastLogs = snapshot.tradeLog.slice(-5);
  const notional = snapshot.position.markPrice != null
    ? Math.abs(snapshot.position.positionAmt) * snapshot.position.markPrice
    : 0;

  return (
    <Box flexDirection="column" paddingX={1}>
      <HeaderPanel
        title="Phoenix FIFO Maker"
        subtitle="Two-sided maker lane for Phoenix's FIFO order book and Solana settlement."
        symbol={snapshot.symbol}
        ready={snapshot.ready}
        lastUpdated={snapshot.lastUpdated}
      />

      <MetricGrid
        metrics={[
          { label: "Best bid", value: `${formatNumber(topBid, 2)} USDC`, tone: "ok" },
          { label: "Best ask", value: `${formatNumber(topAsk, 2)} USDC`, tone: "danger" },
          { label: "Spread", value: spreadDisplay, tone: snapshot.spread != null && snapshot.spread > 0 ? "info" : "warn" },
          { label: "Session volume", value: `${formatNumber(snapshot.sessionVolume, 2)} USDC`, tone: "info" },
          { label: "Open orders", value: String(snapshot.openOrders.length), tone: snapshot.openOrders.length ? "ok" : "warn" },
          { label: "Target quotes", value: String(snapshot.desiredOrders.length), tone: snapshot.desiredOrders.length ? "ok" : "warn" },
        ]}
      />

      <Box flexDirection="row" marginBottom={1}>
        <Box flexDirection="column" marginRight={4}>
          <Text color="greenBright">Position</Text>
          {hasPosition ? (
            <>
              <Text>
                Side: {formatPositionSide(snapshot.position.positionAmt)} | Size: {formatNumber(Math.abs(snapshot.position.positionAmt), 4)} | Entry: {formatNumber(snapshot.position.entryPrice, 2)}
              </Text>
              <Text>
                Mark: {formatNumber(snapshot.position.markPrice, 2)} | Notional: {formatNumber(notional, 2)} USDC
              </Text>
              <Text>
                Strategy PnL: {formatNumber(snapshot.pnl, 4)} USDC | Account unrealized: {formatNumber(snapshot.accountUnrealized, 4)} USDC
              </Text>
            </>
          ) : (
            <Text color="gray">Flat. Maker is quoting without active inventory.</Text>
          )}
        </Box>
        <Box flexDirection="column">
          <Text color="greenBright">Desired Phoenix quotes</Text>
          {desiredRows.length > 0 ? (
            <DataTable columns={desiredColumns} rows={desiredRows} emptyLabel="No desired quotes" />
          ) : (
            <Text color="gray">No desired quotes</Text>
          )}
          <Text>
            Cumulative volume: {formatNumber(snapshot.sessionVolume, 2)} USDC
          </Text>
        </Box>
      </Box>

      <SafetyPanel
        items={[
          { label: "FIFO", detail: "Phoenix user-facing books use price-time priority; avoid churn that only loses queue position.", tone: "info" },
          { label: "Self trade", detail: "Review self-trade prevention and existing orders before quoting both sides.", tone: "warn" },
          { label: "Live orders", detail: "Limit orders and cancels mutate mainnet state once signed.", tone: "danger" },
        ]}
      />

      <Box flexDirection="column" marginBottom={1}>
        <Text color="yellow">Open Phoenix orders</Text>
        {openOrderRows.length > 0 ? (
          <DataTable columns={openOrderColumns} rows={openOrderRows} emptyLabel="No open orders" />
        ) : (
          <Text color="gray">No open orders</Text>
        )}
      </Box>

      <Box flexDirection="column">
        <Text color="yellow">Recent maker events</Text>
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
