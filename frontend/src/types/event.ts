export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  capacity: number | null;
  visibility: 'public' | 'private';
  organizerId: string;
  organizer?: {
    id: string;
    name: string | null;
    email: string;
  };
  participants?: {
    userId: string;
    userName?: string;
  }[];
  participantsCount: number;
  isFull: boolean;
  userJoined: boolean;
  canEdit: boolean;
  createdAt: Date;
}
