import React from "react";
import { Box, Text } from "ink";

type Align = "left" | "right";

export interface TableColumn {
  key: string;
  header: string;
  align?: Align;
  minWidth?: number;
}

export interface DataTableProps<Row extends Record<string, unknown>> {
  columns: TableColumn[];
  rows: Row[];
  emptyLabel?: string;
  maxCellWidth?: number;
}

function formatCell(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "number") {
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(4).replace(/\.0+$/, ".0");
  }
  return String(value);
}

function truncate(text: string, width: number): string {
  if (text.length <= width) return text;
  if (width <= 1) return text.slice(0, width);
  return `${text.slice(0, width - 1)}.`;
}

function pad(text: string, width: number, align: Align): string {
  if (text.length >= width) return text;
  const padding = " ".repeat(width - text.length);
  return align === "right" ? padding + text : text + padding;
}

export function DataTable<Row extends Record<string, unknown>>({
  columns,
  rows,
  emptyLabel = "No rows",
  maxCellWidth = 24,
}: DataTableProps<Row>) {
  const widths = columns.map((col) => {
    const headerLength = col.header.length;
    const minWidth = col.minWidth ?? 0;
    const contentLength = rows.reduce((max, row) => {
      const cell = truncate(formatCell(row[col.key]), maxCellWidth);
      return Math.max(max, cell.length);
    }, 0);
    return Math.min(Math.max(headerLength, contentLength, minWidth), maxCellWidth);
  });

  if (rows.length === 0) {
    return <Text color="gray">{emptyLabel}</Text>;
  }

  return (
    <Box flexDirection="column">
      <Text color="gray">
        {columns
          .map((col, index) => {
            const width = widths[index] ?? col.header.length;
            return pad(col.header, width, col.align ?? "left");
          })
          .join("  ")}
      </Text>
      {rows.map((row, rowIndex) => (
        <Text key={rowIndex}>
          {columns
            .map((col, index) => {
              const align = col.align ?? "left";
              const cell = truncate(formatCell(row[col.key]), maxCellWidth);
              const width = widths[index] ?? Math.max(col.header.length, cell.length);
              return pad(cell, width, align);
            })
            .join("  ")}
        </Text>
      ))}
    </Box>
  );
}
