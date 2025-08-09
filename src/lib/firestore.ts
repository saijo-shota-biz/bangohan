import { 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { DinnerRecord } from './types';

// カレンダー作成
export async function createCalendar(calendarId: string): Promise<void> {
  const calendarRef = doc(db, 'calendars', calendarId);
  await setDoc(calendarRef, {
    createdAt: serverTimestamp()
  });
}

// 晩御飯記録を追加
export async function addDinnerRecord(
  calendarId: string,
  date: string,
  name: string,
  needsDinner: boolean
): Promise<void> {
  const recordsRef = collection(db, 'calendars', calendarId, 'records');
  await addDoc(recordsRef, {
    date,
    name,
    needsDinner,
    createdAt: serverTimestamp()
  });
}

// 特定の日付の記録を取得
export async function getDinnerRecords(
  calendarId: string,
  date: string
): Promise<DinnerRecord[]> {
  const recordsRef = collection(db, 'calendars', calendarId, 'records');
  const q = query(
    recordsRef,
    where('date', '==', date),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    calendarId,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
  })) as DinnerRecord[];
}

// 月の記録を取得
export async function getMonthRecords(
  calendarId: string,
  yearMonth: string // YYYY-MM形式
): Promise<DinnerRecord[]> {
  const recordsRef = collection(db, 'calendars', calendarId, 'records');
  const startDate = `${yearMonth}-01`;
  const endDate = `${yearMonth}-31`;
  
  const q = query(
    recordsRef,
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date'),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    calendarId,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
  })) as DinnerRecord[];
}

// リアルタイム監視
export function subscribeToMonthRecords(
  calendarId: string,
  yearMonth: string,
  callback: (records: DinnerRecord[]) => void
): () => void {
  const recordsRef = collection(db, 'calendars', calendarId, 'records');
  const startDate = `${yearMonth}-01`;
  const endDate = `${yearMonth}-31`;
  
  const q = query(
    recordsRef,
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date'),
    orderBy('createdAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      calendarId,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
    })) as DinnerRecord[];
    
    callback(records);
  });
  
  return unsubscribe;
}