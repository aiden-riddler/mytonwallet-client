import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CustomAlert from './AlertDia';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
const baseServerUrl = process.env.REACT_APP_SERVER_URL;

function GiveawayDetails() {
    const [giveawayId, setGiveawayId]  = useState(null);
    const [giveaway, setGiveaway] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchGiveaway = async (e) => {
        e.preventDefault()
        setLoading(true);
        setError(null);
        if (giveawayId) {
            try {
                const response = await axios.get(`${baseServerUrl}/giveaways/${giveawayId}`);
                console.log("Response", response);
                setGiveaway(response.data);
            } catch (err) {
                setError('Failed to fetch giveaway details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        
    };

    return (
        <Card variant="outlined">
            <Box component="form" onSubmit={fetchGiveaway} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                        <h2>View GiveAway</h2>

                        <TextField
                            required
                            id="giveawayId"
                            variant="standard"
                            type="text" name="giveawayId" value={giveawayId} onChange={(e) => setGiveawayId(e.target.value)} label="Giveaway ID"
                        />
                        
                        <Button style={{ marginTop: '15px'}} type="submit" variant="contained" disabled={loading}>
                            GET DETAILS
                        </Button>
                    </Box>
            <CustomAlert message={error || success} severity={error ? 'error' : 'success'} />
            {giveaway ? (
                <CardContent>
                    <Typography variant="h5" component="div">
                        Giveaway Details
                    </Typography>
                    <Typography color="text.secondary">
                        ID: {giveaway.id}
                    </Typography>
                    <Typography color="text.secondary">
                        Type: {giveaway.type}
                    </Typography>
                    <Typography color="text.secondary">
                        Ends At: {giveaway.endsAt ? new Date(giveaway.endsAt).toLocaleString() : 'N/A'}
                    </Typography>
                    <Typography color="text.secondary">
                        Token Address: {giveaway.tokenAddress || 'Default (Toncoin)'}
                    </Typography>
                    <Typography color="text.secondary">
                        Amount per Receiver: {giveaway.amount}
                    </Typography>
                    <Typography color="text.secondary">
                        Number of Receivers: {giveaway.receiverCount}
                    </Typography>
                    <Typography color="text.secondary">
                        Task URL: {giveaway.taskUrl || 'No task required'}
                    </Typography>
                    <Typography color="text.secondary">
                        Status: {giveaway.status}
                    </Typography>
                    <Typography color="text.secondary">
                        Participants: {giveaway.participantCount}
                    </Typography>
                </CardContent>
            ) : (
                <Alert severity="info">No giveaway found.</Alert>
            )}
        </Card>
    );
}

export default GiveawayDetails;
