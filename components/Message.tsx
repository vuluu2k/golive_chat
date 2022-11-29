import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';

import { auth } from 'config/firebase';
import { IMessage } from 'types';
import Tooltip from '@mui/material/Tooltip';

const StyledMessage = styled.div`
  width: fit-content;
  word-break: break-all;
  max-width: 90%;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  position: relative;
`;

const StyledSenderMessage = styled(StyledMessage)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const StyledReceiverMessage = styled(StyledMessage)`
  background-color: whitesmoke;
`;

const StyledTimeStamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: x-small;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
`;

type Props = {
  message: IMessage;
};

function Message({ message }: Props) {
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  const MessageType = loggedInUser?.email === message.user ? StyledSenderMessage : StyledReceiverMessage;

  return (
    <Tooltip title={message.send_at}>
      <MessageType>
        {message.content}
        {/* <StyledTimeStamp>{message.send_at}</StyledTimeStamp> */}
      </MessageType>
    </Tooltip>
  );
}

export default Message;
