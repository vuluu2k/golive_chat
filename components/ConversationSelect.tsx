import { useRecipient } from 'hooks/useRecipient';
import React from 'react';
import styled from 'styled-components';

import { Conversation } from 'types';
import RecipientAvatar from 'components/RecipientAvatar';
import { useRouter } from 'next/router';

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-all;

  :hover {
    background-color: #e9eaeb;
  }
`;

const ConversationSelect = ({ id, conversationUsers }: { id: string; conversationUsers: Conversation['users'] }) => {
  const { recipient, recipientEmail } = useRecipient(conversationUsers);

  const router = useRouter();

  const handleOnSelectConversation = () => {
    router.push(`/conversations/${id}`);
  };

  return (
    <StyledContainer onClick={handleOnSelectConversation}>
      <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
      <span>{recipientEmail}</span>
    </StyledContainer>
  );
};

export default ConversationSelect;
