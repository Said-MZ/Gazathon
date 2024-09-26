"use client";

import { useState, useEffect } from "react";
import {
  fetchPendingHospitals,
  approveHospital,
  rejectHospital,
} from "@/actions/dashboard/manage-hospitals";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PendingHospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  specialties: string[];
  submittedBy: string;
}

// This type represents the actual shape of data returned from the server
interface ServerHospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number | null;
  specialties: string[] | null;
  status: "pending" | "approved" | "rejected" | null;
  submittedBy: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Function to transform ServerHospital to PendingHospital
function transformHospital(hospital: ServerHospital): PendingHospital {
  return {
    id: hospital.id,
    name: hospital.name,
    address: hospital.address,
    phone: hospital.phone,
    email: hospital.email,
    capacity: hospital.capacity ?? 0, // Use 0 as default if null
    specialties: hospital.specialties ?? [], // Use empty array as default if null
    submittedBy: hospital.submittedBy ?? "Unknown", // Use "Unknown" as default if null
  };
}

export function PendingHospitalsClient() {
  const [pendingHospitals, setPendingHospitals] = useState<PendingHospital[]>(
    []
  );

  useEffect(() => {
    fetchPendingHospitals().then((hospitals: ServerHospital[]) => {
      const transformedHospitals = hospitals.map(transformHospital);
      setPendingHospitals(transformedHospitals);
    });
  }, []);

  const handleApprove = async (id: string) => {
    await approveHospital(id);
    setPendingHospitals(pendingHospitals.filter((h) => h.id !== id));
  };

  const handleReject = async (id: string) => {
    await rejectHospital(id);
    setPendingHospitals(pendingHospitals.filter((h) => h.id !== id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Specialties</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingHospitals.map((hospital) => (
          <TableRow key={hospital.id}>
            <TableCell>{hospital.name}</TableCell>
            <TableCell>{hospital.address}</TableCell>
            <TableCell>{hospital.phone}</TableCell>
            <TableCell>{hospital.email}</TableCell>
            <TableCell>{hospital.capacity}</TableCell>
            <TableCell>{hospital.specialties.join(", ")}</TableCell>
            <TableCell>{hospital.submittedBy}</TableCell>
            <TableCell>
              <Button
                onClick={() => handleApprove(hospital.id)}
                className="mr-2"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReject(hospital.id)}
                variant="destructive"
              >
                Reject
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
