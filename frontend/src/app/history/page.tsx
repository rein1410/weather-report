import { Forecast } from "../data/forecast";
import { columns } from "../data/history";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default async function History() {
    const page = 0;
    const limit = 10;
    
    const queryFn = async (pageIndex: number, pageSize: number) => {
        "use server";
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/history?page=${pageIndex}&limit=${pageSize}`);
            
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
            />
        </div>
    );
}