"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Forecast } from "./forecast";

export const columns: ColumnDef<Forecast>[] = [
  {
    accessorKey: "dt",
    header: ({ column }) => {
        return <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date & Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    },
    cell: ({ row }) => {
        const date = new Date(row.original.dt * 1000);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    enableSorting: true,
  },
  {
    accessorKey: "main.temp",
    header: "Temperature (°C)",
    cell: ({ row }) => {
        //Convert kelvin to celsius
        const temp = row.original.temp - 273.15;
        return temp.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "main.pressure",
    header: "Pressure (hPa)",
    cell: ({ row }) => {
        return row.original.pressure.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "main.humidity",
    header: "Humidity (%)",
    cell: ({ row }) => {
        return row.original.humidity.toFixed(2);
    },
    enableSorting: true,
  },
  {
    accessorKey: "clouds.all",
    header: "Clouds (%)",
    cell: ({ row }) => {
        return row.original.clouds.toFixed(2);
    },
    enableSorting: true
  },
]