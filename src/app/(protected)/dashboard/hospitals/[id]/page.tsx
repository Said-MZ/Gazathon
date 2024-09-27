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
import { getUserById } from "@/lib/data/user";
import { db } from "@/db";
import { Hospital } from "@/db/schema";
import { eq } from "drizzle-orm";

type Hospital = {
  status: "pending" | "approved" | "rejected" | null;
  address: string;
  name: string;
  phone: string;
  email: string;
  capacity: number | null;
  specialties: string[] | null;
  submittedBy: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}[];

const HospitalPage = async ({ params }: { params: { id: string } }) => {
  const hospital: Hospital = await getHospitalById(params.id);

  const isAdmin = (await currentRole()) === "admin";
  const user = await currentUser();
  if (!user) {
    return;
  }
  const dbUser = await getUserById(user?.id);

  if (!dbUser) {
    return;
  }

  const userHospital = await db
    .select()
    .from(Hospital)
    .where(eq(Hospital.submittedBy, dbUser[0].id));

  console.log(userHospital);

  const showEditButton =
    (userHospital[0].status === "pending" && isAdmin) ||
    userHospital[0].id === params.id;

  if (!hospital) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-10">
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

  const {
    name,
    address,
    phone,
    email,
    capacity,
    specialties,
    submittedBy,
    createdAt,
    updatedAt,
    status,
  } = hospital[0];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="mt-4 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">
                {name}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {address}
              </CardDescription>
            </div>
            <Badge
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                statusColors[status || "pending"]
              }`}
            >
              {status || "Unknown"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <PhoneIcon className="w-5 h-5 text-muted-foreground mr-2" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center">
              <MailIcon className="w-5 h-5 text-muted-foreground mr-2" />
              <span>{email}</span>
            </div>
            <div className="flex items-center">
              <BedIcon className="w-5 h-5 text-muted-foreground mr-2" />
              <span>Capacity: {capacity || "N/A"}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                <ActivityIcon className="w-5 h-5 text-muted-foreground mr-2" />
                Specialties
              </h3>
              <p className="mt-1">{specialties?.join(", ") || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                <UserIcon className="w-5 h-5 text-muted-foreground mr-2" />
                Submitted By
              </h3>
              <p className="mt-1">{submittedBy || "N/A"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>Created: {createdAt?.toLocaleDateString() || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>Updated: {updatedAt?.toLocaleDateString() || "N/A"}</span>
          </div>
        </CardFooter>
        <CardFooter>
          {showEditButton && (
            <Button asChild className="w-full">
              <Link href={`/dashboard/hospitals/${params.id}/edit`}>
                Edit Hospital Details
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
};

export default HospitalPage;
