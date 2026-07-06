import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import { makerConfig } from "../config";
import { PhoenixExchangeAdapter } from "../exchanges/phoenix-adapter";
import { OffsetMakerEngine, type OffsetMakerEngineSnapshot } from "../core/offset-maker-engine";
import { DataTable, type TableColumn } from "./components/DataTable";
import { formatNumber } from "../utils/format";
import {
  FooterHint,
  HeaderPanel,
  MetricGrid,
  SafetyPanel,
  formatPositionSide,
} from "./components/PhoenixPanels";

interface OffsetMakerAppProps {
  onExit: () => void;
}

const inputSupported = Boolean(process.stdin && (process.stdin as any).isTTY);

export function OffsetMakerApp({ onExit }: OffsetMakerAppProps) {
  const [snapshot, setSnapshot] = useState<OffsetMakerEngineSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<OffsetMakerEngine | null>(null);

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
      const engine = new OffsetMakerEngine(makerConfig, adapter);
      engineRef.current = engine;
      setSnapshot(engine.getSnapshot());
      const handler = (next: OffsetMakerEngineSnapshot) => {
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
        <Text>Initializing Phoenix depth offset maker...</Text>
      </Box>
    );
  }

  const topBid = snapshot.topBid;
  const topAsk = snapshot.topAsk;
  const spreadDisplay = snapshot.spread != null ? `${snapshot.spread.toFixed(4)} USDC` : "-";
  const hasPosition = Math.abs(snapshot.position.positionAmt) > 1e-5;
  const sortedOrders = [...snapshot.openOrders].sort((a, b) =>
    (Number(b.updateTime ?? 0) - Number(a.updateTime ?? 0)) || Number(b.orderId) - Number(a.orderId)
  );
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
  const imbalanceLabel = snapshot.depthImbalance === "balanced"
    ? "Balanced"
    : snapshot.depthImbalance === "buy_dominant"
    ? "Bid-heavy"
    : "Ask-heavy";
  const imbalanceTone = snapshot.depthImbalance === "balanced" ? "ok" : "warn";
  const notional = snapshot.position.markPrice != null
    ? Math.abs(snapshot.position.positionAmt) * snapshot.position.markPrice
    : 0;

  return (
    <Box flexDirection="column" paddingX={1}>
      <HeaderPanel
        title="Phoenix Depth Offset Maker"
        subtitle="Depth-aware quoting lane for Phoenix orderbook imbalance and Solana execution risk."
        symbol={snapshot.symbol}
        ready={snapshot.ready}
        lastUpdated={snapshot.lastUpdated}
      />

      <MetricGrid
        metrics={[
          { label: "Best bid", value: `${formatNumber(topBid, 2)} USDC`, tone: "ok" },
          { label: "Best ask", value: `${formatNumber(topAsk, 2)} USDC`, tone: "danger" },
          { label: "Spread", value: spreadDisplay, tone: "info" },
          { label: "Bid depth 10", value: formatNumber(snapshot.buyDepthSum10, 4), tone: "ok" },
          { label: "Ask depth 10", value: formatNumber(snapshot.sellDepthSum10, 4), tone: "danger" },
          { label: "Book state", value: imbalanceLabel, tone: imbalanceTone },
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
            <Text color="gray">Flat. Offset maker has no active inventory.</Text>
          )}
        </Box>
        <Box flexDirection="column">
          <Text color="greenBright">Quote controls</Text>
          <Text>
            BUY side: {snapshot.skipBuySide ? "paused" : "enabled"} | SELL side: {snapshot.skipSellSide ? "paused" : "enabled"}
          </Text>
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
          { label: "Depth", detail: "Offset quotes when the top 10 levels skew; pause the weak side during imbalance.", tone: "warn" },
          { label: "Grid", detail: "Treat this as grid-style liquidity, not a guaranteed maker rebate strategy.", tone: "info" },
          { label: "Live orders", detail: "Every signed cancel, replace, and limit order mutates Phoenix state.", tone: "danger" },
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
        <Text color="yellow">Recent offset-maker events</Text>
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
