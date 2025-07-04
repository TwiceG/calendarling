import React, { useState } from 'react';
import '../style/Chatbot.css'

const DanteChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                            src="https://app.dante-ai.com/embed/?kb_id=0310a8da-adea-4f2f-87c6-34ea8249c7e4&token=788e6777-4963-4424-971f-32a189857730&modeltype=gpt-4-omnimodel-mini&tabs=false"
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
