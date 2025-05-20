import { useEffect, useState } from 'react';
import type { Board } from '../services/boardService';
import { getBoards } from '../services/boardService';

export const useBoards = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        try {
            const data = await getBoards();
            setBoards(data);
        } catch (err) {
            console.error('Failed to fetch boards:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { boards, loading, refresh };
};