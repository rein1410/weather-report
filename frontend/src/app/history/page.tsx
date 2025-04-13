import { DataTable } from "@/components/ui/data-table";
import { columns, Forecast } from "../data/forecast";

export default async function History() {
    const history = await fetch(`${process.env.BACKEND_URL}/api/history`);
    const { list } = await history.json();
    return (
        <div>
            <h1>History</h1>
            <DataTable columns={columns} data={list} />
        </div>
    )
}