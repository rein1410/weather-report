"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Forecast, SortableColumn } from "./forecast";
import { Checkbox } from "@/components/ui/checkbox";
import { ForecastMenu } from "@/components/ui/forecast-menu";

export const columns: ColumnDef<Forecast>[] = [
  {
    id: "actions",
    header: ({ table }) => {
      return <ForecastMenu table={table} />;
    },
    cell: ({ row, table }) => {
      const selectedCount = Object.keys(table.getState().rowSelection).length;
      const maxSelections = 2;
      const isSelected = row.getIsSelected();

      return (
        <Checkbox
          checked={isSelected}
          onCheckedChange={value => {
            if (value && !isSelected && selectedCount >= maxSelections) {
              return;
            }
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          disabled={!isSelected && selectedCount >= maxSelections}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "dt",
    header: ({ column }) => {
      return (
        <SortableColumn column={column}>
          Date & Time
        </SortableColumn>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.dt * 1000);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    enableSorting: true,
  },
  {
    accessorKey: "temp",
    header: ({ column }) => {
      return (
        <SortableColumn column={column}>
          Temperature (°C)
        </SortableColumn>
      );
    },
    cell: ({ row }) => {
      //Convert kelvin to celsius
      const temp = row.original.temp - 273.15;
      return temp.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "pressure",
    header: ({ column }) => {
      return (
        <SortableColumn column={column}>
          Pressure (hPa)
        </SortableColumn>
      );
    },
    cell: ({ row }) => {
      return row.original.pressure.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "humidity",
    header: ({ column }) => {
      return (
        <SortableColumn column={column}>
          Humidity (%)
        </SortableColumn>
      );
    },
    cell: ({ row }) => {
      return row.original.humidity.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "clouds",
    header: ({ column }) => {
      return (
        <SortableColumn column={column}>
          Clouds (%)
        </SortableColumn>
      );
    },
    cell: ({ row }) => {
      return row.original.clouds.toFixed(2);
    },
    enableSorting: true,
  },
];
