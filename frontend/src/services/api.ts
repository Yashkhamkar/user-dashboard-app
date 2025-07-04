const API_URL = "https://<YOUR_CLOUD_FUNCTION_URL>/api";

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
};

export const createUser = async (user: { name: string; email: string }) => {
  return fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};

export const deleteUser = async (id: string) => {
  return fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
};
