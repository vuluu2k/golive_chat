import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import SideBar from 'components/SideBar';
import { auth, db } from 'config/firebase';
import { Conversation, IMessage } from 'types';
import { getRecipientEmail } from 'utils/getRecipientEmail';
import { generateQueryGetMessages, transformMessage } from 'utils/getMessagesInConversation';
import ConversationScreen from 'components/ConversationScreen';

const StyledContainer = styled.div`
  display: flex;
`;

const StyledConversationContainer = styled.div`
  flex-grow:1;
  overflow: auto;
  height: 100vh;
`;

interface Props {
  conversation: Conversation;
  messages: IMessage[];
}

const Conversation = ({ conversation, messages }: Props) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);


  return (
    <StyledContainer>
      <Head>
        <title>Conversation with {getRecipientEmail(conversation?.users, loggedInUser)} </title>
      </Head>
      <SideBar />
      <StyledConversationContainer>
        <ConversationScreen messages={messages} conversation={conversation} />
      </StyledConversationContainer>
    </StyledContainer>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async context => {
  const conversationId = context.params?.id;

  const conversationRef = doc(db, 'conversations', conversationId as string);

  const conversationSnapShot = await getDoc(conversationRef);

  const queryMessages = generateQueryGetMessages(conversationId);

  const messagesSnapShot = await getDocs(queryMessages);

  const messages = messagesSnapShot.docs.map(messageDoc => transformMessage(messageDoc));

  return {
    props: {
      conversation: conversationSnapShot.data() as Conversation,
      messages,
    },
  };
};
