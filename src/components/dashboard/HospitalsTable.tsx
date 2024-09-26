import React from "react";

type Hospital = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  specialties: string[];
};

type HospitalsTableProps = {
  hospitals: Hospital[];
};

const HospitalsTable: React.FC<HospitalsTableProps> = ({ hospitals }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Name</th>
          <th className="py-2">Address</th>
          <th className="py-2">Phone</th>
          <th className="py-2">Email</th>
          <th className="py-2">Capacity</th>
          <th className="py-2">Specialties</th>
        </tr>
      </thead>
      <tbody>
        {hospitals.map((hospital) => (
          <tr key={hospital.id}>
            <td className="py-2">{hospital.name}</td>
            <td className="py-2">{hospital.address}</td>
            <td className="py-2">{hospital.phone}</td>
            <td className="py-2">{hospital.email}</td>
            <td className="py-2">{hospital.capacity}</td>
            <td className="py-2">{hospital.specialties.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HospitalsTable;