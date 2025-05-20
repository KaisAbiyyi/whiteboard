import { useState, type FC } from 'react';

const ShareModal: FC = () => {
    const currentUrl = window.location.href;
    const [emails, setEmails] = useState<string[]>(['']);

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl)
            .then(() => alert('Link copied to clipboard!'))
            .catch(() => alert('Failed to copy link.'));
    };

    const handleAddEmail = () => {
        setEmails((prev) => [...prev, '']);
    };

    const handleChangeEmail = (index: number, value: string) => {
        const updated = [...emails];
        updated[index] = value;
        setEmails(updated);
    };

    const handleEmailInvite = () => {
        const filteredEmails = emails.map(e => e.trim()).filter(e => e);
        if (filteredEmails.length === 0) return alert('Please enter at least one email.');

        const to = filteredEmails.join(',');
        const subject = encodeURIComponent('Join my Whiteboard session');
        const body = encodeURIComponent(`Hi,\n\nI’d like to invite you to collaborate on this whiteboard:\n${currentUrl}\n\nSee you there!`);
        const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;
        window.open(mailtoLink, '_blank');
    };

    return (
        <div
            className="modal fade"
            id="shareModal"
            tabIndex={-1}
            aria-labelledby="shareModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4">
                    <div className="modal-header">
                        <h5 className="modal-title" id="shareModalLabel">Share Board Link</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                value={currentUrl}
                                readOnly
                            />
                            <button className="btn btn-outline-primary" type="button" onClick={handleCopy}>
                                Copy
                            </button>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Invite by Email</label>
                            {emails.map((email, i) => (
                                <input
                                    key={i}
                                    type="email"
                                    className="form-control mb-2"
                                    placeholder={`Email ${i + 1}`}
                                    value={email}
                                    onChange={(e) => handleChangeEmail(i, e.target.value)}
                                />
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm rounded-3"
                                onClick={handleAddEmail}
                            >
                                Add another email
                            </button>
                        </div>

                        <button
                            className="btn btn-primary w-100 rounded-3"
                            onClick={handleEmailInvite}
                        >
                            Send Invite via Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
