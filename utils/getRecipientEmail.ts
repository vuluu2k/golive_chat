import { User } from 'firebase/auth';
import { Conversation } from 'types';

export const getRecipientEmail = (conversationUsers: Conversation['users'], loggedInUser?: User | null) => {
  return conversationUsers.find(userEmail => userEmail !== loggedInUser?.email);
};
