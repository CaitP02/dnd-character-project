import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/States.jsx';

const NotFound = () => (
  <EmptyState
    title="Page not found"
    action={<Link to="/" className="btn">Back to all characters</Link>}
  >
    The page you're looking for doesn't exist or has moved.
  </EmptyState>
);

export default NotFound;
