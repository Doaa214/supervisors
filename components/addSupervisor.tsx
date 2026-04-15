"use client";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useSupervisor, { Supervisor as SupervisorType } from "../hooks/useSupervisors";

interface AddSupervisorProps {
  isOpen: boolean;
  onClose: () => void;
  supervisorToEdit?: SupervisorType | null;
}


interface SupervisorPayload {
  clientId: number;
  name: string;
  email: string;
  phone: string;
  phoneCode: string;
  status: 'ACTIVE' | 'SUSPENDED';
  password?: string;
  passwordConfirmation?: string;
}

function AddSupervisor({ isOpen, onClose, supervisorToEdit }: AddSupervisorProps) {
  const { addSupervisor } = useSupervisor();

  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    password: "",
    phoneCode: "20",
    confirmPassword: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!isOpen) return;

    if (supervisorToEdit) {
      setFormData({
        name: supervisorToEdit.name || "",
        email: supervisorToEdit.email || "",
        phone: supervisorToEdit.phone || "",
        phoneCode: supervisorToEdit.phoneCode || "20",
        password: "",
        confirmPassword: "",
        isActive: supervisorToEdit.status === 'ACTIVE',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [isOpen, supervisorToEdit]);

  const handleSubmit = async () => {
    
    const cleanCode = formData.phoneCode.replace(/\D/g, "");
    let cleanPhone = formData.phone.replace(/\D/g, "");

    if (cleanPhone.startsWith(cleanCode)) {
      cleanPhone = cleanPhone.substring(cleanCode.length);
    }

    
    const payload: SupervisorPayload = {
      clientId: 1, 
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: cleanPhone,
      phoneCode: cleanCode,
      status: formData.isActive ? 'ACTIVE' : 'SUSPENDED',
    };

    if (formData.password) {
      payload.password = formData.password;
      payload.passwordConfirmation = formData.confirmPassword;
    }

    try {
      
      const isSuccess = await addSupervisor({
        superVisorId: supervisorToEdit?.id,
        data: payload
      });

      if (isSuccess) {
        onClose();
      }
    } catch (err) {
      console.log("errorrrrr")
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-[450px] bg-white h-full shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {supervisorToEdit ? "Edit Supervisor" : "Create Supervisor"}
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative mt-6">
            <input
              type="text"
              className="peer w-full border border-gray-300 rounded-lg p-3 pt-5 outline-none focus:ring-1 focus:ring-blue-800 placeholder-transparent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder=" "
            />
            <label className="absolute left-3 top-1 text-gray-400 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-1">
              Supervisor Name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              className="peer w-full border border-gray-300 rounded-lg p-3 pt-5 outline-none focus:ring-1 focus:ring-blue-800 placeholder-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder=" "
            />
            <label className="absolute left-3 top-1 text-gray-400 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-1">
              Email
            </label>
          </div>

          <div className="flex gap-2">
            <div className="relative w-28 h-[54px] border border-gray-300 rounded-lg flex items-center overflow-hidden">
              <PhoneInput
                country={"eg"}
                value={formData.phoneCode}
                onChange={(val) => setFormData({ ...formData, phoneCode: val })}
                inputStyle={{ display: "none" }}
                buttonStyle={{ width: "100%", height: "100%", background: "transparent", border: "none" }}
              />
              <span className="absolute right-2 text-xs font-bold text-gray-500">
                +{formData.phoneCode}
              </span>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                className="peer w-full border border-gray-300 rounded-lg p-3 pt-5 outline-none h-[54px]"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              className="peer w-full border border-gray-300 rounded-lg p-3 pt-5 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              className="peer w-full border border-gray-300 rounded-lg p-3 pt-5 outline-none"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm Password"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
            </label>
            <span className="text-sm font-bold text-blue-900">
              {formData.isActive ? 'ACTIVE' : 'SUSPENDED'}
            </span>
          </div>

          <div className="mt-10 flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-900 text-white py-2 rounded-lg font-bold hover:bg-blue-800 transition-all active:scale-95 shadow-sm"
            >
              {supervisorToEdit ? "Update" : "Create"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSupervisor;