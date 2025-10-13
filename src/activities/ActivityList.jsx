import { Link } from "react-router-dom";

export default function ActivityList({ activities }) {
  return (
    <ul>
      {activities.map((activity) => (
        <li key={activity.id}>
          <Link to={`/activities/${activity.id}`}>{activity.name}</Link>
        </li>
      ))}
    </ul>
  );
}
