// components/dashboard/edit-hospital-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  updateHospital,
  fetchHospital,
} from "@/actions/dashboard/manage-hospitals";

const hospitalSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Hospital name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  specialties: z.string().optional(),
});

type HospitalFormValues = z.infer<typeof hospitalSchema>;

interface EditHospitalFormProps {
  hospitalId: string;
}

export function EditHospitalForm({ hospitalId }: EditHospitalFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      id: hospitalId,
      name: "",
      address: "",
      phone: "",
      email: "",
      capacity: 0,
      specialties: "",
    },
  });

  useEffect(() => {
    const loadHospitalData = async () => {
      try {
        const hospitalData = await fetchHospital(hospitalId);
        form.reset({
          id: hospitalData.id,
          name: hospitalData.name,
          address: hospitalData.address,
          phone: hospitalData.phone,
          email: hospitalData.email,
          capacity: hospitalData.capacity ?? 0,
          specialties: hospitalData.specialties?.join(", ") || "",
        });
      } catch (error) {
        setError("Failed to load hospital data");
      } finally {
        setIsLoading(false);
      }
    };

    loadHospitalData();
  }, [hospitalId, form]);

  const onSubmit = async (data: HospitalFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateHospital({
        ...data,
        specialties: data.specialties
          ? data.specialties.split(",").map((s) => s.trim())
          : [],
      });
      // Show success message or redirect
    } catch (error) {
      setError("Failed to update hospital. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hospital Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialties (comma-separated)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Hospital"}
        </Button>
      </form>
    </Form>
  );
}
