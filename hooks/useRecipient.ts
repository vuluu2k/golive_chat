import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, db } from 'config/firebase';
import { AppUser, Conversation } from 'types';
import { getRecipientEmail } from 'utils/getRecipientEmail';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

export const useRecipient = (conversationUsers: Conversation['users']) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser);
  const queryGetRecipient = query(collection(db, 'users'), where('email', '==', recipientEmail));

  const [recipientSnapshot, __loading, __error] = useCollection(queryGetRecipient);

  const recipient = recipientSnapshot?.docs[0]?.data() as AppUser | undefined;

  return { recipient, recipientEmail };
};
