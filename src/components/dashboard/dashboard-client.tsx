"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardData } from "@/actions/dashboard/fetch-dashboard-data";
import Spinner from "../ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hospital, Pill, AlertTriangle, UserPlus } from "lucide-react";

// Define the type for the dashboard data
type DashboardData = {
  totalHospitals: number;
  totalMedicines: number;
  lowStockAlerts: number;
  unapprovedHospitals: number;
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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">
        {isAdmin ? "Admin Dashboard" : "Dashboard Overview"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Hospitals"
          value={dashboardData.totalHospitals}
          icon={<Hospital className="h-8 w-8 text-blue-500" />}
          isAdmin={isAdmin}
          editLink="/dashboard/hospitals"
        />

        {isAdmin && (
          <DashboardCard
            title="Unapproved Hospitals"
            value={dashboardData.unapprovedHospitals}
            icon={<UserPlus className="h-8 w-8 text-yellow-500" />}
            isAdmin={isAdmin}
            editLink="/dashboard/admin/manage-hospitals"
          />
        )}

        <DashboardCard
          title="Total Medicines"
          value={dashboardData.totalMedicines}
          icon={<Pill className="h-8 w-8 text-green-500" />}
          isAdmin={isAdmin}
          editLink="/dashboard/medicines"
        />
        <DashboardCard
          title="Low Stock Alerts"
          value={dashboardData.lowStockAlerts}
          icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
          isAdmin={isAdmin}
          editLink="/dashboard/stock-alerts"
        />
      </div>
      {isAdmin && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/dashboard/hospitals/add">Add Hospital</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/medicines/add">Add Medicine</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/reports">Generate Reports</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardCard = ({
  title,
  value,
  icon,
  isAdmin,
  editLink,
}: {
  title: string;
  value: number;
  icon: JSX.Element;
  isAdmin: boolean;
  editLink: string;
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="border-b bg-muted/50 flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {isAdmin && (
        <Button asChild variant="link" className="mt-2 p-0">
          <Link href={editLink}>Manage</Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

export default DashboardClient;
