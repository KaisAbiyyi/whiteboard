import { useState, type FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useWhiteboardContext } from '../context/WhiteboardContext';
import { useZoomAndPan } from '../hooks/useZoomAndPan';

const Toolbar: FC = () => {
    const [editingSize, setEditingSize] = useState(false);

    const location = useLocation();
    const isWhiteboard = location.pathname === '/whiteboard';
    const whiteboard = isWhiteboard ? useWhiteboardContext() : null;

    if (!isWhiteboard || !whiteboard) return null;
    const {
        zoomIn, zoomOut, resetZoom, scalePercentage,
        isZoomInDisabled, isZoomOutDisabled
    } = useZoomAndPan({
        scale: whiteboard.scale,
        setScale: whiteboard.setScale,
        position: whiteboard.position,
        setPosition: whiteboard.setPosition
    });
    const [tempSize, setTempSize] = useState(whiteboard.strokeWidth);
    const handleStrokeSizeChange = (value: number) => {
        const clamped = Math.min(20, Math.max(1, value));
        whiteboard.setStrokeWidth(clamped);
    };

    return (
        <>
            <div className="d-flex m-auto fixed-bottom align-items-center mb-3 gap-4" style={{ width: "fit-content" }}>
                <div className="h-100 px-2 py-2 btn-group rounded-4 bg-primary-subtle shadow-sm border" role='group' aria-label='Control Group'>
                    <button
                        className="border-0 bg-transparent hover:bg-primary px-2 py-1 fs-5"
                        onClick={whiteboard.undo}
                        title='Undo'
                        disabled={whiteboard.strokes.length === 0}
                    >
                        <i className="bi bi-arrow-counterclockwise"></i>
                    </button>

                    <button
                        className="border-0 bg-transparent hover:bg-primary px-2 py-1 fs-5"
                        onClick={whiteboard.redo}
                        title='Redo'
                        disabled={whiteboard.redoStack.length === 0}
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                </div>
                <div className="p-2 rounded-4 shadow-sm bg-primary-subtle border d-flex align-items-center gap-3 " style={{ width: 'fit-content' }}>
                    <label className="form-label mb-0 d-flex align-items-center gap-2">
                        <input title='Color' type="color" value={whiteboard.color} onChange={(e) => whiteboard.setColor(e.target.value)} className="form-control form-control-color bg-transparent" style={{ width: '2.5rem', height: '2rem' }} />
                    </label>

                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="border-0 bg-transparent fs-4"
                            onClick={() => handleStrokeSizeChange(whiteboard.strokeWidth - 1)}
                            disabled={whiteboard.strokeWidth <= 1}
                            title="Decrease"
                        >
                            <i className="bi bi-dash"></i>
                        </button>

                        {editingSize ? (
                            <input
                                type="number"
                                className="form-control form-control-sm text-center"
                                style={{ width: '50px' }}
                                value={tempSize}
                                min={1}
                                max={20}
                                autoFocus
                                onChange={(e) => setTempSize(Number(e.target.value))}
                                onBlur={() => {
                                    handleStrokeSizeChange(tempSize);
                                    setEditingSize(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleStrokeSizeChange(tempSize);
                                        setEditingSize(false);
                                    }
                                }}
                            />
                        ) : (
                            <span
                                role="button"
                                title="Click to edit"
                                className="px-2 fw-semibold border rounded"
                                style={{ minWidth: '40px', textAlign: 'center' }}
                                onClick={() => {
                                    setTempSize(whiteboard.strokeWidth);
                                    setEditingSize(true);
                                }}
                            >
                                {whiteboard.strokeWidth}
                            </span>
                        )}

                        <button
                            className="border-0 bg-transparent fs-4"
                            onClick={() => handleStrokeSizeChange(whiteboard.strokeWidth + 1)}
                            disabled={whiteboard.strokeWidth >= 20}
                            title="Increase"
                        >
                            <i className="bi bi-plus"></i>
                        </button>
                    </div>


                    <button type="button" className="btn btn-danger rounded-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Clear Canvas
                    </button>


                </div>
                <div className="d-flex align-items-center rounded-4 bg-primary-subtle rounded-4 px-3 py-2 gap-3 border position-fixed bottom-0 end-0 mb-3 me-3" style={{ width:"fit-content" }}>
                    <button className="btn btn-sm" onClick={zoomOut} disabled={isZoomOutDisabled}>
                        <i className="bi bi-dash-lg"></i>
                    </button>
                    <span className="fw-semibold" role='button' onClick={resetZoom}>{scalePercentage}%</span>
                    <button className="btn btn-sm" onClick={zoomIn} disabled={isZoomInDisabled}>
                        <i className="bi bi-plus-lg"></i>
                    </button>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex={1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Clear Canvas</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>This will clear the whole canvas. This action cannot be undone. Are you sure? </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-primary rounded-4" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger rounded-4" onClick={whiteboard.clear} data-bs-dismiss="modal">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Toolbar;
