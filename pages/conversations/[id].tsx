import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import SideBar from 'components/SideBar';
import { auth, db } from 'config/firebase';
import { Conversation } from 'types';
import { getRecipientEmail } from 'utils/getRecipientEmail';
import { generateQueryGetMessages } from 'utils/getMessagesInConversation';

const StyledContainer = styled.div`
  display: flex;
`;

interface Props {
  conversation: Conversation;
}

const Conversation = ({ conversation }: Props) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  return (
    <StyledContainer>
      <Head>
        <title>Conversation with {getRecipientEmail(conversation?.users, loggedInUser)} </title>
      </Head>
      <SideBar />
    </StyledContainer>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async context => {
  const conversationId = context.params?.id;

  const conversationRef = doc(db, 'conversations', conversationId as string);

  const conversationSnapShot = await getDoc(conversationRef);

  const queryMessages = generateQueryGetMessages(conversationId);

  console.log(queryMessages);

  const messagesSnapShot = await getDocs(queryMessages);

  console.log(messagesSnapShot.docs);

  return {
    props: {
      conversation: conversationSnapShot.data() as Conversation,
    },
  };
};
