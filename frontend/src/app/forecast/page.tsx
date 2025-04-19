import { DataTable } from "@/components/ui/data-table";
import { columns } from "../data/forecast";
export default async function Forecast() {
    const forecast = await fetch(`${process.env.BACKEND_URL}/api/daily-forecast`);
    const { list } = await forecast.json();
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Forecast</h1>
            <DataTable columns={columns} data={list} />
        </div>
    )
}