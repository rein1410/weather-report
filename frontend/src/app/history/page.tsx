import { Forecast } from "../data/forecast";
import { columns } from "../data/history";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default async function History() {
    const page = 0;
    const limit = 10;
    
    // Initial data fetch
    let initialData = { list: [], total: 0 };
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/history?page=${page}&limit=${limit}`);
        
        if (!response.ok) {
            console.error(`Error fetching data: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            initialData = {
                list: data.list || [],
                total: data.total || 0
            };
        }
    } catch (error) {
        console.error("Error fetching initial data:", error);
    }
    
    // Query function for pagination
    const queryFn = async (pageIndex: number, pageSize: number) => {
        "use server";
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/history?page=${pageIndex}&limit=${pageSize}`);
            
            if (!response.ok) {
                console.error(`Error fetching data: ${response.status} ${response.statusText}`);
                return { data: [], total: 0 };
            }
            
            const data = await response.json();
            return {
                data: data.list || [],
                total: data.total || 0
            };
        } catch (error) {
            console.error("Error in queryFn:", error);
            return { data: [], total: 0 };
        }
    };
    
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">History</h1>
            <DataTablePagination 
                columns={columns} 
                data={initialData.list} 
                total={initialData.total} 
                pageIndex={page} 
                pageSize={limit} 
                queryFn={queryFn} 
            />
        </div>
    );
}