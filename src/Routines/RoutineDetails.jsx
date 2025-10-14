import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  getRoutineById,
  getActivities,
  addActivityToRoutine,
  deleteRoutine,
  deleteSet,
} from "../api/routines";

export default function RoutineDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [routine, setRoutine] = useState(null);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [count, setCount] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch routine details
  useEffect(() => {
    async function fetchRoutine() {
      try {
        const data = await getRoutineById(id);
        setRoutine(data);
      } catch (err) {
        console.error("Error fetching routine:", err);
        setError(err.message);
      }
    }
    fetchRoutine();
  }, [id]);

  // Fetch activities for dropdown
  useEffect(() => {
    async function fetchActivitiesList() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err.message);
      }
    }
    fetchActivitiesList();
  }, []);

  // Add activity to routine
  const handleAddSet = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedActivity || !count) {
      setFormError("Please select an activity and enter a count.");
      return;
    }

    try {
      await addActivityToRoutine(token, id, {
        activityId: selectedActivity,
        count: Number(count),
      });

      // Refresh routine data
      const updatedRoutine = await getRoutineById(id);
      setRoutine(updatedRoutine);

      // Reset form
      setSelectedActivity("");
      setCount("");
    } catch (err) {
      console.error("Error adding activity:", err);
      setFormError(err.message);
    }
  };

  // Delete routine
  const handleDeleteRoutine = async () => {
    if (!window.confirm("Are you sure you want to delete this routine?"))
      return;
    setDeleteError(null);
    try {
      await deleteRoutine(token, id);
      window.location.href = "/routines"; // redirect to routines list
    } catch (err) {
      console.error("Error deleting routine:", err);
      setDeleteError(err.message);
    }
  };

  // Delete set
  const handleDeleteSet = async (setId) => {
    setDeleteError(null);
    try {
      await deleteSet(token, setId);
      const updatedRoutine = await getRoutineById(id);
      setRoutine(updatedRoutine);
    } catch (err) {
      console.error("Error deleting set:", err);
      setDeleteError(err.message);
    }
  };

  if (error) return <p role="alert">Error: {error}</p>;
  if (!routine) return <p>Loading...</p>;

  return (
    <main>
      <h2>{routine.name}</h2>
      <p>
        <strong>Goal:</strong> {routine.goal}
      </p>
      <p>
        <strong>Creator:</strong> {routine.creatorName}
      </p>

      {token && <button onClick={handleDeleteRoutine}>Delete Routine</button>}
      {deleteError && <p role="alert">{deleteError}</p>}

      <h3>Sets</h3>
      {routine.sets?.length ? (
        <ul>
          {routine.sets.map((set) => (
            <li key={set.id}>
              <strong>{set.activityName}</strong> — {set.count} reps
              {token && (
                <button onClick={() => handleDeleteSet(set.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sets yet. Add one using the form below!</p>
      )}

      {token && (
        <form onSubmit={handleAddSet}>
          {formError && <p role="alert">{formError}</p>}

          <label htmlFor="activity">Activity:</label>
          <select
            id="activity"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            required
          >
            <option value="">Select activity</option>
            {activities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.name}
              </option>
            ))}
          </select>

          <label htmlFor="count">Count:</label>
          <input
            id="count"
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            required
          />

          <button type="submit">Add Set</button>
        </form>
      )}
    </main>
  );
}
