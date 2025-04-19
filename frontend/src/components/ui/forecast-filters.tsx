"use client";

import { Forecast } from "@/app/data/forecast";
import { Input } from "./input";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { DatePickerWithRange } from "./date-range-picker";
import { DateRange } from "react-day-picker";
import { Dispatch, SetStateAction } from "react";
export function ForecastFilters({
  table,
  setFilter,
}: {
  table: Table<Forecast>;
  setFilter: Dispatch<SetStateAction<ColumnFiltersState>>;
}) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Filter Temp..."
        className="max-w-sm"
        onChange={e => {
          setFilter((prev: ColumnFiltersState) => [
            ...prev,
            { id: "temp", value: `gte:${e.target.value}` },
          ]);
        }}
      />
      <DatePickerWithRange
        onDateChange={(date: DateRange | undefined) => {
          if (date) {
            const dateFrom = (date.from?.getTime() ?? 0) / 1000;
            console.log(dateFrom);
            setFilter((prev: ColumnFiltersState) => [
              ...prev,
              { id: "dt", value: `gte:${dateFrom}` },
            ]);
          }
        }}
      />
    </div>
  );
}
