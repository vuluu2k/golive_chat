import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as EmailValidator from 'email-validator';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

import { auth, db } from 'config/firebase';
import { Conversation } from 'types';
import ConversationSelect from 'components/ConversationSelect';

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: overlay;
  border-right: 1px solid whitesmoke;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
`;

const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
`;

const StyledSideBarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

const SideBar = () => {
  const [loggedInUser, loading, _error] = useAuthState(auth);
  const [isOpenNewConversation, setOpenNewConversation] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const isInvitingSelf = recipientEmail === loggedInUser?.email;

  const handleOpenNewConversation = () => setOpenNewConversation(true);
  const handleCloseNewConversation = () => {
    setOpenNewConversation(false);
    setRecipientEmail(' ');
  };

  const queryGetConversationsForCurrentUser = query(collection(db, 'conversations'), where('users', 'array-contains', loggedInUser?.email));

  const [conversationsSnapShot, __loading, __error] = useCollection(queryGetConversationsForCurrentUser);

  const isConversationAlreadyExists = (recipientEmail: string) => {
    return conversationsSnapShot?.docs.find(conversation => (conversation.data() as Conversation).users.includes(recipientEmail));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('error logout', error);
    }
  };

  const handleCreateConversation = async () => {
    if (!recipientEmail) return;
    if (isConversationAlreadyExists(recipientEmail)) return;
    if (EmailValidator.validate(recipientEmail) && !isInvitingSelf) {
      try {
        await addDoc(collection(db, 'conversations'), {
          users: [loggedInUser?.email, recipientEmail],
        });
        handleCloseNewConversation();
      } catch (error) {
        console.log('ERROR ADD CONVERSATION', error);
      }
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title={loggedInUser?.email as string} placement="right">
          <StyledUserAvatar src={loggedInUser?.photoURL as string}></StyledUserAvatar>
        </Tooltip>
        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </StyledHeader>

      <StyledSearch>
        <SearchIcon />
        <StyledSearchInput placeholder="Search in conversation" />
      </StyledSearch>
      <StyledSideBarButton onClick={handleOpenNewConversation}>Start a new conversation</StyledSideBarButton>

      {/* List Conversation */}

      {conversationsSnapShot?.docs.map(conversation => {
        return (
          <ConversationSelect
            key={conversation.id}
            id={conversation.id}
            conversationUsers={(conversation.data() as Conversation).users}
          />
        );
      })}

      <Dialog open={isOpenNewConversation} onClose={handleCloseNewConversation}>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter a Google email address for the user you wish to chat with</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={event => setRecipientEmail(event.target.value)}
            onKeyDown={event => {
              if (event.keyCode === 13) handleCreateConversation();
            }}></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewConversation}>Cancel</Button>
          <Button onClick={handleCreateConversation} disabled={!recipientEmail}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default SideBar;
