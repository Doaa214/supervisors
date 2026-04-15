"use client";
import { useState, useEffect } from "react";

export interface Supervisor {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  phoneCode?: string;
  clientId: number;
  status: 'ACTIVE' | 'SUSPENDED';
  password?: string;
  passwordConfirmation?: string;
}

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoiYWRtaW4uZGVsaXZlcnlAZGVtby5jb20iLCJjbGllbnRJZCI6MSwic2Vzc2lvbklkIjoiMDU2MDlmMjQtZWUxOS00YzdiLWE4YzMtYzg5ZDk2M2ZmYzcxIiwicm9sZXMiOlt7Im5hbWUiOiJtYWdkeV9hZ2VudF8yIiwic2NvcGVUeXBlIjoiQ0xJRU5UIn0seyJuYW1lIjoiQ0xJRU5UX0FETUlOIiwic2NvcGVUeXBlIjoiQ0xJRU5UIn0seyJuYW1lIjoiT1BFUkFUT1IiLCJzY29wZVR5cGUiOiJDTElFTlQifSx7Im5hbWUiOiJhbGkiLCJzY29wZVR5cGUiOiJDTElFTlQifV0sImJ1c2luZXNzTmFtZSI6ImRlbW8iLCJpYXQiOjE3NzYxNTY4NjQsImV4cCI6MTc3NjI0MzI2NH0.Rkry9pWV7WZzg7gKVQFHUCiDGsLet14tFk3Z9gJaja8"; 

function useSupervisors() {
  const [data, setData] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dev2.dynootech.com/api/supervisors", {
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Fetch failed");
      const result = await response.json();
      setData(result.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addSupervisor = async ({ superVisorId, data }: { superVisorId?: number; data: any }) => {
    const isEdit = !!superVisorId;
    const url = isEdit 
      ? `https://dev2.dynootech.com/api/supervisors/${superVisorId}` 
      : "https://dev2.dynootech.com/api/supervisors";
    
    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await fetchSupervisors();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const deleteSupervisor = async (id: number) => {
    try {
      const response = await fetch(`https://dev2.dynootech.com/api/supervisors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (response.ok) await fetchSupervisors();
    } catch (err) { console.log("error") }
  };

  useEffect(() => { fetchSupervisors(); }, []);

  return { data, loading, error, addSupervisor, deleteSupervisor, refresh: fetchSupervisors };
}

export default useSupervisors;