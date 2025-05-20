import type { FC } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useWhiteboardState } from '../hooks/useWhiteboardState';
import { WhiteboardContext } from '../context/WhiteboardContext';
import Navbar from './Navbar';
import Toolbar from './Toolbar';

const Layout: FC = () => {
  const location = useLocation();
  const isWhiteboard = location.pathname === '/whiteboard';

  const [searchParams] = useSearchParams();
  const boardId = searchParams.get('id') ?? 'default-board';

  const whiteboard = useWhiteboardState(boardId);

  return (
    <>
      <Navbar />
      {isWhiteboard ? (
        <WhiteboardContext.Provider value={whiteboard}>
          <Toolbar />
          <main className="vh-100">
            <Outlet />
          </main>
        </WhiteboardContext.Provider>
      ) : (
        <main className="vh-100">
          <Outlet />
        </main>
      )}
    </>
  );
};

export default Layout;
