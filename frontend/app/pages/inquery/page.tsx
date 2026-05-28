"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { useToast } from "@/components";
import { createDrivingInquirySchema } from "@/libs/validation/inquery.validation";
import { inquiryApi } from "@/libs/api/inquery.api";
import Nav from "@/components/landing-page/Nav";
import Footer from "@/components/landing-page/Footer";
import { useEffect, useState } from "react";

const states = [
  { value: "Koshi", label: "Koshi" },

  {
    value: "Madheshpradesh",
    label: "Madhesh Pradesh",
  },

  { value: "Bagmati", label: "Bagmati" },

  { value: "Gandaki", label: "Gandaki" },

  { value: "Lumbini", label: "Lumbini" },

  { value: "Karnali", label: "Karnali" },

  {
    value: "Sudurpaschim",
    label: "Sudurpaschim",
  },
];

const districtOptions: Record<string, string[]> = {
  Koshi: [
    "Taplejung",
    "Terhrathum",
    "Panchthar",
    "Sankhuwasabha",
    "Solukhumbu",
    "Bhojpur",
    "Khotang",
    "Illam",
    "Udayapur",
    "Okhaldhunga",
    "Jhapa",
    "Dhankuta",
    "Morang",
    "Sunsari",
  ],

  Madheshpradesh: [
    "Parsa",
    "Bara",
    "Rautahat",
    "Sarlahi",
    "Mahottari",
    "Dhanusha",
    "Siraha",
    "Saptari",
  ],

  Bagmati: [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Kavre",
    "Sindupalchowk",
    "Dolakha",
    "Dhading",
    "Nuwakot",
    "Makwanpur",
    "Rasuwa",
    "Ramechhap",
    "Chitwan",
    "Sindhuli",
  ],

  Gandaki: [
    "Kaski",
    "Gorkha",
    "Nawalpur",
    "Parbhat",
    "Tanahu",
    "Baglung",
    "Myagdi",
    "Lamjung",
    "Syangja",
    "Manang",
    "Mustang",
  ],

  Lumbini: [
    "Parasi",
    "Dang",
    "Gulmi",
    "Kapilvastu",
    "Arghakachi",
    "Palpa",
    "Rukum East",
    "Pyuthan",
    "Banke",
    "Bardiya",
    "Rupandehi",
    "Rolpa",
  ],

  Karnali: [
    "Rukum West",
    "Mugu",
    "Dailekh",
    "Dolpa",
    "Jumla",
    "Jajarkot",
    "Kalikot",
    "Salyan",
    "Surkhet",
    "Humla",
  ],

  Sudurpaschim: [
    "Kailali",
    "Kanchanpur",
    "Achham",
    "Dadeldhura",
    "Doti",
    "Darchula",
    "Bajhang",
    "Bajura",
    "Baitadi",
  ],
};

export default function DrivingInquiryForm() {
  const toast = useToast.getState();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createDrivingInquirySchema),

    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      age: 18,
      gender: "",
      state: "",
      district: "",
      street: "",
      occupation: "",
      inquiryType: "new_admission",
      licenseType: undefined,
      preferredVehicle: "",
      packageType: undefined,
      preferredSchedule: "",
      trainingShift: undefined,
      experienceLevel: undefined,
      referredBy: "",
      message: "",

      emergencyContact: {
        name: "",
        phone: "",
        relation: "",
      },

      agreeTerms: false,
    },
  });

  const [districts, setDistricts] = useState<string[]>([]);

  const selectedState = watch("state");

  useEffect(() => {
    if (selectedState) {
      setDistricts(districtOptions[selectedState] || []);

      setValue("district", "");
    } else {
      setDistricts([]);

      setValue("district", "");
    }
  }, [selectedState, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: inquiryApi.createInquiry,

    onSuccess: () => {
      toast.show({
        message: "Inquiry submitted successfully",
        type: "success",
      });

      reset();
    },

    onError: (err) => {
      toast.show({
        message:
          (err as { message?: string })?.message || "Failed to submit inquiry",

        type: "error",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createDrivingInquirySchema>) => {
    mutate(data);
  };

  return (
    <>
      <Nav />
      <div className="mt-16 bg-gray-50">
        {/* Header */}
        <div className="">
          <div className="max-w-7xl text-center mx-auto px-4 md:px-6 py-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Driving Institute Inquiry
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Submit details for business inquery
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="bg-white rounded border border-gray-200 shadow-sm">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 md:p-8 space-y-10"
            >
              {/* Personal Information */}
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Personal Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Enter your personal details
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      {...register("fullName")}
                      placeholder="Enter full name"
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    />

                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email Address
                    </label>

                    <input
                      type="email"
                      {...register("email")}
                      placeholder="example@gmail.com"
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    />

                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>

                    <input
                      {...register("phone")}
                      placeholder="98XXXXXXXX"
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    />

                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Age
                    </label>

                    <input
                      type="number"
                      {...register("age", {
                        valueAsNumber: true,
                      })}
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gender
                    </label>

                    <select
                      {...register("gender")}
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Occupation
                    </label>

                    <input
                      {...register("occupation")}
                      placeholder="Student / Employee"
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      State
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      {...register("state")}
                      className="w-full border border-gray-200 rounded px-3 py-[8px] outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <option value="">-Choose state-</option>

                      {states.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>

                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      District
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      {...register("district")}
                      disabled={!selectedState}
                      className={`w-full border border-gray-200 rounded px-3 py-[8px] outline-none focus:ring-2 focus:ring-gray-300 ${
                        !selectedState
                          ? "bg-gray-100 cursor-not-allowed text-gray-400"
                          : "bg-white"
                      }`}
                    >
                      <option value="">
                        {!selectedState
                          ? "Select state first"
                          : "-Choose district-"}
                      </option>

                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>

                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.district.message}
                      </p>
                    )}
                  </div>

                  {/* Village / Street */}
                  <div className="md:col-span-2 xl:col-span-1">
                    <label className="block text-sm font-medium mb-1">
                      Village / Street
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      {...register("street")}
                      placeholder="Enter village / street"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Course Details */}
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Driving Course Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Choose your preferred course details
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Inquiry Type
                    </label>

                    <select
                      {...register("inquiryType")}
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="new_admission">New Admission</option>

                      <option value="license_trial">
                        License Trial Preparation
                      </option>

                      <option value="vehicle_training">Vehicle Training</option>

                      <option value="renewal">Renewal Course</option>
                    </select>
                  </div>

                  {/* License Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      License Type
                    </label>

                    <select
                      {...register("licenseType")}
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Select License Type</option>

                      <option value="bike">Bike</option>
                      <option value="car">Car</option>
                      <option value="scooter">Scooter</option>
                      <option value="jeep">Jeep</option>
                      <option value="bus">Bus</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>

                  {/* Preferred Vehicle */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Preferred Vehicle
                    </label>

                    <input
                      {...register("preferredVehicle")}
                      placeholder="Honda Dio / Suzuki Alto"
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Package */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Package Type
                    </label>

                    <select
                      {...register("packageType")}
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Select Package</option>

                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>

                  {/* Training Shift */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Training Shift
                    </label>

                    <select
                      {...register("trainingShift")}
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Select Shift</option>

                      <option value="morning">Morning</option>

                      <option value="day">Day</option>

                      <option value="evening">Evening</option>
                    </select>
                  </div>

                  {/* Preferred Schedule */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Preferred Schedule
                    </label>

                    <input
                      type="date"
                      {...register("preferredSchedule")}
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Experience Level
                    </label>

                    <select
                      {...register("experienceLevel")}
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                      <option value="">Select Experience</option>

                      <option value="beginner">Beginner</option>

                      <option value="intermediate">Intermediate</option>

                      <option value="experienced">Experienced</option>
                    </select>
                  </div>

                  {/* Referred By */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Referred By
                    </label>

                    <input
                      {...register("referredBy")}
                      placeholder="Friend / Facebook"
                      className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* Emergency Contact */}
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Emergency Contact
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <input
                    {...register("emergencyContact.name")}
                    placeholder="Contact Name"
                    className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                  />

                  <input
                    {...register("emergencyContact.phone")}
                    placeholder="Phone Number"
                    className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                  />

                  <input
                    {...register("emergencyContact.relation")}
                    placeholder="Relation"
                    className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </section>

              {/* Message */}
              <section>
                <label className="block text-sm font-medium mb-1">
                  Additional Message
                </label>

                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Write additional notes..."
                  className="w-full border border-gray-200 rounded px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </section>

              {/* Terms */}
              <section className="flex items-center gap-3">
                <input type="checkbox" {...register("agreeTerms")} />
                <label className="flex items-center gap-3 text-sm">
                  I agree to the institute terms and conditions
                </label>

                {errors.agreeTerms && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.agreeTerms.message}
                  </p>
                )}
              </section>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-3 py-[8px] rounded cursor-pointer bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3 py-[8px] rounded cursor-pointer bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  {isPending ? "Submitting..." : "Submit Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
