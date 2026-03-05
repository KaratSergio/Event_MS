import { create } from 'zustand';
import type { Event } from '../types/event';

interface EventState {
  // State
  events: Event[];
  currentEvent: Event | null;
  userEvents: Event[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPublicEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
  fetchUserEvents: () => Promise<void>;
  createEvent: (eventData: Partial<Event>) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;
  clearCurrentEvent: () => void;
  clearError: () => void;
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Annual technology conference with industry experts',
    dateTime: new Date(Date.now() + 86400000), // tomorrow
    location: 'Convention Center, New York',
    capacity: 100,
    visibility: 'public',
    organizerId: '1',
    organizer: {
      id: '1',
      name: 'Bob Dylan',
      email: 'bob@g.com',
    },
    participantsCount: 25,
    isFull: false,
    userJoined: false,
    canEdit: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Web Development Workshop',
    description: 'Hands-on workshop on modern web development',
    dateTime: new Date(Date.now() + 604800000), // next week
    location: 'Online (Zoom)',
    capacity: 50,
    visibility: 'public',
    organizerId: '1',
    organizer: {
      id: '1',
      name: 'Bob Dylan',
      email: 'bob@g.com',
    },
    participantsCount: 50,
    isFull: true,
    userJoined: false,
    canEdit: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Networking Meetup',
    description: 'Casual networking event for tech professionals',
    dateTime: new Date(Date.now() + 604800000), // next week
    location: 'Downtown Cafe',
    capacity: null,
    visibility: 'public',
    organizerId: '2',
    organizer: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@g.com',
    },
    participantsCount: 12,
    isFull: false,
    userJoined: true,
    canEdit: false,
    createdAt: new Date(),
  },
];

export const useEventStore = create<EventState>((set, get) => ({
  // Initial state
  events: [],
  currentEvent: null,
  userEvents: [],
  isLoading: false,
  error: null,

  fetchPublicEvents: async () => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      console.log('Fetching public events...');
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));

      set({
        events: mockEvents,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch events',
        isLoading: false
      });
    }
  },

  fetchEventById: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      console.log('Fetching event:', id);
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));

      const event = mockEvents.find(e => e.id === id);

      set({
        currentEvent: event || null,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch event',
        isLoading: false
      });
    }
  },

  fetchUserEvents: async () => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      console.log('Fetching user events...');
      // Mock API response - events where user is participant or organizer
      await new Promise(resolve => setTimeout(resolve, 500));

      const userEvents = mockEvents.filter(e => e.userJoined || e.organizerId === '1');

      set({
        userEvents,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user events',
        isLoading: false
      });
    }
  },

  createEvent: async (eventData: Partial<Event>) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      console.log('Creating event:', eventData);
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      await get().fetchPublicEvents();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create event',
        isLoading: false
      });
    }
  },

  updateEvent: async (id: string, eventData: Partial<Event>) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      console.log('Updating event:', id, eventData);
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      const currentEvent = get().currentEvent;
      if (currentEvent && currentEvent.id === id) {
        set({
          currentEvent: { ...currentEvent, ...eventData },
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update event',
        isLoading: false
      });
    }
  },

  deleteEvent: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      console.log('Deleting event:', id);
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        events: state.events.filter(e => e.id !== id),
        userEvents: state.userEvents.filter(e => e.id !== id),
        currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete event',
        isLoading: false
      });
    }
  },

  joinEvent: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      console.log('Joining event:', id);
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        events: state.events.map(e =>
          e.id === id
            ? { ...e, userJoined: true, participantsCount: e.participantsCount + 1, isFull: e.capacity ? e.participantsCount + 1 >= e.capacity : false }
            : e
        ),
        userEvents: [...state.userEvents, ...state.events.filter(e => e.id === id)],
        currentEvent: state.currentEvent?.id === id
          ? { ...state.currentEvent, userJoined: true, participantsCount: state.currentEvent.participantsCount + 1 }
          : state.currentEvent,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to join event',
        isLoading: false
      });
    }
  },

  leaveEvent: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual API call
      console.log('Leaving event:', id);
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        events: state.events.map(e =>
          e.id === id
            ? { ...e, userJoined: false, participantsCount: e.participantsCount - 1, isFull: false }
            : e
        ),
        userEvents: state.userEvents.filter(e => e.id !== id),
        currentEvent: state.currentEvent?.id === id
          ? { ...state.currentEvent, userJoined: false, participantsCount: state.currentEvent.participantsCount - 1 }
          : state.currentEvent,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to leave event',
        isLoading: false
      });
    }
  },

  clearCurrentEvent: () => set({ currentEvent: null }),

  clearError: () => set({ error: null }),
}));