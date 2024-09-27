"use client";
import { fetchHospitals } from "@/actions/dashboard/fetch-hospitals";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchMedicines } from "@/actions/dashboard/fetch-medicine";

export interface Medicine {
  id: string;
  name: string;
  stock: number;
  minStock: number | null; // Allow null for minStock
  expirationDate: Date;
  hospitalId: string; // Added to filter medicines by hospital
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: string | null; // Allow null for status
}

const CardsWrapper = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const loadHospitals = async () => {
      const data = await fetchHospitals();
      setHospitals(data);
    };
    loadHospitals();
  }, []);

  const loadMedicines = async (hospitalId: string) => {
    const allMedicines = await fetchMedicines();
    const hospitalMedicines = allMedicines.filter(
      (med) => med.hospitalId === hospitalId
    );
    const sortedMedicines = hospitalMedicines.sort((a, b) => a.stock - b.stock);
    setMedicines(sortedMedicines);
  };

  const getStockFlagColor = (stock: number) => {
    if (stock === 0) {
      return { color: "bg-red-600", status: "Out of Stock" };
    } else if (stock <= 50) {
      return { color: "bg-yellow-500", status: "Low Stock" };
    } else if (stock < 200) {
      return { color: "bg-orange-500", status: "Medium Stock" };
    }
    return { color: "bg-green-500", status: "In Stock" };
  };

  const handleMoreInfoClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    loadMedicines(hospital.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHospital(null);
    setMedicines([]);
  };

  return (
    <section className="flex items-center justify-center w-full h-screen overflow-y-auto max-sm:mt-24 mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-screen p-4">
        {hospitals.map((hospital) => (
          <Card key={hospital.id} className="w-full mx-auto">
            <CardHeader>
              <CardTitle>{hospital.name}</CardTitle>
              <CardDescription>{hospital.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Phone: {hospital.phone}</p>
              <p>Status: {hospital.status || "N/A"}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleMoreInfoClick(hospital)}>
                More Info
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isModalOpen && selectedHospital && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-neutral-900 w-4/5 h-4/5 p-8 rounded-lg shadow-lg overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-lg font-bold text-white hover:text-red-400 transition-colors duration-200"
              onClick={closeModal}
            >
              X
            </button>

            <h2 className="text-2xl font-bold mb-4 text-white">
              {selectedHospital.name} Details
            </h2>
            <p className="mb-4 text-white">
              <strong>Address:</strong> {selectedHospital.address}
            </p>
            <p className="mb-4 text-white">
              <strong>Phone:</strong> {selectedHospital.phone}
            </p>
            <p className="mb-4 text-white">
              <strong>Status:</strong> {selectedHospital.status || "N/A"}
            </p>

            <h3 className="text-xl font-semibold mb-4 text-white">
              Medicine Stock:
            </h3>
            <Table className="text-white border-collapse w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left border-b border-gray-700">
                    Medicine Name
                  </TableHead>
                  <TableHead className="text-left border-b border-gray-700">
                    Quantity
                  </TableHead>
                  <TableHead className="text-left border-b border-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="text-left border-b border-gray-700">
                    Nearest Expiration Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.length > 0 ? (
                  medicines.map((med) => {
                    const { color, status } = getStockFlagColor(med.stock);
                    return (
                      <TableRow key={med.id} className="hover:bg-neutral-800">
                        <TableCell className="border-b border-gray-700">
                          {med.name}
                        </TableCell>
                        <TableCell className="border-b border-gray-700">
                          {med.stock}
                        </TableCell>
                        <TableCell className="border-b border-gray-700">
                          <div className="flex items-center">
                            <div
                              className={`inline-block w-3 h-3 rounded-full ${color}`}
                            ></div>
                            <span className="ml-2">{status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="border-b border-gray-700">
                          {new Date(med.expirationDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="border-b border-gray-700 text-center"
                    >
                      No medicines available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </section>
  );
};

export default CardsWrapper;
