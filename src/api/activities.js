const API = import.meta.env.VITE_API;

/** Fetch all activities */
export async function getActivities() {
  try {
    const res = await fetch(`${API}/activities`);
    if (!res.ok) throw new Error("Failed to fetch activities");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

/** Fetch a single activity by ID */
export async function getActivity(id) {
  try {
    const res = await fetch(`${API}/activities/${id}`);
    if (!res.ok) throw new Error("Failed to fetch activity");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/** Create a new activity */
export async function createActivity(token, activity) {
  if (!token) throw new Error("You must be signed in to create an activity");

  const res = await fetch(`${API}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activity),
  });

  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Failed to create activity");
  }
}

/** Delete an activity */
export async function deleteActivity(token, id) {
  if (!token) throw new Error("You must be signed in to delete an activity");

  const res = await fetch(`${API}/activities/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Failed to delete activity");
  }
}
