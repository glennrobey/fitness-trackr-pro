import { useState, useEffect } from "react";
import { getActivities } from "../api/activities";
import ActivityList from "./ActivityList";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchActivities();
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!activities.length) return <p>Loading activities...</p>;

  return (
    <div>
      <h2>Activities</h2>
      <ActivityList activities={activities} />
    </div>
  );
}
