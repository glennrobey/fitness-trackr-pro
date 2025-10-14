const API = import.meta.env.VITE_API;

export async function getRoutines() {
  try {
    const res = await fetch(`${API}/routines`);
    if (!res.ok) throw new Error("Failed to fetch routines");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getRoutineById(id) {
  try {
    const res = await fetch(`${API}/routines/${id}`);
    if (!res.ok) throw new Error("Failed to fetch routine details");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function createRoutine(token, routine) {
  if (!token) throw new Error("You must be signed in to create a routine");
  try {
    const res = await fetch(`${API}/routines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(routine),
    });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message || "Failed to create routine");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function addActivityToRoutine(
  token,
  routineId,
  { activityId, count }
) {
  if (!token)
    throw new Error("You must be signed in to add an activity to a routine");
  try {
    const res = await fetch(`${API}/routines/${routineId}/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activityId, count }),
    });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message || "Failed to add activity to routine");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

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
