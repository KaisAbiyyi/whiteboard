type CanvasHUDProps = {
    isSaving: boolean;
    isSaved: boolean;
};

const CanvasHUD = ({ isSaving, isSaved }: CanvasHUDProps) => {
    if (!isSaving && !isSaved) return null;

    const message = isSaving ? 'Saving...' : 'Saved';

    return (
        <div
            className="alert bg-primary-subtle position-fixed bottom-0 start-0 m-3 py-2 px-3 shadow-sm rounded-3 d-inline-block"
            style={{ zIndex: 999 }}
        >
            {message}
        </div>
    );
};

export default CanvasHUD;
