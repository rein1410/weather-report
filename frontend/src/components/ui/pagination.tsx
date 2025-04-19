"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface PaginationProps<TData, TValue> {
  page: number;
  limit: number;
  totalPages: number;
}

export function Pagination<TData, TValue>({
  page,
  totalPages,
  limit,
}: PaginationProps<TData, TValue>) {
  const router = useRouter();
  const setPage = (page: number) => {
    router.push(`?page=${page}&limit=${limit}`);
  }

  return (
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
  );
}
