import { create } from 'zustand';
import type { Event } from '../services/events/events.types';

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  userEvents: Event[];
  isLoading: boolean;
  error: string | null;

  setEvents: (events: Event[]) => void;
  setCurrentEvent: (event: Event | null) => void;
  setUserEvents: (events: Event[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateEventInLists: (updatedEvent: Event) => void;
  removeEventFromLists: (eventId: string) => void;
  clearCurrentEvent: () => void;
  clearError: () => void;
}

export const useEventStore = create<EventState>((set, _) => ({
  events: [],
  currentEvent: null,
  userEvents: [],
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),
  setCurrentEvent: (currentEvent) => set({ currentEvent }),
  setUserEvents: (userEvents) => set({ userEvents }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  updateEventInLists: (updatedEvent) => {
    set(state => ({
      events: state.events.map(e => e.id === updatedEvent.id ? updatedEvent : e),
      userEvents: state.userEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e),
      currentEvent: state.currentEvent?.id === updatedEvent.id ? updatedEvent : state.currentEvent,
    }));
  },

  removeEventFromLists: (eventId) => {
    set(state => ({
      events: state.events.filter(e => e.id !== eventId),
      userEvents: state.userEvents.filter(e => e.id !== eventId),
      currentEvent: state.currentEvent?.id === eventId ? null : state.currentEvent,
    }));
  },

  clearCurrentEvent: () => set({ currentEvent: null }),

  clearError: () => set({ error: null }),
}));