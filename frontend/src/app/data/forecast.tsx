"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ForecastMenu } from "@/components/ui/forecast-menu";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Forecast = {
    dt: number
    temp: number
    pressure: number
    humidity: number
    clouds: number
}

const SortTable = ({ column, children }: { column: Column<Forecast>, children: React.ReactNode }) => {
    return <Button variant="ghost" onClick={() => {
      column.toggleSorting(column.getIsSorted() === "asc")}}>
      {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
}

export const columns: ColumnDef<Forecast>[] = [
  {
    id: "actions",
    header: ({ table }) => {
      return <ForecastMenu table={table} />;
    },
    cell: ({ row, table }) => {
      const selectedCount = table.getSelectedRowModel().rows.length;
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
  },
  {
    accessorKey: "dt",
    header: ({ column }) => {
        return <SortTable column={column}>
            Date & Time
        </SortTable>
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
        return <SortTable column={column}>
            Temperature (°C)
        </SortTable>
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
        return <SortTable column={column}>
            Pressure (hPa)
        </SortTable>
    },
    cell: ({ row }) => {
        return row.original.pressure.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "humidity",
    header: ({ column }) => {
        return <SortTable column={column}>
            Humidity (%)
        </SortTable>
    },
    cell: ({ row }) => {
        return row.original.humidity.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "clouds",
    header: ({ column }) => {
        return <SortTable column={column}>
            Clouds (%)
        </SortTable>
    },
    cell: ({ row }) => {
        return row.original.clouds.toFixed(2);
    },
    enableSorting: true
  },
]