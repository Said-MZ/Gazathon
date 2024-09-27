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
import { Hospital } from "./hospitals-client";
import { cn } from "@/lib/utils";
import { TriangleAlertIcon } from "lucide-react";

type Medicine = {
  id: string;
  name: string;
  genericName: string;
  stock: number;
  expirationDate: string;
  minStock: number;
};

interface MedicineSearchProps {
  medicines: Medicine[];
}

export function MedicineSearch({ medicines }: MedicineSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [medicines, debouncedSearchTerm]);

  return (
    <div>
      {medicines[0] < medicines[0]
        ? "Low"
        : "OK" && (
            <div className="fixed top-24 right-4">
              <span className="bg-red-700 text-red-200 p-2 rounded-md flex items-center gap-2">
                <TriangleAlertIcon className="w-4 h-4" /> Low Stock
              </span>
            </div>
          )}
      <Input
        type="text"
        placeholder="Search medicines..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Generic Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMedicines.map((medicine) => (
            <TableRow key={medicine.id}>
              <TableCell>{medicine.name}</TableCell>
              <TableCell>{medicine.genericName}</TableCell>
              <TableCell>{medicine.stock}</TableCell>
              <TableCell>
                {new Date(medicine.expirationDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/edit-medicine/${medicine.id}`}>
                  Edit
                </Link>
              </TableCell>
              {/* TODO: Add total */}
              <TableCell>{medicine.stock * 100}</TableCell>
              <TableCell>{"name"}</TableCell>
              <TableCell
                className={cn(
                  medicine.stock < medicine.minStock
                    ? "bg-red-700 text-red-100"
                    : "bg-green-500 text-green-100"
                )}
              >
                {medicine.stock < medicine.minStock ? "Low" : "OK"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="absolute top-0 right-0"></div>
    </div>
  );
}
