export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  EVENTS: {
    BASE: '/events',
    DETAIL: (id: string) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,

    PARTICIPANTS: {
      ALL: (id: string) => `/events/${id}/participants`,
      JOIN: (id: string) => `/events/${id}/participants`,
      LEAVE: (id: string) => `/events/${id}/participants/me`,
      CHECK: (id: string) => `/events/${id}/participants/me`,
      COUNT: (id: string) => `/events/${id}/participants/count`,
    },
  },

  USERS: {
    ME: '/users/me',
    ME_EVENTS: '/users/me/events',
    ME_PARTICIPATIONS: '/users/me/participations',
    DETAIL: (id: string) => `/users/${id}`,
  },

  TAGS: {
    BASE: '/tags',
    DETAIL: (id: string) => `/tags/${id}`,
    CREATE: '/tags',
    DELETE: (id: string) => `/tags/${id}`,
  },

  ASSISTANT: {
    ASK: '/assistant/ask',
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;