import { Forecast } from "@/app/data/forecast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export function ForecastMenu({ table }: { table: Table<Forecast> }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  
  useEffect(() => {
    const selectedRows = Object.keys(table.getState().rowSelection);
    if (selectedRows.length > forecasts.length) {
      const newSelectedForecasts = selectedRows.filter(row => !forecasts.map(f => f.dt).includes(parseInt(row)));
      const newForecast = table.getRow(newSelectedForecasts[0]).original;
      setForecasts([...forecasts, newForecast]);
    } else if (selectedRows.length < forecasts.length) {
      const filteredForecasts = forecasts.filter(f => selectedRows.includes(f.dt.toString()));
      setForecasts(filteredForecasts);
    }
  }, [table.getState().rowSelection]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              disabled={forecasts.length < 2}
              onSelect={(e) => {
                e.preventDefault();
                setDialogOpen(true);
              }}
            >
              Compare
            </DropdownMenuItem>
          </DialogTrigger>
          <DeviationDialog forecasts={forecasts} />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const DeviationDialog = ({ forecasts }: { forecasts: Forecast[] }) => {
  if (forecasts.length < 2) {
    return null;
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Compare</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Property</th>
              <th className="border p-2 text-left">Report 1</th>
              <th className="border p-2 text-left">Report 2</th>
              <th className="border p-2 text-left">Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-medium">Date</td>
              <td className="border p-2">{new Date(forecasts[0].dt * 1000).toLocaleDateString() + " " + new Date(forecasts[0].dt * 1000).toLocaleTimeString()}</td>
              <td className="border p-2">{new Date(forecasts[1].dt * 1000).toLocaleDateString() + " " + new Date(forecasts[1].dt * 1000).toLocaleTimeString()}</td>
              <td className="border p-2">-</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Temperature</td>
              <td className="border p-2">{forecasts[0].temp}</td>
              <td className="border p-2">{forecasts[1].temp}</td>
              <td className="border p-2">{Math.abs(forecasts[0].temp - forecasts[1].temp).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Pressure</td>
              <td className="border p-2">{forecasts[0].pressure}</td>
              <td className="border p-2">{forecasts[1].pressure}</td>
              <td className="border p-2">{Math.abs(forecasts[0].pressure - forecasts[1].pressure).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Humidity</td>
              <td className="border p-2">{forecasts[0].humidity}</td>
              <td className="border p-2">{forecasts[1].humidity}</td>
              <td className="border p-2">{Math.abs(forecasts[0].humidity - forecasts[1].humidity).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Clouds</td>
              <td className="border p-2">{forecasts[0].clouds}</td>
              <td className="border p-2">{forecasts[1].clouds}</td>
              <td className="border p-2">{Math.abs(forecasts[0].clouds - forecasts[1].clouds).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DialogContent>
  );
};
