import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTonConnect } from '../TonConnectContext'; 
import { useParams } from 'react-router-dom';
import CustomAlert from './AlertDia';
import { Button, TextField, Box, Typography } from '@mui/material';
import { Card, CardContent, Alert } from '@mui/material';
import Link from '@mui/material/Link';

const baseServerUrl = process.env.REACT_APP_SERVER_URL;

const CompleteTaskComponent = () => {
    const [giveawayId, setGiveawayId]  = useState(null);
    const { tonConnectUI } = useTonConnect();
    const [taskToken, setTaskToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [res, setRes] = useState(null);
    const [giveaway, setGiveaway] = useState(null);

    const fetchGiveaway = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (giveawayId) {
            try {
                const response = await axios.get(`${baseServerUrl}/giveaways/${giveawayId}`);
                setGiveaway(response.data);

                // get participant
                try {
                    if (tonConnectUI && tonConnectUI.wallet){
                        const address = tonConnectUI.account.address;
                        const response2 = await axios.post(`${baseServerUrl}/participant/${giveawayId}`,{
                            receiverAddress: address
                        });
                        if (response2.data.participant == 'awaitingPayment' || response2.data.participant == 'paid'){
                            setRes(response2.data.participant);
                        }
                    }
                } catch (err) {
                    console.log("Error getting wallet");
                }
                
            } catch (err) {
                setError('Failed to fetch giveaway details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

    };

    const handleCompleteTask = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (!tonConnectUI || !tonConnectUI.wallet) {
                setError('Please connect your wallet first');
                return;
            }

            const address = tonConnectUI.account.address;
            const response = await axios.post(`${baseServerUrl}/giveaways/${giveawayId}/complete-task`, {
                taskToken: taskToken,
                receiverAddress: address
            });

            if (response.data.ok) {
                const response2 = await axios.post(`${baseServerUrl}/participant/${giveawayId}`,{
                    receiverAddress: address
                });
                setRes(response2.data.participant)
                setSuccess("Task Complete Successfully");
                setError(null);
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            setError('Failed to complete the task. Please try again.');
            console.error('Complete task error:', error);
        }

        setLoading(false);
    };

    const copyToClipboard = async(linkToCopy) => {
        try {
            await navigator.clipboard.writeText(linkToCopy);
            setSuccess("Copied");
            
            setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 3000);
          } catch (err) {
            console.error('Failed to copy:', err);
            setError("Failed to copy to clipboard");
            setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 4000);
          }
    }
    return (
        <div className="App">
            <Box component="form" onSubmit={fetchGiveaway} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                        <h2>Complete Giveaway Task</h2>

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
            <Card variant="outlined">
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
                                    Task URL: {giveaway.taskUrl ? 
                                    <>
                                    <Link href={giveaway.taskUrl} underline="none">
                            {giveaway.taskUrl}
                        </Link>
                        <Button variant="text" onClick={() => copyToClipboard(giveaway.taskUrl)}>COPY</Button>
                                    </> : 'No task required'}
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
            {res ? 
            <>
                <h3>Participation status</h3>
                <div>Receiver Address: {res.receiverAddress}</div>
                <div>Status: {res.status}</div>
            </> : 
            giveaway && giveaway.status == 'active' && <>
            <Box p={2}>
                <CustomAlert message={error || success} severity={error ? 'error' : 'success'} />
                <Typography variant="h6">Complete Task</Typography>

                <TextField
                    variant="standard"
                    label="Task Token"
                    value={taskToken}
                    onChange={(e) => setTaskToken(e.target.value)}
                    margin="normal"
                /><br/>

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCompleteTask}
                    disabled={loading}
                >
                    Complete Task
                </Button>
            </Box>
            </>}
        </div>

    );
};

export default CompleteTaskComponent;
