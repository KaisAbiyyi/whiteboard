import { createContext, useContext } from 'react';

export const WhiteboardContext = createContext<ReturnType<typeof import('../hooks/useWhiteboardState').useWhiteboardState> | null>(null);

export const useWhiteboardContext = () => {
    const ctx = useContext(WhiteboardContext);
    if (!ctx) throw new Error('WhiteboardContext not found. Must be used inside <WhiteboardContext.Provider>');
    return ctx;
};
