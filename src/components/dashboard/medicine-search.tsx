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

type Medicine = {
  id: string;
  name: string;
  genericName: string;
  stock: number;
  expirationDate: string;
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
