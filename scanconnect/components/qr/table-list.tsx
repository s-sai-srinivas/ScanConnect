"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Download } from "lucide-react";
import type { QrTable } from "@/types";
import { createTable, deleteTable } from "@/lib/actions/tables";
import { generateHubQR } from "@/lib/actions/qr";
import { QrPreview } from "./qr-preview";

export function TableList({
  businessId,
  businessSlug,
  tables: initialTables,
}: {
  businessId: string;
  businessSlug: string;
  tables: QrTable[];
}) {
  const [tables, setTables] = useState(initialTables);
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();
  const [tableQr, setTableQr] = useState<Record<string, string>>({});

  function handleAdd() {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createTable(businessId, name.trim());
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.table) {
        setTables((prev) => [...prev, result.table!].sort((a, b) => a.table_name.localeCompare(b.table_name)));
        setName("");
        toast.success("Table added");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteTable(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setTables((prev) => prev.filter((t) => t.id !== id));
      toast.success("Table removed");
    });
  }

  async function loadTableQr(table: QrTable) {
    const dataUrl = await generateHubQR(businessSlug, table.qr_slug);
    setTableQr((prev) => ({ ...prev, [table.id]: dataUrl }));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Table name (e.g. Table 1)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-zinc-700 bg-zinc-800 text-white"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd} disabled={pending || !name.trim()}>
          Add
        </Button>
      </div>

      {tables.length === 0 ? (
        <p className="text-sm text-zinc-500">No table QRs yet — optional for dine-in ops.</p>
      ) : (
        <ul className="space-y-3">
          {tables.map((table) => (
            <li
              key={table.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{table.table_name}</p>
                  <p className="text-xs text-zinc-500">
                    {table.scan_count ?? 0} scans · /table/{table.qr_slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadTableQr(table)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(table.id)}
                    disabled={pending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {tableQr[table.id] && (
                <div className="mt-4 flex justify-center">
                  <QrPreview
                    dataUrl={tableQr[table.id]}
                    label={table.table_name}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
