import React, { useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import '../style/Chat.css';

window.Pusher = Pusher;

const HelpdeskChat = () => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [chatChannel, setChatChannel] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [userConversations, setUserConversations] = useState({});

    // Helpdesk user ID
    const HELPDESK_USER_ID = 11;


    // CONSISTENT CHANNEL NAMING FUNCTION
    const createChannelName = (user1Id, user2Id) => {
        // Always put the smaller ID first for consistency
        const sortedIds = [user1Id, user2Id].sort((a, b) => a - b);
        return `chat.${sortedIds[0]}-${sortedIds[1]}`;
    };

    const decryptToken = () => {
        const secretKey = import.meta.env.VITE_SECRET_KEY;
        const encryptedToken = localStorage.getItem('authToken');
        if (!encryptedToken || !secretKey) return null;

        try {
            const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (err) {
            console.error('❌ Token decryption failed:', err);
            return null;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = decryptToken();
            if (!token) {
                setError('Auth token missing or invalid');
                return;
            }

            try {
                const res = await axios.get('/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const currentUserId = res.data.user.id;
                setUserId(currentUserId);

                // Verify this is actually the helpdesk user
                if (currentUserId !== HELPDESK_USER_ID) {
                    setError('Access denied: This is a helpdesk-only interface');
                    return;
                }

                // Fetch available users who have sent messages
                await fetchAvailableUsers(token);
            } catch (err) {
                console.error('❌ Failed to get user data:', err);
                setError('Unauthorized – check token or login again');
            }
        };

        fetchUserData();
    }, []);

    const fetchAvailableUsers = async (token) => {
        try {
            const res = await axios.get('/api/helpdesk/conversations', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAvailableUsers(res.data.users || []);

            // Create conversation summary
            const conversations = {};
            res.data.users.forEach(user => {
                conversations[user.id] = {
                    unreadCount: user.unread_count || 0,
                    lastMessage: user.last_message || '',
                    lastMessageTime: user.last_message_time || null
                };
            });
            setUserConversations(conversations);

        } catch (err) {
            console.error('❌ Failed to fetch available users:', err);
            // Fallback: you can manually add some users for testing
            setAvailableUsers([
                { id: 2, name: 'User 2', email: 'user2@example.com' },
                { id: 8, name: 'User 8', email: 'user8@example.com' }
            ]);
        }
    };

    useEffect(() => {
        if (!userId || !selectedUserId) return;

        const token = decryptToken();
        if (!token) return;

        // Use consistent channel naming
        const channelName = createChannelName(HELPDESK_USER_ID, selectedUserId);
        setChatChannel(channelName);

        console.log(`🔗 Helpdesk connecting to channel: ${channelName}`);
        const apiURL = import.meta.env.VITE_API_URL;
        const echo = new Echo({
            broadcaster: 'reverb',
            key: 'some-random-key',
            wsHost: 'calendarling-websocket-server.fly.dev',
            wsPort: 443,
            wssPort: 443,
            forceTLS: true,
            encrypted: true,
            enabledTransports: ['ws', 'wss'],
            authEndpoint: `${apiURL}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                }
            },
        });

        echo.connector.pusher.connection.bind('connected', () => {
            console.log('✅ WebSocket connected');
            setIsConnected(true);
            setError(null);
        });

        echo.connector.pusher.connection.bind('disconnected', () => {
            console.log('❌ WebSocket disconnected');
            setIsConnected(false);
        });

        echo.connector.pusher.connection.bind('error', (err) => {
            console.error('❌ WebSocket error:', err);
            setError(err.message || 'Connection error');
        });

        const channel = echo.private(channelName);

        channel.listen('.PrivateMessageSent', (event) => {
            console.log('📨 Helpdesk received event:', event);
            setMessages((prev) => [
                ...prev,
                {
                    message: event.message,
                    senderName: event.sender_name,
                    timestamp: event.timestamp || new Date().toISOString(),
                    id: `${event.sender_id}-${Date.now()}`,
                    isOwn: event.sender_id === userId,
                },
            ]);

            // Update conversation info when receiving message
            if (event.sender_id !== userId) {
                setUserConversations(prev => ({
                    ...prev,
                    [event.sender_id]: {
                        ...prev[event.sender_id],
                        lastMessage: event.message,
                        lastMessageTime: event.timestamp,
                        unreadCount: event.sender_id === selectedUserId ? 0 : (prev[event.sender_id]?.unreadCount || 0) + 1
                    }
                }));
            }
        });

        channel.error((error) => {
            console.error('❌ Channel error:', error);
            setError(`Channel error: ${error.message || 'Unknown error'}`);
        });

        return () => {
            echo.disconnect();
        };
    }, [userId, selectedUserId]);

    const sendMessage = async () => {
        if (newMessage.trim() === '' || !selectedUserId) return;

        const token = decryptToken();
        if (!token) {
            setError('Auth token missing or invalid');
            return;
        }

        try {
            const res = await axios.post(
                '/send-message',
                {
                    message: newMessage.trim(),
                    receiver_id: selectedUserId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Helpdesk message sent:', res.data);
            setNewMessage('');
        } catch (err) {
            console.error('❌ Send message error:', err.response || err);
            const msg = err.response?.data?.message || err.message;
            setError(`Send message error: ${msg}`);
        }
    };

    const selectUser = (user) => {
        setSelectedUserId(user.id);
        setMessages([]); // Clear messages when switching users

        // Mark as read
        setUserConversations(prev => ({
            ...prev,
            [user.id]: {
                ...prev[user.id],
                unreadCount: 0
            }
        }));
    };

    const clearMessages = () => {
        setMessages([]);
    };

    const refreshUsers = async () => {
        const token = decryptToken();
        if (token) {
            await fetchAvailableUsers(token);
        }
    };

    // Load message history when user is selected
    const loadMessageHistory = async (userId) => {
        const token = decryptToken();
        if (!token) return;

        try {
            const res = await axios.get(`/messages/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessages(res.data.messages || []);
        } catch (err) {
            console.error('❌ Failed to load message history:', err);
        }
    };

    useEffect(() => {
        if (selectedUserId) {
            loadMessageHistory(selectedUserId);
        }
    }, [selectedUserId]);

    return (
        <div className="websocket-container">
            <h2>Helpdesk Dashboard</h2>

            {/* User Selection Panel */}
            <div className="helpdesk-users">
                <div className="users-header">
                    <h3>Active Conversations</h3>
                    <button onClick={refreshUsers} className="button-secondary">
                        Refresh
                    </button>
                </div>
                <div className="users-list">
                    {availableUsers.length === 0 ? (
                        <p>No active conversations. Users will appear here when they send messages.</p>
                    ) : (
                        availableUsers.map(user => (
                            <div
                                key={user.id}
                                className={`user-item ${selectedUserId === user.id ? 'selected' : ''}`}
                                onClick={() => selectUser(user)}
                            >
                                <div className="user-info">
                                    <strong>{user.name || `User ${user.id}`}</strong>
                                    <small>{user.email}</small>
                                </div>
                                <div className="conversation-info">
                                    {userConversations[user.id]?.unreadCount > 0 && (
                                        <span className="unread-badge">
                                            {userConversations[user.id].unreadCount}
                                        </span>
                                    )}
                                    {userConversations[user.id]?.lastMessage && (
                                        <div className="last-message">
                                            {userConversations[user.id].lastMessage.substring(0, 30)}...
                                        </div>
                                    )}
                                    {userConversations[user.id]?.lastMessageTime && (
                                        <div className="last-message-time">
                                            {new Date(userConversations[user.id].lastMessageTime).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Selected User Info */}
            {selectedUserId && (
                <div className="selected-user-info">
                    <h4>Chatting with: {availableUsers.find(u => u.id === selectedUserId)?.name || `User ${selectedUserId}`}</h4>
                </div>
            )}

            {/* Connection Status */}
            {chatChannel && (
                <div className="chat-info">
                    <small>Secure channel: {chatChannel}</small>
                </div>
            )}

            <div>
                <span className={`status-badge ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
                    {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </span>
            </div>

            {error && <div className="error-box"><strong>Error:</strong> {error}</div>}

            {/* Messages Area */}
            <div className="messages-box">
                <h3>Messages ({messages.length})</h3>
                {!selectedUserId ? (
                    <p className="no-messages">Select a user to start chatting</p>
                ) : messages.length === 0 ? (
                    <p className="no-messages">No messages yet. Start the conversation!</p>
                ) : (
                    <ul className="messages-list">
                        {messages.map((msg) => (
                            <li key={msg.id} className={`message-item ${msg.isOwn ? 'own-message' : 'other-message'}`}>
                                <div className="message-title">
                                    {msg.isOwn ? '➤' : '📨'} {msg.senderName}: {msg.message}
                                </div>
                                <div className="message-timestamp">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Input Area */}
            <div className="input-area">
                <input
                    type="text"
                    placeholder={!selectedUserId ? 'Select a user first...' : 'Type your message...'}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="message-input"
                    disabled={!selectedUserId}
                />
                <button
                    onClick={sendMessage}
                    className="button-primary"
                    disabled={!newMessage.trim() || !selectedUserId}
                >
                    Send
                </button>
                <button onClick={clearMessages} className="button-secondary">
                    Clear
                </button>
            </div>
        </div>
    );
};

export default HelpdeskChat;