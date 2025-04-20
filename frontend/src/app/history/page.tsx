import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ForecastFilters } from "@/components/ui/forecast-filters";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { columns } from "../data/history";
export default async function History() {
    const page = 0;
    const limit = 10;
    
    const queryFn = async (pageIndex: number, pageSize: number, sorting?: SortingState, filter?: ColumnFiltersState) => {
        "use server";
        try {
            // Build the URL with pagination parameters
            let url = `${process.env.BACKEND_URL}/api/history?page=${pageIndex}&limit=${pageSize}`;
            
            // Add sorting parameters if provided
            if (sorting && sorting.length > 0) {
                const sortParams = sorting.map(sort => {
                    // Format: -field for descending, field for ascending
                    return sort.desc ? `-${sort.id}` : sort.id;
                }).join(';');
                
                url += `&sorts=${sortParams}`;
            }
            if (filter && filter.length > 0) {
                const filterParams = filter.map(filter => {
                    return filter.id + ":" + filter.value;
                }).join(';');
                url += `&filters=${filterParams}`;
            }
            console.log(url);
            const response = await fetch(url, { cache: "no-store" });
            
            if (!response.ok) {
                console.error(`Error fetching data: ${response.status} ${response.statusText}`);
                return { list: [], total: 0 };
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error in queryFn:", error);
            return { list: [], total: 0 };
        }
    };

    const initialData = await queryFn(page, limit);
    
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">History</h1>
            <DataTablePagination 
                columns={columns} 
                data={initialData.list} 
                rowCount={initialData.total} 
                pageIndex={page} 
                pageSize={limit}
                queryFn={queryFn} 
                rowId="dt"
                filterUI={ForecastFilters}
            />
        </div>
    );
}