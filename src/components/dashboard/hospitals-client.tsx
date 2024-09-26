"use client";

import { useState, useEffect } from "react";
import { fetchHospitals } from "@/actions/dashboard/fetch-hospitals";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "../ui/button";
import useCurrentRole from "@/hooks/use-current-role";

// Define the Hospital type
export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: string;
}

const HospitalsClient = () => {
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

  const role = useCurrentRole();
  const isAdmin = role === "admin";

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hospitals.map(
          (hospital) =>
            hospital.status !== "pending" && (
              <TableRow key={hospital.id}>
                <TableCell>{hospital.name}</TableCell>
                <TableCell>{hospital.address}</TableCell>
                <TableCell>{hospital.phone}</TableCell>
                <TableCell>
                  {isAdmin && (
                    <Button asChild>
                      <Link href={`/dashboard/hospitals/${hospital.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
};

export default HospitalsClient;
