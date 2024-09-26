"use client";

import { admin } from "@/actions/auth/admin";
import FormSuccess from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useCurrentRole from "@/hooks/use-current-role";
import { toast } from "sonner";
import AdminGate from "@/components/auth/admin-gate";
import FormError from "@/components/auth/form-error";

const AdminPage = () => {
  const role = useCurrentRole();
  const onServerActionClick = async () => {
    admin().then((res) => {
      if (res.error) {
        toast.error("You are not authorized");
        return;
      }
      toast.success("Success");
    });
  };

  const onAPIRouteClick = async () => {
    const response = await fetch("/api/admin").then((res) => {
      if (!res.ok) {
        toast.error("You are not authorized");
        return;
      }
      toast.success("Success");
      console.log(res);
    });
    console.log(response);
  };

  return (
    <Card className="w-full max-w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">👨🏻‍💼 Admin</p>
      </CardHeader>
      <CardContent className="space-x-4">
        <AdminGate
          allowedRoles="admin"
          error={
            <FormError message="You are not authorized to view this page" />
          }
        >
          <div className="text-center">
            <FormSuccess message="You are authorized to view this page" />
          </div>
        </AdminGate>
        <div className="flex  flex-row items-center justify-between rounded-lg border p-3 shadow-md mt-4 !ml-0 w-full">
          <p className="text-sm font-medium">Admin only API Route</p>
          <Button onClick={onAPIRouteClick}>Click to test</Button>
        </div>
        <div className="flex  flex-row items-center justify-between rounded-lg border p-3 shadow-md mt-4 !ml-0 w-full">
          <p className="text-sm font-medium">Admin only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
