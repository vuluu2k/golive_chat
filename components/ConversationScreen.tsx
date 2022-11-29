import React, { FormEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';

import { Conversation, IMessage } from 'types';
import { useRecipient } from 'hooks/useRecipient';
import RecipientAvatar from 'components/RecipientAvatar';
import { convertFirestoreTimestampToString, generateQueryGetMessages, transformMessage } from 'utils/getMessagesInConversation';
import { auth, db } from 'config/firebase';
import Message from 'components/Message';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

type Props = {
  conversation: Conversation;
  messages: IMessage[];
};

const StyledRecipientHeader = styled.div`
  position: sticky;
  background-color: white;
  z-index: 999;
  top: 0;
  display: flex;
  align-items: center;
  padding: 11px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const StyledHeaderInfo = styled.div`
  flex-grow: 1;

  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }

  > span {
    font-size: 14px;
    color: gray;
  }
`;

const StyledH3 = styled.div`
  word-break: break-all;
`;

const StyledHeaderIcons = styled.div`
  display: flex;
`;

const StyledMessageContainer = styled.div`
  padding: 30px;
  overflow: overlay;
  background-color: #e5ded8;
  min-height: calc(100vh - 140px);
`;

const StyledInputContainer = styled.form`
  display: flex;
  height: 60px;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 10px;
`;

const EndOfMessagesForAutoScroll = styled.div``;

function ConversationScreen({ messages, conversation }: Props) {
  const conversationUsers = conversation.users;
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const { recipient, recipientEmail } = useRecipient(conversationUsers);
  const [newMessage, setNewMessage] = useState('');

  const router = useRouter();
  const conversationId = router.query.id;
  const queryMessages = generateQueryGetMessages(conversationId as string);

  const [messagesSnapShot, messageLoading, __error] = useCollection(queryMessages);

  const showMessage = () => {
    if (messageLoading) {
      return messages.map(message => <Message key={message.id} message={message} />);
    }

    if (messagesSnapShot) {
      return messagesSnapShot.docs.map(messageSnapShot => {
        const message = transformMessage(messageSnapShot);
        return <Message key={message.id} message={message} />;
      });
    }

    return null;
  };

  const handleSendMessage = async (event: FormEvent) => {
    event.preventDefault();
    await setDoc(
      doc(db, 'users', loggedInUser?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
    await addDoc(collection(db, 'messages'), {
      conversation_id: conversationId,
      send_at: serverTimestamp(),
      content: newMessage,
      user: loggedInUser?.email,
    });

    setNewMessage('');
    scrollToBottom();
  };

  const endOfMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
        <StyledHeaderInfo>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && <span>Last Active: {convertFirestoreTimestampToString(recipient.lastSeen)}</span>}
        </StyledHeaderInfo>
        <StyledHeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </StyledHeaderIcons>
      </StyledRecipientHeader>

      <StyledMessageContainer>
        {showMessage()}
        <EndOfMessagesForAutoScroll ref={endOfMessageRef} />
      </StyledMessageContainer>

      <StyledInputContainer onSubmit={handleSendMessage}>
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <StyledInput
          value={newMessage}
          onChange={event => setNewMessage(event.target.value)}
          onKeyDown={event => {
            if (event.keyCode === 13) handleSendMessage(event);
          }}></StyledInput>
        <IconButton onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
}

export default ConversationScreen;
