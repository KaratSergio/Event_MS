import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/events" replace />} />
          <Route path="events" element={<EventsList />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="my-events" element={<MyEvents />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;