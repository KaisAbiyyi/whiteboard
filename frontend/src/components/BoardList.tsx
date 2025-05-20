import { type FC, useState } from 'react';
import type { Board } from '../services/boardService';
import { deleteBoard, updateBoard } from '../services/boardService';
import { useNavigate } from 'react-router-dom';

type Props = {
    boards: Board[];
    onCreateBoard: () => void;
    onRefresh: () => void;
};

const BoardList: FC<Props> = ({ boards, onCreateBoard, onRefresh }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [nameInput, setNameInput] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleDelete = async (id: string) => {
        await deleteBoard(id);
        onRefresh();
    };

    const handleRename = async (id: string) => {
        if (nameInput.trim() && nameInput !== boards.find(b => b.id === id)?.name) {
            await updateBoard(id, nameInput.trim());
            onRefresh();
        }
        setEditingId(null);
    };

    return (
        <>
            <div className="row row-cols-2 row-cols-md-4 g-3">
                <div className="col">
                    <div
                        className="border rounded-4 d-flex border-3 bg-primary-subtle justify-content-center border-primary text-primary align-items-center"
                        style={{ height: '140px', cursor: 'pointer' }}
                        onClick={onCreateBoard}
                    >
                        <h1>
                            <i className="bi bi-plus"></i>
                        </h1>
                    </div>
                </div>

                {boards.map((board) => (
                    <div className="col" key={board.id}>
                        <div
                            className="border border-3 rounded-4 p-3 d-block text-decoration-none h-100"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                if (editingId !== board.id) {
                                    navigate(`/whiteboard?id=${board.id}`);
                                }
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                {editingId === board.id ? (
                                    <input
                                        style={{ zIndex: 20 }}
                                        autoFocus
                                        maxLength={50}
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        onBlur={() => handleRename(board.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRename(board.id);
                                            }
                                        }}
                                        className="form-control form-control-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <h6
                                        className="fw-bold mb-1"
                                        style={{ cursor: 'text' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingId(board.id);
                                            setNameInput(board.name);
                                        }}
                                    >
                                        {board.name}
                                    </h6>
                                )}
                                <button
                                    className="btn btn-danger rounded-pill btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteModal"
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPendingDeleteId(board.id)
                                    }}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>

                            </div>
                            <small className="text-muted">
                                {new Date(board.createdAt).toLocaleString()}
                            </small>
                        </div>
                    </div>
                ))}
            </div >
            <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Confirm Deletion</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setPendingDeleteId(null)}></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this board? This action cannot be undone.
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setPendingDeleteId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={async () => {
                                    if (pendingDeleteId) {
                                        await handleDelete(pendingDeleteId);
                                        setPendingDeleteId(null);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BoardList;
