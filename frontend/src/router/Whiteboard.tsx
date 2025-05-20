import { useWhiteboardContext } from '../context/WhiteboardContext';
import WhiteboardCanvas from '../components/WhiteboardCanvas';
import { useSearchParams } from 'react-router-dom';
import { useWebSocketConnection } from '../hooks/useWebsocketconnection';
import ChatSidebar from '../components/ChatSidebar';

const Whiteboard = () => {
    const [params] = useSearchParams();
    const boardId = params.get('id') ?? 'default-board';
    const { addStroke } = useWhiteboardContext();
    const { status } = useWebSocketConnection(boardId, addStroke);

    return (
        <>
            {status === 'error' && (
                <div className="alert alert-danger position-fixed bottom-0 start-0 m-3 py-2 px-3 shadow-sm rounded-3 d-inline-block">
                    Connection Error
                </div>
            )}
            <ChatSidebar boardId={boardId} />
            <WhiteboardCanvas />
        </>
    );
};

export default Whiteboard;
