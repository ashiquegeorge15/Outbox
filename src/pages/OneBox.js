import React, { useState, useEffect, useContext, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { FiTrash2, FiStar, FiMail, FiArrowLeft, FiMoon, FiSun, FiSettings } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { getOneboxList, deleteOneboxThread } from '../services/api';
import ReplyEditor from '../components/ReplyEditor';
import SmartTagging from '../components/SmartTagging';

const OneBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-light);
  color: var(--text-primary);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: var(--primary-color);
  color: white;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 16px;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const EmailList = styled.div`
  width: 400px;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  background-color: var(--background-light);
`;

const EmailDetail = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: var(--background-light);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const EmailItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  background-color: ${props => props.active ? 'var(--primary-light)' : 'transparent'};
  
  &:hover {
    background-color: var(--primary-light);
  }
`;

const EmailSender = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
`;

const EmailSubject = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-primary);
`;

const EmailPreview = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmailTime = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 8px;
  text-align: right;
`;

const NoEmails = styled.div`
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  margin-right: 16px;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const EmailDetailHeader = styled.div`
  margin-bottom: 24px;
`;

const EmailDetailSubject = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
`;

const EmailDetailSender = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const SenderAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 16px;
`;

const SenderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SenderName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const SenderEmail = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`;

const EmailDetailTime = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: auto;
`;

const EmailDetailBody = styled.div`
  line-height: 1.6;
  color: var(--text-primary);
  
  img {
    max-width: 100%;
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoSelection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  
  svg {
    font-size: 48px;
    margin-bottom: 16px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${props => {
    switch(props.type) {
      case 'urgent': return 'rgba(244, 67, 54, 0.1)';
      case 'work': return 'rgba(33, 150, 243, 0.1)';
      case 'personal': return 'rgba(76, 175, 80, 0.1)';
      case 'document': return 'rgba(255, 193, 7, 0.1)';
      default: return 'rgba(158, 158, 158, 0.1)';
    }
  }};
  border: 1px solid ${props => {
    switch(props.type) {
      case 'urgent': return 'rgba(244, 67, 54, 0.3)';
      case 'work': return 'rgba(33, 150, 243, 0.3)';
      case 'personal': return 'rgba(76, 175, 80, 0.3)';
      case 'document': return 'rgba(255, 193, 7, 0.3)';
      default: return 'rgba(158, 158, 158, 0.3)';
    }
  }};
  border-radius: 16px;
  color: ${props => {
    switch(props.type) {
      case 'urgent': return '#F44336';
      case 'work': return '#2196F3';
      case 'personal': return '#4CAF50';
      case 'document': return '#FFC107';
      default: return '#9E9E9E';
    }
  }};
  font-size: 12px;
  font-weight: 500;
  
  svg {
    margin-right: 4px;
  }
`;

// Add these new styled components to enhance user experience
const KeyboardShortcutInfo = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: var(--primary-light);
  border-radius: 8px;
  color: var(--text-primary);
`;

const ShortcutTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ShortcutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ShortcutItem = styled.div`
  display: flex;
  align-items: center;
`;

const ShortcutKey = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gray-light);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: monospace;
  font-weight: 600;
  margin-right: 8px;
  min-width: 24px;
`;

const ShortcutDescription = styled.span`
  color: var(--text-secondary);
`;

const Notification = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 16px;
  background-color: var(--success-color);
  color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  transform: translateY(${props => props.show ? 0 : '20px'});
  transition: opacity 0.3s, transform 0.3s;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-left: 16px;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 5px;
  }
`;

const OneBox = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [threadTags, setThreadTags] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Show notification helper
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchThreads = async () => {
      try {
        const response = await getOneboxList();
        setThreads(response);
      } catch (error) {
        console.error('Error fetching threads:', error);
        showNotification('Failed to load emails. Please try again.');
      }
    };
    
    fetchThreads();
  }, [user, navigate]);

  const handleSelectThread = (thread) => {
    setSelectedThread(thread);
    setShowReplyEditor(false);
  };

  const handleDeleteThread = async (threadId, event) => {
    if (event) {
      event.stopPropagation(); // Prevent thread selection when clicking delete button
    }
    
    try {
      await deleteOneboxThread(threadId);
      setThreads(threads.filter(thread => thread.id !== threadId));
      
      if (selectedThread && selectedThread.id === threadId) {
        setSelectedThread(null);
      }
      
      showNotification('Email deleted successfully');
    } catch (error) {
      console.error('Error deleting thread:', error);
      showNotification('Failed to delete email. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReply = () => {
    setShowReplyEditor(true);
  };

  const handleApplyTags = (threadId, tags) => {
    setThreadTags(prevTags => ({
      ...prevTags,
      [threadId]: tags
    }));
  };

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event) => {
    if (!selectedThread) return;
    
    // Check if user is not in an input or editor
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.className.includes('ql-editor')) {
      return;
    }
    
    if (event.key === 'd' || event.key === 'D') {
      handleDeleteThread(selectedThread.id);
      showNotification('Email deleted (D)');
    } else if (event.key === 'r' || event.key === 'R') {
      handleReply();
      showNotification('Reply mode activated (R)');
    }
  }, [selectedThread, handleDeleteThread, handleReply]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <OneBoxContainer>
      <Header>
        <Logo>ReachInbox</Logo>
        <UserInfo>
          <UserAvatar src={user?.user?.picture || 'https://randomuser.me/api/portraits/men/1.jpg'} alt="User avatar" />
          <UserName>{user?.user?.name || 'John Doe'}</UserName>
          <ThemeToggle onClick={toggleTheme}>
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </ThemeToggle>
          <NavLink to="/api-tester">
            <FiSettings />
            API Tester
          </NavLink>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>
      
      <ContentContainer>
        <EmailList>
          <ActionBar>
            <ActionButton>
              <FiMail />
            </ActionButton>
          </ActionBar>
          
          {threads.length === 0 ? (
            <NoEmails>No emails found</NoEmails>
          ) : (
            threads.map(thread => (
              <EmailItem 
                key={thread.id} 
                active={selectedThread && selectedThread.id === thread.id}
                onClick={() => handleSelectThread(thread)}
              >
                <EmailSender>{thread.fromName}</EmailSender>
                <EmailSubject>{thread.subject}</EmailSubject>
                <EmailPreview>{thread.preview}</EmailPreview>
                <EmailTime>{formatDate(thread.timestamp)}</EmailTime>
                {threadTags[thread.id] && threadTags[thread.id].length > 0 && (
                  <TagsContainer>
                    {threadTags[thread.id].map(tag => (
                      <Tag key={tag.id} type={tag.type}>
                        {tag.icon}
                        {tag.name}
                      </Tag>
                    ))}
                  </TagsContainer>
                )}
                <ActionButton onClick={(e) => handleDeleteThread(thread.id, e)}>
                  <FiTrash2 />
                </ActionButton>
              </EmailItem>
            ))
          )}
        </EmailList>
        
        <EmailDetail>
          {selectedThread ? (
            <>
              <EmailDetailHeader>
                <EmailDetailSubject>{selectedThread.subject}</EmailDetailSubject>
                <EmailDetailSender>
                  <SenderAvatar src={selectedThread.avatar} alt="Sender avatar" />
                  <SenderInfo>
                    <SenderName>{selectedThread.fromName}</SenderName>
                    <SenderEmail>{selectedThread.from}</SenderEmail>
                  </SenderInfo>
                  <EmailDetailTime>{formatDate(selectedThread.timestamp)}</EmailDetailTime>
                </EmailDetailSender>
                {threadTags[selectedThread.id] && threadTags[selectedThread.id].length > 0 && (
                  <TagsContainer>
                    {threadTags[selectedThread.id].map(tag => (
                      <Tag key={tag.id} type={tag.type}>
                        {tag.icon}
                        {tag.name}
                      </Tag>
                    ))}
                  </TagsContainer>
                )}
              </EmailDetailHeader>
              
              <EmailDetailBody dangerouslySetInnerHTML={{ __html: selectedThread.body }} />
              
              <SmartTagging 
                subject={selectedThread.subject}
                body={selectedThread.body}
                onApplyTags={(tags) => handleApplyTags(selectedThread.id, tags)}
              />
              
              {showReplyEditor ? (
                <ReplyEditor 
                  threadId={selectedThread.id}
                  to={selectedThread.from}
                  subject={`Re: ${selectedThread.subject}`}
                  onCancel={() => setShowReplyEditor(false)}
                />
              ) : (
                <ActionButton onClick={handleReply}>
                  Reply
                </ActionButton>
              )}
              
              {!showReplyEditor && (
                <KeyboardShortcutInfo>
                  <ShortcutTitle>Keyboard Shortcuts</ShortcutTitle>
                  <ShortcutList>
                    <ShortcutItem>
                      <ShortcutKey>D</ShortcutKey>
                      <ShortcutDescription>Delete this email</ShortcutDescription>
                    </ShortcutItem>
                    <ShortcutItem>
                      <ShortcutKey>R</ShortcutKey>
                      <ShortcutDescription>Reply to this email</ShortcutDescription>
                    </ShortcutItem>
                  </ShortcutList>
                </KeyboardShortcutInfo>
              )}
            </>
          ) : (
            <NoSelection>
              <FiMail />
              <p>Select an email to view</p>
            </NoSelection>
          )}
        </EmailDetail>
      </ContentContainer>
      
      {notification.show && (
        <Notification show={notification.show}>
          {notification.message}
        </Notification>
      )}
    </OneBoxContainer>
  );
};

export default OneBox; 