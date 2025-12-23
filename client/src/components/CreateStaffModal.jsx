import { useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';

export default function CreateStaffModal({ onClose, onCreated }) {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        designation: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            // Handle empty or non-JSON responses safely
            let data;
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const text = await res.text();
                data = text ? JSON.parse(text) : {};
            } else {
                data = {};
            }

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create staff. Please check if the server is running.');
            }

            onCreated();
        } catch (err) {
            // Provide more specific error messages
            if (err.message.includes('Unexpected end of JSON') || err.message.includes('Failed to fetch')) {
                setError('Unable to connect to server. Please ensure the backend is running.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Staff</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter staff name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Initial Password *</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter initial password"
                                required
                            />
                            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                                Staff will receive this password via email
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="designation">Designation / Role</label>
                            <input
                                type="text"
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                placeholder="e.g., Professor, Clerk, Technician"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Add Staff'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
