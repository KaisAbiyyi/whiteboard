import { type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllBoardState } from '../services/boardService';

const ExportDropdown: FC = () => {
    const [params] = useSearchParams();
    const boardId = params.get('id');

    const handleExport = (type: 'image' | 'pdf') => {
        document.dispatchEvent(new CustomEvent('export-canvas', { detail: { type } }));
    };

    const handleReplay = async () => {
        if (!boardId) {
            alert('Board ID tidak ditemukan.');
            return;
        }

        try {
            const allState = await getAllBoardState(boardId);
            if (!allState) {
                alert('Tidak ada data yang bisa direplay.');
                return;
            }

            const strokes = allState.flatMap(entry =>
                Array.isArray(entry.data) ? entry.data : []
            );

            document.dispatchEvent(new CustomEvent('replay-canvas', { detail: { strokes } }));
        } catch (error) {
            console.error('Gagal memuat stroke untuk replay:', error);
        }
    };

    return (
        <div className="dropdown">
            <button
                className="btn bg-primary-subtle rounded-4 fw-semibold dropdown-toggle"
                type="button"
                id="exportDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Export"
            >
                Export
            </button>
            <ul className="dropdown-menu dropdown-menu-end mt-3 p-2 rounded-4 bg-primary-subtle" style={{ minWidth: '180px' }}>
                <li>
                    <button className="dropdown-item rounded-3" onClick={() => handleExport('image')}>
                        As Image
                    </button>
                </li>
                <li>
                    <button className="dropdown-item rounded-3" onClick={() => handleExport('pdf')}>
                        As PDF
                    </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                    <button className="dropdown-item rounded-3" onClick={handleReplay}>
                        Replay Drawing
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ExportDropdown;
