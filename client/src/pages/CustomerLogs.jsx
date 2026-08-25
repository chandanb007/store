import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Eye, Trash2, User, Mail, Phone } from "lucide-react";

export const CustomerLogs = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers();
  }, []);


 const getCustomers = async () => {
    try {
      const response = await api.get("/auth/customers");

      setCustomers(response.data.data);

      console.log(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="border-b border-stone-150 dark:border-stone-850 pb-5">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4B0011] dark:text-white">
          Customer Logs
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage registered customer accounts and activity records.
        </p>
      </div>


      {/* Customer Table */}
      <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-[#FDFCF8] dark:bg-stone-950 text-stone-400 uppercase tracking-widest">

                <th className="py-3 px-4">
                  Customer
                </th>

                <th className="py-3 px-4">
                  Contact
                </th>

                <th className="py-3 px-4">
                  Role
                </th>

                <th className="py-3 px-4">
                Active Status
                </th>

                <th className="py-3 px-4 text-center">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">

              {customers.map((customer) => (

                <tr 
                  key={customer.id}
                  className="hover:bg-[#FDFCF8] dark:hover:bg-stone-950 transition-colors"
                >

                  {/* Customer */}
                  <td className="py-4 px-4 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-stone-500"/>
                    </div>

                    <div>
                      <p className="font-bold text-stone-800 dark:text-white">
                     {customer.firstName?.charAt(0).toUpperCase() + customer.firstName?.slice(1)}{" "}
{customer.lastName?.charAt(0).toUpperCase() + customer.lastName?.slice(1)}
                      </p>

                      <p className="text-[10px] text-stone-400">
                        ID: #{customer.id}
                      </p>
                    </div>

                  </td>


                  {/* Contact */}
                  <td className="py-4 px-4">

                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-stone-400"/>
                      {customer.email}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3 text-stone-400"/>
                      {customer.mobile}
                    </div>

                  </td>


                  {/* Address */}
                  <td className="py-4 px-4">
                    <p className="text-stone-600 dark:text-stone-300">
                      {customer.role}
                    </p>
                  </td>


                  {/* Status */}
                  <td className="py-4 px-4">

                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      customer.isEnabled ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                    }`}>
                   {customer.isEnabled ? "Active" : "Inactive"}
                    </span>

                  </td>


                  {/* Actions */}
                  <td className="py-4 px-4">

                    <div className="flex justify-center gap-2">

                      <button
                        className="p-2 rounded-lg border border-stone-200 hover:border-gold-500 text-stone-500"
                        title="View Customer"
                      >
                        <Eye className="w-4 h-4"/>
                      </button>


                      <button
                        className="p-2 rounded-lg border border-stone-200 hover:border-rose-500 text-stone-500"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>

                    </div>

                  </td>


                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};