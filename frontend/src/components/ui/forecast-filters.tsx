"use client";

import { Forecast } from "@/app/data/forecast";
import { Input } from "./input";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { DatePickerWithRange } from "./date-range-picker";
import { DateRange } from "react-day-picker";
import { Dispatch, SetStateAction, useState } from "react";
export function ForecastFilters({
  table,
  setFilter,
}: {
  table: Table<Forecast>;
  setFilter: Dispatch<SetStateAction<ColumnFiltersState>>;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Filter Temp..."
        className="max-w-sm"
        onChange={e => {
          if (e.target.value) {
            setFilter((prev: ColumnFiltersState) => {
              return [
                ...prev.filter(filter => filter.id !== "temp"),
                {
                  id: "temp",
                  value: `gte:${parseInt(e.target.value) + 273.15}`,
                },
              ];
            });
          } else {
            setFilter((prev: ColumnFiltersState) => {
              return prev.filter(filter => filter.id !== "temp");
            });
          }
        }}
      />
      <DatePickerWithRange
        date={date}
        setDate={setDate}
        onDateChange={(date: DateRange | undefined) => {
          if (date) {
            if (date.from && date.to) {
              const dateFrom = date.from?.getTime() / 1000;
              const dateTo = date.to?.getTime() / 1000;
              setFilter((prev: ColumnFiltersState) => [
                ...prev.filter(filter => filter.id !== "dt"),
                { id: "dt", value: `between:${dateFrom},${dateTo}` },
              ]);
            } else {
              setFilter((prev: ColumnFiltersState) => [
                ...prev.filter(filter => filter.id !== "dt"),
              ]);
            }
          }
        }}
      />
    </div>
  );
}
