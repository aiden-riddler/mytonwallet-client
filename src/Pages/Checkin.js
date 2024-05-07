import React, { useState, useEffect } from 'react';
import { useTonConnect } from '../TonConnectContext';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import CustomAlert from './AlertDia';
import { Card, CardContent, Typography, Alert } from '@mui/material';
import Link from '@mui/material/Link';
import { useTonWallet, useTonAddress } from '@tonconnect/ui-react';

const siteKey = process.env.REACT_APP_SITE_KEY;
const baseServerUrl = process.env.REACT_APP_SERVER_URL;

const CheckinComponent = () => {
    const [giveawayId, setGiveawayId]  = useState(null);
    const [giveaway, setGiveaway] = useState(null);
    const currentWallet = useTonWallet();
    const { tonConnectUI } = useTonConnect();
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [res, setRes] = useState(null);

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
                    const response2 = await axios.post(`${baseServerUrl}/participant/${giveawayId}`,{
                        receiverAddress: userFriendlyAddress
                    });
                    console.log("partcipants" , response2.data.participant);
                    setRes(response2.data.participant)
                } catch (err) {
                    console.log("Error getting participant");
                }
                
            } catch (err) {
                setError('Failed to fetch giveaway details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

    };

    // Load reCAPTCHA
    const onReCAPTCHAChecked = async (token) => {
        setRecaptchaToken(token);
    };

    const handleCheckin = async () => {
        console.log("Current Wallet", currentWallet);
        // await tonConnectUI.openSingleWalletModal('mytonwallet');
        if (!tonConnectUI || !tonConnectUI.wallet) {
            setError('Please connect your wallet first');
            return;
        }

        // console.log("Wallet", wallet.name);

        try {
            const publicKey = currentWallet.account.publicKey;
            console.log("Tonconnect ui", tonConnectUI);
            const signedProof = '';
            if (currentWallet.connectItems?.tonProof && 'proof' in currentWallet.connectItems.tonProof)
            signedProof = currentWallet.connectItems.tonProof.proof;

            if (recaptchaToken) {
                const response2 = await axios.post(`${baseServerUrl}/participant/${giveawayId}`,{
                    receiverAddress: userFriendlyAddress
                });
                console.log("Res: ", response2.data);
                if(response2.data.ok) {
                    console.log("Response data: ", response2.data);
                    setRes(response2.data.participant);
                } else {
                    const response = await axios.post(`${baseServerUrl}/giveaways/${giveawayId}/checkin`, {
                        captchaToken: recaptchaToken,
                        receiverAddress: userFriendlyAddress,
                        publicKey: publicKey,
                        signedProof: signedProof,
                    });
    
                    if (response.data.ok) {
                        setSuccess('Successfully checked in!');
                        setRes(response.data.participant[0]);
                    } else {
                        console.log("Error: ", response.data.error);
                        setError('Failed to check in: ' + response.data.error);
                    }
                    setRecaptchaToken(null);
                }
            } else {
                setError("Please complete security check");
                setTimeout(() => {
                    setError(null);
                    setSuccess(null);
                }, 6000)
            }


        } catch (error) {
            setRecaptchaToken(null);
            console.error('Check-in error:', error);
            setError('Checking in failed. Check number of participants allowed');
        }
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

    const handleGetStatus = async () => {
        try {
            const response2 = await axios.post(`${baseServerUrl}/participant/${giveawayId}`,{
                receiverAddress: userFriendlyAddress
            });
            console.log("Res: ", response2.data);
            if(response2.data.ok) {
                console.log("Response data: ", response2.data);
                setRes(response2.data.participant);
            } 


        } catch (error) {
            console.error('Check-in error:', error);
            setError('Error checking in.');
        }
    }

    return (
        <div className='App'>
            <CustomAlert message={error || success} severity={error ? 'error' : 'success'} />
            <Box component="form" onSubmit={fetchGiveaway} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                        <h2>GiveAway Checkin</h2>

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
            </>
            :
                <>
                    {giveaway && giveaway.status == 'active' && <>
                    {userFriendlyAddress && <div>Address: {userFriendlyAddress}</div>}

                    <br />
                    <div style={{ margin: 'auto', width: '25%'}}>
                    <ReCAPTCHA
                        sitekey={siteKey}
                        onChange={onReCAPTCHAChecked}
                    />
                    </div>
                    
                    <br />
                    <Button variant="outlined" onClick={handleCheckin}>Check-in</Button>
                    </>}

                    {
                        giveaway && giveaway.status == 'finished' && 
                        <> 
                        <Button variant="outlined" onClick={handleGetStatus}>GET STATUS</Button>
                        </>
                    }
                </>
            }
        </div>
    );
};

export default CheckinComponent;
