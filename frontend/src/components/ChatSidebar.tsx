import { useEffect, useRef, useState } from 'react';
import { useChatMessages } from '../hooks/useChatMessages';
import keycloak from '../lib/keycloak';

type Props = {
    boardId: string;
};

const ChatSidebar = ({ boardId }: Props) => {
    const { messages, sendMessage } = useChatMessages(boardId);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const endRef = useRef<HTMLDivElement | null>(null);
    const currentUserId = keycloak.tokenParsed?.sub;

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input.trim());
        setInput('');
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen &&
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn bg-primary-subtle rounded-4 fw-semibold position-fixed  end-0 me-3"
                    style={{ top: "5rem", zIndex: 100 }}
                >
                    Chat
                </button>
            }

            {/* Chat Box */}
            {isOpen && (
                <div
                    className="position-fixed rounded-4 overflow-hidden end-0 bg-white border-start shadow-sm d-flex flex-column me-3"
                    style={{
                        width: '300px',
                        top: "5rem",
                        zIndex: 1050,
                        height: '500px'
                    }}
                >
                    <div className="d-flex border-bottom justify-content-between align-items-center p-3 fw-semibold bg-primary-subtle">
                        <h5>Live Chat</h5>
                        <button className='btn btn-primary fw-bold rounded-4 px-3' onClick={() => setIsOpen(false)}>
                            Close
                        </button>
                    </div>

                    <div className="flex-grow-1 overflow-auto px-3 py-2" style={{ fontSize: '0.9rem' }}>
                        {messages.map((msg, i) => {
                            const isMine = msg.senderId === currentUserId;
                            return (
                                <div
                                    key={i}
                                    className={`mb-2 d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'}`}
                                >
                                    <div
                                        className={`px-3 py-2 rounded-4 shadow-sm ${isMine ? 'bg-primary text-white' : 'bg-light'}`}
                                        style={{ maxWidth: '80%' }}
                                    >
                                        <div>{msg.content}</div>
                                        <div className="text-muted small mt-1 text-end" style={{ fontSize: '0.7rem' }}>
                                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={endRef} />
                    </div>

                    <div className="p-3 border-top">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control rounded-start-4"
                                placeholder="Type a message"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSend();
                                }}
                            />
                            <button className="btn btn-primary rounded-end-4" onClick={handleSend}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatSidebar;
