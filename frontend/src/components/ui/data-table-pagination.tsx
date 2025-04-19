"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  queryFn: (pageIndex: number, pageSize: number) => Promise<{ data: TData[]; total: number }>;
  total?: number;
  pageIndex?: number;
  pageSize?: number;
}

export function DataTablePagination<TData, TValue>({
  columns,
  data: initialData,
  total: initialTotal,
  pageIndex: initialPageIndex,
  pageSize: initialPageSize,
  queryFn,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TData[]>(initialData || []);
  const [total, setTotal] = useState<number>(initialTotal || 0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex ?? 0,
    pageSize: initialPageSize ?? 10,
  });
  
  // Use a ref to track if this is the initial render
  const isInitialRender = useRef(true);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: total,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    pageCount: Math.ceil(total / pagination.pageSize),
  });

  // Fetch data when pagination changes, but not on initial render
  useEffect(() => {
    // Skip the initial fetch
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    const fetchData = async () => {
      try {
        const result = await queryFn(pagination.pageIndex, pagination.pageSize);
        if (result && typeof result === 'object') {
          setData(result.data || []);
          setTotal(result.total || 0);
        } else {
          console.error("Invalid response format:", result);
          setData([]);
          setTotal(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setTotal(0);
      }
    };

    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, queryFn]);

  return (
    <div>
      <div className="rounded-md border">
        <Table>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
