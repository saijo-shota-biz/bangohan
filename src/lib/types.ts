export interface Calendar {
  id: string;
  createdAt: Date;
}

export interface DinnerRecord {
  id?: string;
  calendarId: string;
  date: string;
  name: string;
  needsDinner: boolean;
  createdAt: Date;
}