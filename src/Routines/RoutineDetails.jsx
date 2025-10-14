import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  getRoutineById,
  getActivities,
  addActivityToRoutine,
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

  useEffect(() => {
    async function fetchRoutine() {
      try {
        const data = await getRoutineById(id);
        setRoutine(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchRoutine();
  }, [id]);

  useEffect(() => {
    async function fetchActivitiesList() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchActivitiesList();
  }, []);

  const handleAddSet = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await addActivityToRoutine(token, id, {
        activityId: selectedActivity,
        count: Number(count),
      });
      const updatedRoutine = await getRoutineById(id);
      setRoutine(updatedRoutine);
      setSelectedActivity("");
      setCount("");
    } catch (err) {
      setFormError(err.message);
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

      <h3>Activities</h3>
      {routine.activities?.length ? (
        <ul>
          {routine.activities.map((activity) => (
            <li key={activity.id}>
              <strong>{activity.name}</strong> — {activity.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities yet.</p>
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
            required
          />
          <button type="submit">Add Set</button>
        </form>
      )}
    </main>
  );
}
