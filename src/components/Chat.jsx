import React, { useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';
import '../style/Chat.css';

window.Pusher = Pusher;

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const res = await axios.get('https://calendarling-backend.fly.dev/api/me', {
                    withCredentials: true,
                });
                setUserId(res.data.user.id);
            } catch (err) {
                setError('Failed to get user ID');
                console.error(err);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const echo = new Echo({
            broadcaster: 'reverb',
            key: 'some-random-key',
            wsHost: 'calendarling-websocket-server.fly.dev',
            wsPort: 443,
            wssPort: 443,
            forceTLS: true,
            encrypted: true,
            enabledTransports: ['ws', 'wss'],
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

        const channel = echo.private(`chat.${userId}`);
        channel.listen('.PrivateMessageSent', (event) => {
            console.log('📨 Received event:', event);
            setMessages((prev) => [
                ...prev,
                {
                    message: event.message,
                    senderName: event.sender_name,
                    timestamp: new Date().toISOString(),
                    id: Date.now(),
                },
            ]);
        });

        channel.error((error) => {
            console.error('Channel error:', error);
            setError(`Channel error: ${error.message}`);
        });

        return () => {
            echo.disconnect();
        };
    }, [userId]);

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const res = await axios.post('https://calendarling-backend.fly.dev/api/send-message', {
                message: newMessage.trim(),
            }, {
                withCredentials: true,
            });

            console.log('✅ Message sent:', res.data);
            setNewMessage('');
        } catch (err) {
            console.error('❌ Send message error:', err);
            setError(`Send message error: ${err.message}`);
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="websocket-container">
            <h2>Chat Interface</h2>

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
                            <li key={msg.id} className="message-item">
                                <div className="message-title">📨 {msg.senderName}: {msg.message}</div>
                                <div className="message-timestamp">
                                    {msg.timestamp && new Date(msg.timestamp).toLocaleString()}
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
