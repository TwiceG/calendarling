import React, { useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import '../style/Chat.css';

window.Pusher = Pusher;

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [chatChannel, setChatChannel] = useState(null);

    // Set the helpdesk user ID (should match your helpdesk)
    const HELPDESK_USER_ID = 11;

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
                const res = await axios.get('https://calendarling-backend.fly.dev/api/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserId(res.data.user.id);
            } catch (err) {
                console.error('❌ Failed to get user data:', err);
                setError('Unauthorized – check token or login again');
            }
        };

        fetchUserData();
    }, []);

    // Load message history when component mounts
    useEffect(() => {
        if (!userId) return;

        const loadMessageHistory = async () => {
            const token = decryptToken();
            if (!token) return;

            try {
                const res = await axios.get(`https://calendarling-backend.fly.dev/api/messages/${HELPDESK_USER_ID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setMessages(res.data.messages || []);
            } catch (err) {
                console.error('❌ Failed to load message history:', err);
            }
        };

        loadMessageHistory();
    }, [userId]);

    // CONSISTENT CHANNEL NAMING FUNCTION
    const createChannelName = (user1Id, user2Id) => {
        // Always put the smaller ID first for consistency
        const sortedIds = [user1Id, user2Id].sort((a, b) => a - b);
        return `chat.${sortedIds[0]}-${sortedIds[1]}`;
    };

    useEffect(() => {
        if (!userId) return;

        const token = decryptToken();
        if (!token) return;

        // Use consistent channel naming
        const channelName = createChannelName(HELPDESK_USER_ID, userId);
        setChatChannel(channelName);

        console.log(`🔗 User connecting to channel: ${channelName}`);

        const echo = new Echo({
            broadcaster: 'reverb',
            key: 'some-random-key',
            wsHost: 'calendarling-websocket-server.fly.dev',
            wsPort: 443,
            wssPort: 443,
            forceTLS: true,
            encrypted: true,
            enabledTransports: ['ws', 'wss'],
            authEndpoint: 'https://calendarling-backend.fly.dev/api/broadcasting/auth',
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
            console.log('📨 User received event:', event);
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
        });

        channel.error((error) => {
            console.error('❌ Channel error:', error);
            setError(`Channel error: ${error.message || 'Unknown error'}`);
        });

        return () => {
            echo.disconnect();
        };
    }, [userId]);

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        const token = decryptToken();
        if (!token) {
            setError('Auth token missing or invalid');
            return;
        }

        try {
            const res = await axios.post(
                'https://calendarling-backend.fly.dev/api/send-message',
                {
                    message: newMessage.trim(),
                    receiver_id: HELPDESK_USER_ID, // Add receiver_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Message sent:', res.data);
            setNewMessage('');
        } catch (err) {
            console.error('❌ Send message error:', err.response || err);
            const msg = err.response?.data?.message || err.message;
            setError(`Send message error: ${msg}`);
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="websocket-container">
            <h2>Chat with Support</h2>

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

            <div className="messages-box">
                <h3>Messages ({messages.length})</h3>
                {messages.length === 0 ? (
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

            <div className="input-area">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="message-input"
                />
                <button onClick={sendMessage} className="button-primary" disabled={!newMessage.trim()}>
                    Send
                </button>
                <button onClick={clearMessages} className="button-secondary">
                    Clear
                </button>
            </div>
        </div>
    );
};

export default Chat;