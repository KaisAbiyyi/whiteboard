import { useEffect } from 'react';
import keycloak from '../lib/keycloak';
import { getBoardState } from '../services/boardService';
import type { Stroke } from '../types/whiteboard';
import { onSyncReceived } from '../lib/ws';

type Params = {
    boardId: string;
    setStrokes: (strokes: Stroke[]) => void;
};

export const useSyncBoard = ({ boardId, setStrokes }: Params) => {
    useEffect(() => {
        const loadInitialState = async () => {
            const strokes = await getBoardState(boardId);
            if (strokes && Array.isArray(strokes)) {
                setStrokes(strokes);
            }
        };

        loadInitialState();
    }, [boardId, setStrokes]);

    useEffect(() => {
        onSyncReceived((from, payload) => {
            if (from === keycloak.tokenParsed?.sub) return;
            setStrokes(payload);
        });
    }, [setStrokes]);
};
