"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Forecast } from "./forecast";
import { Checkbox } from "@/components/ui/checkbox";
import { ForecastMenu } from "@/components/ui/forecast-menu";

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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "dt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
    header: "Temperature (°C)",
    cell: ({ row }) => {
      //Convert kelvin to celsius
      const temp = row.original.temp - 273.15;
      return temp.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "pressure",
    header: "Pressure (hPa)",
    cell: ({ row }) => {
      return row.original.pressure.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "humidity",
    header: "Humidity (%)",
    cell: ({ row }) => {
      return row.original.humidity.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "clouds",
    header: "Clouds (%)",
    cell: ({ row }) => {
      return row.original.clouds.toFixed(2);
    },
    enableSorting: true,
  },
];
