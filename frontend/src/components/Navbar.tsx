import { useRef, type FC } from 'react';
import { useLocation } from 'react-router-dom';
import keycloak from '../lib/keycloak';
import { useBoardMetadata } from '../hooks/useBoardMetadata';
import ShareModal from './ShareModal';
import ExportDropdown from './ExportDropdown';

const Navbar: FC = () => {
    const { boardName, tempName, setTempName, handleRename } = useBoardMetadata();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const isAuthenticated = keycloak.authenticated;
    const handleLogout = () => keycloak.logout({ redirectUri: window.location.origin });

    // Sync tempName saat dropdown dibuka
    const onDropdownShow = () => {
        setTempName(boardName);
    };

    // Pasang listener hanya sekali
    if (typeof window !== 'undefined') {
        const el = dropdownRef.current;
        if (el) {
            el.addEventListener('shown.bs.dropdown', onDropdownShow);
        }
    }

    return (
        <>
            <nav className="fixed-top m-3 justify-content-between d-flex align-items-center">
                <div className="d-flex align-items-center gap-3">
                    {location.pathname.startsWith("/whiteboard") && (
                        <>
                            <a href="/" className="btn bg-primary-subtle rounded-4" title="Home">
                                <i className="bi bi-house-door-fill"></i>
                            </a>

                            <div className="d-flex align-items-center gap-2">
                                <div className="dropdown" ref={dropdownRef}>
                                    <button
                                        className="fw-semibold px-3 py-1 border rounded-4 bg-primary-subtle dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {boardName || 'Untitled'}
                                    </button>
                                    <ul className="dropdown-menu mt-3 p-2 rounded-4 bg-primary-subtle" style={{ minWidth: '250px' }}>
                                        <li>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={tempName}
                                                maxLength={50}
                                                onChange={(e) => setTempName(e.target.value)}
                                                onBlur={handleRename}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleRename();
                                                }}
                                            />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="d-flex align-items-center gap-3">
                    {location.pathname.startsWith("/whiteboard") && <ExportDropdown />}
                    {location.pathname.startsWith("/whiteboard") && (
                        <>
                            <button
                                className="btn bg-primary-subtle rounded-4 fw-semibold"
                                title="Share"
                                data-bs-toggle="modal"
                                data-bs-target="#shareModal"
                            >
                                Share
                            </button>
                        </>
                    )}
                    {isAuthenticated && (
                        <button className="btn btn-danger rounded-4" title="Logout" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right"></i>
                        </button>
                    )}
                </div>
            </nav>
            <ShareModal />
        </>
    );
};

export default Navbar;
