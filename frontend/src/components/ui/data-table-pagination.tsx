"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  RowSelectionState,
  ColumnFiltersState,
  Table,
} from "@tanstack/react-table";

import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, ComponentType, createElement, Dispatch, SetStateAction   } from "react";
import { userAgent } from "next/server";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  queryFn: (
    pageIndex: number,
    pageSize: number,
    sorting?: SortingState,
    filter?: ColumnFiltersState
  ) => Promise<{ list: TData[]; total: number }>;
  rowCount: number;
  pageIndex?: number;
  pageSize?: number;
  rowId?: string;
  filterUI?: ComponentType<{
    table: Table<TData>;
    setFilter: Dispatch<SetStateAction<ColumnFiltersState>>;
  }>;
}

export function DataTablePagination<TData, TValue>({
  columns,
  data: initialData,
  rowCount: initialRowCount,
  pageIndex,
  pageSize,
  queryFn,
  filterUI,
  rowId = "id",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data, setData] = useState<TData[]>(initialData || []);
  const [rowCount, setRowCount] = useState<number>(initialRowCount || 0);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndex ?? 0,
    pageSize: pageSize ?? 10,
  });

  useEffect(() => { console.log(columnFilters) }, [columnFilters]);

  const isInitialRender = useRef(true);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getRowId: (row) => {
      // @ts-expect-error - Access the rowId property dynamically
      return String(row[rowId]);
    },
  });

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        const result = await queryFn(
          pagination.pageIndex, 
          pagination.pageSize, 
          sorting,
          columnFilters
        );
        if (result && typeof result === "object") {
          setData(result.list || []);
          setRowCount(result.total || 0);
        } else {
          console.error("Invalid response format:", result);
          setData([]);
          setRowCount(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setRowCount(0);
      }
    };

    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters, queryFn]);

  return (
    <div>
      <div className="flex items-center py-4">
        {filterUI && createElement(filterUI, { table, setFilter: setColumnFilters })}
      </div>
      <div className="rounded-md border">
        <TableComponent>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </TableComponent>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
}
