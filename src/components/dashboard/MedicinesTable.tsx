import React from "react";

type Medicine = {
  id: string;
  name: string;
  description: string;
  genericName: string;
  dosage: string;
  form: string;
  price: number;
  stock: number;
  minStock: number;
  expirationDate: string;
  batchNumber: string;
};

type MedicinesTableProps = {
  medicines: Medicine[];
};

const MedicinesTable: React.FC<MedicinesTableProps> = ({ medicines }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Name</th>
          <th className="py-2">Description</th>
          <th className="py-2">Generic Name</th>
          <th className="py-2">Dosage</th>
          <th className="py-2">Form</th>
          <th className="py-2">Price</th>
          <th className="py-2">Stock</th>
          <th className="py-2">Min Stock</th>
          <th className="py-2">Expiration Date</th>
          <th className="py-2">Batch Number</th>
        </tr>
      </thead>
      <tbody>
        {medicines.map((medicine) => (
          <tr key={medicine.id}>
            <td className="py-2">{medicine.name}</td>
            <td className="py-2">{medicine.description}</td>
            <td className="py-2">{medicine.genericName}</td>
            <td className="py-2">{medicine.dosage}</td>
            <td className="py-2">{medicine.form}</td>
            <td className="py-2">{medicine.price}</td>
            <td className="py-2">{medicine.stock}</td>
            <td className="py-2">{medicine.minStock}</td>
            <td className="py-2">{new Date(medicine.expirationDate).toLocaleDateString()}</td>
            <td className="py-2">{medicine.batchNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MedicinesTable;