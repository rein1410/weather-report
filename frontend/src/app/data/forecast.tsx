"use client";

import { ColumnDef } from "@tanstack/react-table"

export type Forecast = {
    dt: number
    main: {
        temp: number
        temp_min: number
        temp_max: number
        pressure: number
        humidity: number
    }
    clouds: {
        all: number
    }
}
export const columns: ColumnDef<Forecast>[] = [
  {
    accessorKey: "dt",
    header: "Date & Time",
    cell: ({ row }) => {
        const date = new Date(row.original.dt * 1000);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
  },
  {
    accessorKey: "main.temp",
    header: "Temperature (°C)",
    cell: ({ row }) => {
        //Convert kelvin to celsius
        const temp = row.original.main.temp - 273.15;
        return temp.toFixed(2);
    },
  },
  {
    accessorKey: "main.pressure",
    header: "Pressure (hPa)",
    cell: ({ row }) => {
        return row.original.main.pressure.toFixed(2);
    },
  },
  {
    accessorKey: "main.humidity",
    header: "Humidity (%)",
    cell: ({ row }) => {
        return row.original.main.humidity.toFixed(2);
    },
  },
  {
    accessorKey: "clouds.all",
    header: "Clouds (%)",
    cell: ({ row }) => {
        return row.original.clouds.all.toFixed(2);
    },
  },
]