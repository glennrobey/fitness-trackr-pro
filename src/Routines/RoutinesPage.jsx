import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import {
  getRoutines,
  getRoutineById,
  createRoutine,
  addActivityToRoutine,
} from "../api/routines";

export default function RoutinesPage() {
  const { token } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    async function fetchRoutines() {
      try {
        const data = await getRoutines();
        setRoutines(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchRoutines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      await createRoutine(token, { name, goal });
      setName("");
      setGoal("");
      const updatedRoutines = await getRoutines();
      setRoutines(updatedRoutines);
    } catch (err) {
      setFormError(err.message);
    }
  };

  if (error) return <p role="alert">Error has occurred: {error}</p>;

  return (
    <main>
      <h2>Routines</h2>
      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            <Link to={`/routines/${routine.id}`}>{routine.name}</Link>
          </li>
        ))}
      </ul>

      {token && (
        <article>
          <h3>Create a new routine</h3>
          <form onSubmit={handleSubmit}>
            {formError && <p role="alert">{formError}</p>}

            <label>
              Name:{" "}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Goal:{" "}
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
              />
            </label>

            <button type="submit">Create Routine</button>
          </form>
        </article>
      )}
    </main>
  );
}
