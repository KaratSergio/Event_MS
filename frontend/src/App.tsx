import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthPage from './pages/AuthPage';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Assistant from './components/assistant/Assistant';
import LoadingState from './components/ui/LoadingState';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

const EventsList = lazy(() => import('./pages/EventsList'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const CreateEvent = lazy(() => import('./pages/CreateEvent'));
const MyEvents = lazy(() => import('./pages/MyEvents'));

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/:mode" element={<AuthPage />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/events" replace />} />
          <Route
            path="events"
            element={
              <Suspense fallback={<LoadingState message="Loading events..." fullScreen />}>
                <EventsList />
              </Suspense>
            }
          />
          <Route
            path="events/:id"
            element={
              <Suspense fallback={<LoadingState message="Loading event details..." fullScreen />}>
                <EventDetails />
              </Suspense>
            }
          />
        </Route>

        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route
            path="create-event"
            element={
              <Suspense fallback={<LoadingState message="Loading form..." fullScreen />}>
                <CreateEvent />
              </Suspense>
            }
          />
          <Route
            path="my-events"
            element={
              <Suspense fallback={<LoadingState message="Loading your events..." fullScreen />}>
                <MyEvents />
              </Suspense>
            }
          />
        </Route>
      </Routes>

      <Assistant />
    </Router>
  );
}

export default App;