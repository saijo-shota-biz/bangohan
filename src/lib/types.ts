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
  dinnerTime?: string;
  createdAt: Date;
}

export interface UserPreference {
  id?: string;
  calendarId: string;
  userName: string;
  defaultDinnerTime?: string;
  createdAt: Date;
}