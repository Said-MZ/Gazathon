"use client";

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TriangleAlertIcon } from "lucide-react";

export type MedicineSearchItem = {
  id: string;
  name: string;
  genericName: string;
  stock: number;
  expirationDate: string;
  minStock: number;
  hospitalName: string;
  price: number;
};

interface MedicineSearchProps {
  medicines: MedicineSearchItem[];
}

export function MedicineSearch({ medicines }: MedicineSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredMedicines = useMemo(() => {
    const normalizedSearch = debouncedSearchTerm.toLowerCase().trim();

    if (!normalizedSearch) {
      return medicines;
    }

    return medicines.filter((medicine) =>
      [medicine.name, medicine.genericName, medicine.hospitalName].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    );
  }, [medicines, debouncedSearchTerm]);

  const lowStockCount = medicines.filter(
    (medicine) => medicine.stock < medicine.minStock
  ).length;

  return (
    <div className="space-y-4">
      {lowStockCount > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
          <span className="flex items-center gap-2">
            <TriangleAlertIcon className="h-4 w-4" />
            {lowStockCount} medicine{lowStockCount === 1 ? "" : "s"} below minimum stock
          </span>
        </div>
      )}

      <Input
        type="text"
        placeholder="Search by medicine, generic name, or hospital..."
        value={searchTerm}
        onChange={handleSearch}
        aria-label="Search medicines"
      />

      {filteredMedicines.length === 0 ? (
        <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No medicines match your search.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Generic Name</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Min Stock</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => {
                const isLowStock = medicine.stock < medicine.minStock;

                return (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.genericName}</TableCell>
                    <TableCell>{medicine.hospitalName}</TableCell>
                    <TableCell className="text-right">{medicine.stock}</TableCell>
                    <TableCell className="text-right">{medicine.minStock}</TableCell>
                    <TableCell>
                      {new Date(medicine.expirationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                          isLowStock
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200"
                            : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200"
                        )}
                      >
                        {isLowStock ? "Low stock" : "OK"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        className="text-primary underline-offset-4 hover:underline"
                        href={`/dashboard/edit-medicine/${medicine.id}`}
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
