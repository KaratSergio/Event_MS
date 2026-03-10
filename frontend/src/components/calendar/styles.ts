export const injectCalendarStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .rbc-toolbar {
      display: none !important;
    }
    
    /* Remove background colors */
    .rbc-month-view,
    .rbc-month-row,
    .rbc-row-bg,
    .rbc-day-bg {
      background: transparent !important;
    }
    
    .rbc-off-range-bg {
      background: #f9fafb !important;
    }

    /* Highlight the current day */
    .rbc-current .rbc-date-cell {
      background-color: #f0fdf4 !important;
      border-radius: 50% !important;
      color: #16a34a !important;
      font-weight: bold !important;
    }

    .rbc-current .rbc-date-cell a {
      color: #16a34a !important;
      font-weight: bold !important;
    }

    /* Highlight the selected day */
    .rbc-selected .rbc-date-cell {
      background-color: #dbeafe !important;
      border-radius: 50% !important;
      color: #2563eb !important;
      font-weight: bold !important;
    }

    .rbc-selected .rbc-date-cell a {
      color: #2563eb !important;
      font-weight: bold !important;
    }

     /* The Current day (month view) */
    .rbc-today {
      background: #f0fdf4 !important;
    }

    /* Styles for participant events */
    .rbc-event-participant, 
    .rbc-event-participant .rbc-event-content {
      color: #1e40af !important;
      background: #dbeafe !important;
    }

    /* Styles for organizer events */
    .rbc-event-organizer, 
    .rbc-event-organizer .rbc-event-content {
      color: #6b21a8 !important;
      background: #f3e8ff !important;
    }

    /* Responsive styles for mobile */
    @media (max-width: 640px) {
      .rbc-month-view {
        font-size: 12px !important;
      }
      
      .rbc-row-content {
        min-height: 40px !important;
      }
      
      .rbc-event {
        padding: 0px 2px !important;
        font-size: 10px !important;
        min-height: 18px !important;
      }
      
      .rbc-date-cell {
        padding: 2px !important;
        text-align: center !important;
      }
      
      .rbc-date-cell a {
        font-size: 11px !important;
      }
      
      .rbc-header {
        padding: 4px 0 !important;
        font-size: 11px !important;
      }
      
      .rbc-day-bg {
        min-height: 40px !important;
      }
      
      .rbc-row-segment {
        padding: 0 1px !important;
      }
    }
  `;
  document.head.appendChild(style);
};