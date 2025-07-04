"use client";
import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../services/api";
import { User } from "@/types/user";

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchData = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    await createUser({ name, email });
    setName("");
    setEmail("");
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    fetchData();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 flex-1"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="border-b py-2 flex justify-between items-center"
          >
            <span>
              {user.name} ({user.email})
            </span>
            <button
              onClick={() => handleDelete(user.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
