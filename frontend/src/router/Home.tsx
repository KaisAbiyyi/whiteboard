import { useNavigate } from 'react-router-dom';
import BoardList from '../components/BoardList';
import { useBoards } from '../hooks/useBoards';
import { createBoard } from '../services/boardService';

const Home = () => {
  const { boards, loading, refresh } = useBoards();
  const navigate = useNavigate();

  const handleCreateBoard = async () => {
    try {
      const id = await createBoard('Untitled Board');
      navigate(`/whiteboard?id=${id}`);
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Your Boards</h1>
      {loading ? (
        <p>Loading boards...</p>
      ) : (
        <BoardList boards={boards} onCreateBoard={handleCreateBoard} onRefresh={refresh} />
      )}
    </div>
  );
};

export default Home;
