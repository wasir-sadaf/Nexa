import React, { useState } from 'react';
import axios from 'axios';

const NewTicketForm = ({ onTicketCreated }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the page from reloading
        setStatusMessage('Submitting...');

        // Grab the logged-in user's ID that we saved earlier
        const currentUserId = localStorage.getItem('userId');

        if (!currentUserId) {
            setStatusMessage("Error: You must be logged in to create a ticket.");
            return;
        }

        const newTicketData = {
            customerId: currentUserId,
            subject: subject,
            description: description
        };

        try {
            // Send the data to your Spring Boot @PostMapping
            await axios.post('http://localhost:8080/api/tickets', newTicketData);

            setStatusMessage('✅ Ticket created successfully!');
            setSubject(''); // Clear the form
            setDescription('');

            // Tell the parent page to refresh the table
            if (onTicketCreated) onTicketCreated();

        } catch (error) {
            console.error(error);
            setStatusMessage('❌ Failed to create ticket.');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #333', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>Create a New Support Ticket</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <input
                    type="text"
                    placeholder="Ticket Subject (e.g., Internet is down)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    style={{ padding: '8px', background: '#222', color: 'white', border: '1px solid #444' }}
                />

                <textarea
                    placeholder="Describe your issue in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows="4"
                    style={{ padding: '8px', background: '#222', color: 'white', border: '1px solid #444' }}
                />

                <button type="submit" style={{ padding: '10px', background: 'white', color: 'black', cursor: 'pointer', fontWeight: 'bold' }}>
                    Submit Ticket
                </button>

                {statusMessage && <p style={{ fontSize: '14px', marginTop: '10px' }}>{statusMessage}</p>}
            </form>
        </div>
    );
};

export default NewTicketForm;