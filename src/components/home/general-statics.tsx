"use client";

import { useEffect, useState } from "react";
import { fetchDashboardData } from "@/actions/dashboard/fetch-dashboard-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const GeneralData = () => {
  const [dashboardData, setDashboardData] = useState({
    totalHospitals: 0,
    totalMedicines: 0,
    lowStockAlerts: 0,
    unapprovedHospitals: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardData();
      setDashboardData(data);
    };

    loadData();
  }, []);

  return (
    <section className="mt-20 flex justify-center w-full contianer">
      <Card className="w-full max-w-7xl container mb-8">
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>
            Summary of hospitals and medicine stock in Gaza
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-800 rounded-lg">
            <h3 className="text-white text-lg">Total Hospitals</h3>
            <p className="text-white text-2xl">
              {dashboardData.totalHospitals} out of 40
            </p>
          </div>
          <div className="p-4 bg-neutral-800 rounded-lg">
            <h3 className="text-white text-lg">Total Medicines</h3>
            <p className="text-white text-2xl">
              {dashboardData.totalMedicines} out of 1200
            </p>
          </div>
          <div className="p-4 bg-neutral-800 rounded-lg w-full col-span-2">
            <h3 className="text-white text-lg">Low Stock Alerts</h3>
            <p className="text-white text-2xl">
              {dashboardData.lowStockAlerts} in {dashboardData.totalMedicines}{" "}
              medicines
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default GeneralData;
