import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getBoardById, updateBoard } from '../services/boardService';

export const useBoardMetadata = () => {
  const location = useLocation();
  const [boardName, setBoardName] = useState('');
  const [tempName, setTempName] = useState('');

  const boardId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    const fetchBoard = async () => {
      if (!location.pathname.startsWith('/whiteboard') || !boardId) return;

      try {
        const res = await getBoardById(boardId);
        if (res.name) setBoardName(res.name);
      } catch (err) {
        console.error('[BoardMetadata] Failed to fetch board:', err);
      }
    };

    fetchBoard();
  }, [location, boardId]);

  const handleRename = async () => {
    if (!boardId || tempName.trim() === '' || tempName === boardName) return;

    try {
      await updateBoard(boardId, tempName.trim());
      setBoardName(tempName.trim());
    } catch (err) {
      console.error('[BoardMetadata] Failed to rename board:', err);
    }
  };

  return {
    boardName,
    tempName,
    setTempName,
    handleRename
  };
};
