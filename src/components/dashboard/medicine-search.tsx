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

type Medicine = {
  id: string;
  name: string;
  genericName: string;
  stock: number;
  expirationDate: string;
};

interface MedicineSearchProps {
  medicines: Medicine[];
  onSelect: (medicine: Medicine) => void;
}

export function MedicineSearch({ medicines, onSelect }: MedicineSearchProps) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMedicines.map((medicine) => (
            <TableRow
              key={medicine.id}
              onClick={() => onSelect(medicine)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{medicine.name}</TableCell>
              <TableCell>{medicine.genericName}</TableCell>
              <TableCell>{medicine.stock}</TableCell>
              <TableCell>{medicine.expirationDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
