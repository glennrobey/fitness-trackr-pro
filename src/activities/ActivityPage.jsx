import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getActivity, deleteActivity } from "../api/activities";

export default function ActivityPage() {
  const { activityId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getActivity(activityId)
      .then(setActivity)
      .catch((err) => setError(err.message));
  }, [activityId]);

  const handleDelete = () => {
    if (!token) return;

    deleteActivity(token, activityId)
      .then(() => navigate("/activities"))
      .catch((err) => setError(err.message));
  };

  if (error) return <p>{error}</p>;
  if (!activity) return <p>Loading...</p>;

  return (
    <div>
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <p>Created by: {activity.creatorName}</p>
      {token && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
}
