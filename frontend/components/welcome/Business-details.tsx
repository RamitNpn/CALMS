"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseSchema, businessSchemas } from "../schema/register.schema";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Step3Plan({ data }: any) {
  const schema = baseSchema.merge(businessSchemas[data.businessType]);

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema)
  });

  const mutation = useMutation({
    mutationFn: (formData: any) =>
      api.post("/auth/register", {
        ...data,
        ...formData
      })
  });

  const onSubmit = (formData: any) => {
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-4">

      <input {...register("name")} placeholder="Your Name" />
      <input {...register("email")} placeholder="Email" />
      <input {...register("password")} placeholder="Password" />
      <input {...register("businessName")} placeholder="Business Name" />

      {/* Dynamic Fields */}
      {data.businessType === "driving" && (
        <input {...register("vehicles")} placeholder="No. of Vehicles" />
      )}

      {data.businessType === "clinic" && (
        <input {...register("doctors")} placeholder="No. of Doctors" />
      )}

      <button className="bg-black text-white px-4 py-2">
        Submit
      </button>
    </form>
  );
}