import React from "react";
import { getHospitalById } from "@/actions/dashboard/get-hospital-by-id";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  BedIcon,
  ActivityIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { currentRole, currentUser } from "@/actions/auth/current-user";

type HospitalRecord = Awaited<ReturnType<typeof getHospitalById>>[number];

const statusColors: Record<NonNullable<HospitalRecord["status"]>, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  approved: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
};

const HospitalPage = async ({ params }: { params: { id: string } }) => {
  const [hospital] = await getHospitalById(params.id);

  if (!hospital) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-10 text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Hospital not found
            </h1>
            <p className="mt-2 text-muted-foreground">
              The requested hospital information is unavailable.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/hospitals">Back to Hospitals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [role, user] = await Promise.all([currentRole(), currentUser()]);
  const isAdmin = role === "admin";
  const showEditButton = isAdmin || hospital.submittedBy === user?.id;
  const status = hospital.status ?? "pending";

  return (
    <main className="container mx-auto max-w-4xl p-4">
      <Card className="mt-4 shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">
                {hospital.name}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {hospital.address}
              </CardDescription>
            </div>
            <Badge
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                statusColors[status]
              }`}
            >
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center">
              <PhoneIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{hospital.phone}</span>
            </div>
            <div className="flex items-center">
              <MailIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{hospital.email}</span>
            </div>
            <div className="flex items-center">
              <BedIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Capacity: {hospital.capacity ?? "N/A"}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center text-lg font-semibold">
                <ActivityIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                Specialties
              </h3>
              <p className="mt-1">
                {hospital.specialties?.length
                  ? hospital.specialties.join(", ")
                  : "N/A"}
              </p>
            </div>
            <div>
              <h3 className="flex items-center text-lg font-semibold">
                <UserIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                Submitted By
              </h3>
              <p className="mt-1">{hospital.submittedBy || "N/A"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              Created: {hospital.createdAt?.toLocaleDateString() || "N/A"}
            </span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              Updated: {hospital.updatedAt?.toLocaleDateString() || "N/A"}
            </span>
          </div>
        </CardFooter>
        {showEditButton && (
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/dashboard/hospitals/${params.id}/edit`}>
                Edit Hospital Details
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </main>
  );
};

export default HospitalPage;
