"use client";
import { fetchDashboardData } from "@/actions/dashboard/fetch-dashboard-data";
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

// Define the types for data
type DashboardData = {
  totalHospitals: number;
  totalMedicines: number;
  lowStockAlerts: number;
  unapprovedHospitals: number;
};

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: string;
  medData: { name: string; quantity: number }[]; // Example for medData
}

const CardsWrapper = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  ); // State for selected hospital (to show in modal)
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track if modal is open

  useEffect(() => {
    const loadHospitals = async () => {
      const data = await fetchHospitals();
      setHospitals(
        data.map((hospital) => ({
          ...hospital,
          status: hospital.status || "",
          medData: hospital.medData || [], // Assuming medical data comes with hospital
        }))
      );
    };
    loadHospitals();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      const data = await fetchDashboardData();
      setDashboardData(data);
    };

    loadDashboardData();
  }, []);

  // Function to open modal and set selected hospital
  const handleMoreInfoClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHospital(null);
  };

  return (
    <section className="container w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto mb-20">
        {hospitals &&
          hospitals.map((hospital) => (
            <Card key={hospital.id} className="w-full mx-auto">
              <CardHeader>
                <CardTitle>{hospital.name}</CardTitle>
                <CardDescription>{hospital.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Phone: {hospital.phone}</p>
                <p>Status: {hospital.status}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleMoreInfoClick(hospital)}>
                  More Info
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* Dark Layer and Modal for showing more hospital details */}
      {isModalOpen && selectedHospital && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-neutral-900 w-4/5 h-4/5 p-8 rounded-lg shadow-lg overflow-y-auto relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-lg font-bold text-white hover:text-red-400 transition-colors duration-200"
              onClick={closeModal}
            >
              X
            </button>

            {/* Hospital Details */}
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
              <strong>Status:</strong> {selectedHospital.status}
            </p>

            {/* Medical Data Table */}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedHospital.medData.length > 0 ? (
                  selectedHospital.medData.map((med, index) => (
                    <TableRow key={index} className="hover:bg-neutral-800">
                      <TableCell className="border-b border-gray-700">
                        {med.name}
                      </TableCell>
                      <TableCell className="border-b border-gray-700">
                        {med.quantity}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="border-b border-gray-700 text-center"
                    >
                      No medical data available.
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
