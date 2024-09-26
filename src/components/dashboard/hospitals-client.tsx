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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Actions</TableHead>
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
                  <Link
                    href={`/dashboard/hospitals/${hospital.id}`}
                    className="btn btn-sm btn-secondary mr-2"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/hospitals/${hospital.id}/edit`}
                    className="btn btn-sm btn-secondary"
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
};

export default HospitalsClient;
