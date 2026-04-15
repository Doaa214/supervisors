"use client";
import useSupervisor from "../hooks/useSupervisors";
import Header from "@/components/header";
import { useState } from "react";
import { Supervisor as SupervisorType } from "../hooks/useSupervisors";
import AddSupervisor from "./addSupervisor"; 

function Supervisor() {
  const { data, loading, error } = useSupervisor();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // States للتحكم في الـ Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<SupervisorType | null>(null);

  // (دالة فتح التعديل)
  const handleEditClick = (supervisor: SupervisorType) => {
    setSelectedSupervisor(supervisor);
    setIsDrawerOpen(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data) {
      const allIds = data.map((item) => item.id).filter((id): id is number => id !== undefined);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const filteredData = data?.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) || 
      item.email?.toLowerCase().includes(query) || 
      item.phone?.includes(query)
    );
  });

  if (loading) return <div className="flex justify-center items-center h-screen text-2xl text-blue-900 font-bold">Loading Supervisors...</div>;
  if (error) return <div className="text-2xl text-red-600 p-10 text-center">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      
      <Header onAddClick={() => { 
        setSelectedSupervisor(null); 
        setIsDrawerOpen(true); 
      }} />

      <div className="rounded-xl border border-gray-200 bg-white m-5 shadow-sm overflow-hidden">
        
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="p-2 px-4 rounded-lg text-gray-500 border border-gray-300 flex w-full md:w-1/2 items-center focus-within:border-blue-500 transition-all">
            <span className="material-symbols-outlined mr-2 text-gray-400">search</span>
            <input
              type="search"
              placeholder="Search by name, email or phone..."
              className="outline-none w-full text-sm text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    className="rounded"
                    onChange={handleSelectAll}
                    checked={data && data.length > 0 && selectedIds.length === data.length}
                  />
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Supervisor</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Mobile</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={item.id ? selectedIds.includes(item.id) : false}
                        onChange={() => item.id && handleSelectOne(item.id)}
                      />
                    </td>
                    <td className="p-4 font-semibold text-blue-800">{item.name}</td>
                    <td className="p-4 text-gray-600 text-sm">{item.email}</td>
                    <td className="p-4 text-gray-600 text-sm text-center">{item.phone || "---"}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        (item.status === true || item.status === 1) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                      }`}>
                        {(item.status === true || item.status === 1) ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{new Date().toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleEditClick(item)} 
                        className="text-blue-600 hover:text-blue-900 font-bold text-sm px-4 py-1 rounded-md hover:bg-blue-100 transition-all"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-20 text-center text-gray-400 font-medium">
                    No supervisors found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      <AddSupervisor 
        key={selectedSupervisor?.id || "new-form"} 
        isOpen={isDrawerOpen} 
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedSupervisor(null);
        }} 
        supervisorToEdit={selectedSupervisor} 
      />
    </div>
  );
}

export default Supervisor;
