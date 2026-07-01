"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardData } from "@/actions/dashboard/fetch-dashboard-data";
import Spinner from "../ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hospital, Pill, AlertTriangle, UserPlus } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const user = useCurrentUser();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch {
        setError("Dashboard metrics could not be loaded. Please refresh.");
      }
    };

    loadDashboardData();
  }, []);

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!dashboardData) return <Spinner />;

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">
          {isAdmin ? "Admin Dashboard" : "Dashboard Overview"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Monitor hospitals, medicine inventory, and approval work queues.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Hospitals"
          value={dashboardData.totalHospitals}
          icon={<Hospital className="h-8 w-8 text-blue-500" />}
          href="/dashboard/hospitals"
        />

        {isAdmin && (
          <DashboardCard
            title="Pending Hospitals"
            value={dashboardData.unapprovedHospitals}
            icon={<UserPlus className="h-8 w-8 text-yellow-500" />}
            href="/dashboard/admin/pending-hospitals"
          />
        )}

        <DashboardCard
          title="Total Medicines"
          value={dashboardData.totalMedicines}
          icon={<Pill className="h-8 w-8 text-green-500" />}
          href="/dashboard/medicines"
        />
        <DashboardCard
          title="Low Stock Alerts"
          value={dashboardData.lowStockAlerts}
          icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
          href="/dashboard/medicines"
        />
      </div>
      {isAdmin && (
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/dashboard/admin/add-hospital">Add Hospital</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/add-medicine">Add Medicine</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/admin/pending-hospitals">
                Review Pending Hospitals
              </Link>
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
  href,
}: {
  title: string;
  value: number;
  icon: JSX.Element;
  href: string;
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted/50 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <Button asChild variant="link" className="mt-2 p-0">
        <Link href={href}>View</Link>
      </Button>
    </CardContent>
  </Card>
);

export default DashboardClient;
