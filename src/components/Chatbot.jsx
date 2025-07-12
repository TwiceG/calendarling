import React, { useState } from 'react';
import '../style/Chatbot.css'

const DanteChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const chatbotURL = import.meta.env.VITE_CHAT_BOT_URL;

    return (
        <>
            {/* Floating Button */}
            <button className="chat-fab" onClick={() => setIsOpen(true)}>
                💬
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="chat-modal" onClick={() => setIsOpen(false)}>
                    <div className="chat-content" onClick={(e) => e.stopPropagation()}>
                        <button className="chat-close" onClick={() => setIsOpen(false)}>
                            &times;
                        </button>
                        <iframe
                            src={chatbotURL}
                            allow="clipboard-write; clipboard-read; *;microphone *"
                            title="Dante AI"
                            className="chatbot-iframe"
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
};

export default DanteChatbot;
