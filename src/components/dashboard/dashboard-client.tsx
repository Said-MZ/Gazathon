"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardData } from "@/actions/dashboard/fetch-dashboard-data";
import Spinner from "../ui/spinner";

// Define the type for the dashboard data
type DashboardData = {
  totalHospitals: number;
  totalMedicines: number;
  lowStockAlerts: number;
};

const DashboardClient = () => {
  // Initialize the state with the correct type
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      const data = await fetchDashboardData();
      setDashboardData(data);
    };
    loadDashboardData();
  }, []);

  if (!dashboardData) return <Spinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Hospitals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{dashboardData.totalHospitals}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{dashboardData.totalMedicines}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{dashboardData.lowStockAlerts}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardClient;
