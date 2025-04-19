import { Table } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Forecast } from "@/app/data/forecast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function ForecastMenu({ table }: { table: Table<Forecast> }) {
  const forecasts =
    table.getSelectedRowModel().rows.length > 0
      ? table.getSelectedRowModel().rows.map(row => row.original)
      : [];
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
              disabled={table.getSelectedRowModel().rows.length < 2}
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Compare</DialogTitle>
      </DialogHeader>
      <div className="flex flex-row gap-4 py-4">
        {forecasts.map((forecast, index) => (
          <div key={forecast.dt} className="flex flex-col gap-2">
            <h1 className="text-lg font-bold">Report {index + 1}</h1>
            <div>
              <h1>Temperature</h1>
              <h1>{forecast.temp}</h1>
            </div>
            <div>
              <h1>Pressure</h1>
              <h1>{forecast.pressure}</h1>
            </div>
            <div>
              <h1>Humidity</h1>
              <h1>{forecast.humidity}</h1>
            </div>
            <div>
              <div>
                <h1>Clouds</h1>
                <h1>{forecast.clouds}</h1>
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold">Deviation</h1>
          <div>
            <h1>Temperature</h1>
            <h1>{Math.abs(forecasts[0].temp - forecasts[1].temp)}</h1>
          </div>
          <div>
            <h1>Pressure</h1>
            <h1>{Math.abs(forecasts[0].pressure - forecasts[1].pressure)}</h1>
          </div>
          <div>
            <h1>Humidity</h1>
            <h1>{Math.abs(forecasts[0].humidity - forecasts[1].humidity)}</h1>
          </div>
          <div>
            <h1>Clouds</h1>
            <h1>{Math.abs(forecasts[0].clouds - forecasts[1].clouds)}</h1>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
