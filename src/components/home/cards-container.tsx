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
}

const CardsWrapper = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    const loadHospitals = async () => {
      const data = await fetchHospitals();
      setHospitals(
        data.map((hospital) => ({
          ...hospital,
          status: hospital.status || "",
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

  console.log(dashboardData);

  return (
    <section className="container w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto mb-20">
        {hospitals &&
          hospitals.map((hospital) => (
            <Card
              key={hospital.id}
              className="w-full mx-auto"
            >
              <CardHeader>
                <CardTitle>{hospital.name}</CardTitle>
                <CardDescription>{hospital.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Phone: {hospital.phone}</p>
                <p>Status: {hospital.status}</p>
              </CardContent>
              <CardFooter>
                <Button>More Info</Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </section>
  );
};

export default CardsWrapper;
