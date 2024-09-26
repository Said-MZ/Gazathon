"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardData } from "@/actions/dashboard/fetch-dashboard-data";
import Spinner from "../ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user"; // Assuming you have this hook
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the type for the dashboard data
type DashboardData = {
  totalHospitals: number;
  totalMedicines: number;
  lowStockAlerts: number;
};

const DashboardClient = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const user = useCurrentUser(); // Get the current user

  useEffect(() => {
    const loadDashboardData = async () => {
      const data = await fetchDashboardData();
      setDashboardData(data);
    };
    loadDashboardData();
  }, []);

  if (!dashboardData) return <Spinner />;

  const isAdmin = user?.role === "admin"; // Assuming 'ADMIN' is the role for admins

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {isAdmin ? "Admin Dashboard" : "Dashboard Overview"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Hospitals"
          value={dashboardData.totalHospitals}
          isAdmin={isAdmin}
          editLink="/dashboard/hospitals"
        />
        <DashboardCard
          title="Total Medicines"
          value={dashboardData.totalMedicines}
          isAdmin={isAdmin}
          editLink="/dashboard/medicines"
        />
        <DashboardCard
          title="Low Stock Alerts"
          value={dashboardData.lowStockAlerts}
          isAdmin={isAdmin}
          editLink="/dashboard/stock-alerts"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({
  title,
  value,
  isAdmin,
  editLink,
}: {
  title: string;
  value: number;
  isAdmin: boolean;
  editLink: string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold">{value}</p>
      {isAdmin && (
        <Button asChild variant="link" className="mt-2 p-0">
          <Link href={editLink}>Manage</Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

export default DashboardClient;
