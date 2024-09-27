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
      {/* Display dashboard stats */}
      {dashboardData && (
        <div className="flex items-center w-full justify-between mx-auto mb-10">
          <p>Total Hospitals: {dashboardData.totalHospitals}</p>
          <p>Total Medicines: {dashboardData.totalMedicines}</p>
          <p>Low Stock Alerts: {dashboardData.lowStockAlerts}</p>
          <p>Unapproved Hospitals: {dashboardData.unapprovedHospitals}</p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-5">
        {hospitals &&
          hospitals.map((hospital) => (
            <Card key={hospital.id} className="max-w-xs w-full">
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
