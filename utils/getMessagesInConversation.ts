import { db } from 'config/firebase';
import { collection, DocumentData, orderBy, query, QueryDocumentSnapshot, Timestamp, where } from 'firebase/firestore';
import { IMessage } from 'types';

export const generateQueryGetMessages = (conversationId?: string) =>
  query(collection(db, 'messages'), where('conversation_id', '==', conversationId), orderBy('sent_at', 'asc'));

export const transformMessage = (message: QueryDocumentSnapshot<DocumentData>) =>
  ({
    id: message.id,
    ...message.data(), // spread out conversation_id, text, sent_at, user
    sent_at: message.data().sent_at ? convertFirestoreTimestampToString(message.data().sent_at as Timestamp) : null,
  } as IMessage);

export const convertFirestoreTimestampToString = (timestamp: Timestamp) => new Date(timestamp.toDate().getTime()).toLocaleString();
