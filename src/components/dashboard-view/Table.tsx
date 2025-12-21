'use client';

/**
 * ReactTable Component
 * 
 * A reusable table component built on TanStack React Table v8.
 * Used by AdminTable and other data display components.
 */

import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    TableOptions,
} from '@tanstack/react-table';
import { Table as BsTable, Pagination, Form } from 'react-bootstrap';

interface ReactTableProps<T> {
    /** Column definitions */
    columns: ColumnDef<T, unknown>[];
    /** Data array */
    data: T[];
    /** Additional table options */
    options?: Partial<TableOptions<T>>;
    /** Number of rows per page (default: 10) */
    pageSize?: number;
    /** Whether to show pagination (default: true) */
    showPagination?: boolean;
    /** Available page size options */
    rowsPerPageList?: number[];
    /** Custom table class */
    tableClass?: string;
    /** Custom thead class */
    theadClass?: string;
}

export function ReactTable<T>({
    columns,
    data,
    options = {},
    pageSize = 10,
    showPagination = true,
    rowsPerPageList = [5, 10, 25, 50],
    tableClass = '',
    theadClass = '',
}: ReactTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: pageSize,
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        ...options,
    });

    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    return (
        <div>
            {/* Table */}
            <div className="table-responsive">
                <BsTable className={`table ${tableClass}`}>
                    <thead className={theadClass}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                        style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                                    >
                                        <div className="d-flex align-items-center gap-1">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === 'asc' && ' ↑'}
                                            {header.column.getIsSorted() === 'desc' && ' ↓'}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </BsTable>
            </div>

            {/* Pagination */}
            {showPagination && pageCount > 0 && (
                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small">Rows per page:</span>
                        <Form.Select
                            size="sm"
                            value={pagination.pageSize}
                            onChange={(e) => table.setPageSize(Number(e.target.value))}
                            style={{ width: 'auto' }}
                        >
                            {rowsPerPageList.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </Form.Select>
                        <span className="text-muted small ms-3">
                            Page {currentPage + 1} of {pageCount}
                        </span>
                    </div>

                    <Pagination className="mb-0">
                        <Pagination.First
                            onClick={() => table.firstPage()}
                            disabled={!table.getCanPreviousPage()}
                        />
                        <Pagination.Prev
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        />

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                            const start = Math.max(0, Math.min(currentPage - 2, pageCount - 5));
                            const pageNum = start + i;
                            if (pageNum >= pageCount) return null;
                            return (
                                <Pagination.Item
                                    key={pageNum}
                                    active={pageNum === currentPage}
                                    onClick={() => table.setPageIndex(pageNum)}
                                >
                                    {pageNum + 1}
                                </Pagination.Item>
                            );
                        })}

                        <Pagination.Next
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        />
                        <Pagination.Last
                            onClick={() => table.lastPage()}
                            disabled={!table.getCanNextPage()}
                        />
                    </Pagination>
                </div>
            )}
        </div>
    );
}

export default ReactTable;
