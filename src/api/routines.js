const API = import.meta.env.VITE_API;

// Fetch all routines
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

// Fetch routine by ID
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

// Create a new routine
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

// Delete a routine
export async function deleteRoutine(token, routineId) {
  if (!token) throw new Error("You must be signed in to delete a routine");
  try {
    const res = await fetch(`${API}/routines/${routineId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message || "Failed to delete routine");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Fetch all activities
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

// Add activity to a routine (only activityId and count are required)
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
      body: JSON.stringify({ activityId, count }), // only activityId and count
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

// Delete a set from a routine
export async function deleteSet(token, setId) {
  if (!token) throw new Error("You must be signed in to delete a set");
  try {
    const res = await fetch(`${API}/routine_activities/${setId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message || "Failed to delete set");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
