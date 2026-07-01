import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import ConversationList from './ConversationList';
import ChatArea from './ChatArea';
import styles from './MessagesLayout.module.css';

export default function MessagesLayout() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { 
    conversations, 
    sendDirectMessage, 
    reactToMessage, 
    clearChat, 
    toggleBlockUser 
  } = useData();

  const initialChatId = conversationId 
    ? (isNaN(conversationId) ? conversationId : Number(conversationId))
    : (conversations[0]?.id || null);

  const [activeChatId, setActiveChatId] = useState(initialChatId);
  const [showChatOnMobile, setShowChatOnMobile] = useState(!!conversationId);

  useEffect(() => {
    if (conversationId) {
      const id = isNaN(conversationId) ? conversationId : Number(conversationId);
      setActiveChatId(id);
      setShowChatOnMobile(true);
    }
  }, [conversationId]);

  const activeConv = conversations.find((c) => c.id === activeChatId) || null;

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setShowChatOnMobile(true);
    navigate(`/messages/${id}`);
  };

  const handleBack = () => {
    setShowChatOnMobile(false);
  };

  const handleSend = (convId, text, replyTo = null) => {
    sendDirectMessage(convId, text, replyTo);
  };

  const handleReact = (convId, messageIndex, reaction) => {
    reactToMessage(convId, messageIndex, reaction);
  };

  const handleClearChat = (convId) => {
    clearChat(convId);
  };

  const handleBlockUser = (convId) => {
    toggleBlockUser(convId);
  };

  return (
    <div className={`feed ${styles.feedMessages}`}>
      <div className={`${styles.messagesLayout}${showChatOnMobile ? ' show-chat' : ''}`}>
        <ConversationList
          conversations={conversations}
          activeChatId={activeChatId}
          onSelect={handleSelectChat}
          showChatOnMobile={showChatOnMobile}
        />
        <ChatArea
          conversation={activeConv}
          onSendMessage={handleSend}
          onReactMessage={(msgIndex, reaction) => handleReact(activeChatId, msgIndex, reaction)}
          onClearChat={() => handleClearChat(activeChatId)}
          onBlockUser={() => handleBlockUser(activeChatId)}
          onBack={handleBack}
          showChatOnMobile={showChatOnMobile}
        />
      </div>
    </div>
  );
}
