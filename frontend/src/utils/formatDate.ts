interface FormattedDateTime {
  date: string;
  time: string;
}

/**
 * Example: "Jan 15, 2024" и "14:30"
 */
export const formatEventListItem = (dateString: string): FormattedDateTime => {
  try {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };
  } catch {
    return { date: 'Invalid date', time: '' };
  }
};

/**
 * Example: "Monday, January 15, 2024" и "2:30 PM"
 */
export const formatEventDetails = (dateString: string): FormattedDateTime => {
  try {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch {
    return { date: 'Invalid date', time: '' };
  }
};