"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMedicines } from "@/actions/dashboard/fetch-medicine";
import { fetchHospitals } from "@/actions/dashboard/fetch-hospitals";
import { MedicineSearch } from "./medicine-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";

type Medicine = Awaited<ReturnType<typeof fetchMedicines>>[number];
type Hospital = Awaited<ReturnType<typeof fetchHospitals>>[number];

const MedicinesClient = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [medicinesData, hospitalsData] = await Promise.all([
          fetchMedicines(),
          fetchHospitals(),
        ]);

        setMedicines(medicinesData);
        setHospitals(hospitalsData);
      } catch {
        setError("We couldn't load medicines right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const hospitalNamesById = useMemo(() => {
    return new Map(hospitals.map((hospital) => [hospital.id, hospital.name]));
  }, [hospitals]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Medicines</h1>
          <p className="text-sm text-muted-foreground">
            Search inventory, spot low stock, and update medicine records.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/add-medicine">Add Medicine</Link>
        </Button>
      </div>

      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Search Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : medicines.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <h2 className="text-lg font-semibold">No medicines yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Add the first medicine record to start tracking inventory.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/add-medicine">Add Medicine</Link>
              </Button>
            </div>
          ) : (
            <MedicineSearch
              medicines={medicines.map((medicine) => ({
                id: medicine.id,
                name: medicine.name,
                genericName: medicine.genericName ?? "—",
                stock: medicine.stock,
                expirationDate: medicine.expirationDate.toISOString(),
                minStock: medicine.minStock ?? 0,
                hospitalName:
                  hospitalNamesById.get(medicine.hospitalId) ?? "Unknown hospital",
                price: medicine.price,
              }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicinesClient;
