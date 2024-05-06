
import React, { useState } from 'react';
import axios from 'axios';
import CustomAlert from './AlertDia';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';

const baseServerUrl = process.env.REACT_APP_SERVER_URL;

function GiveAways() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        secret: '',
        type: 'instant', // default to 'instant', could also be 'lottery'
        endsAt: '',
        tokenAddress: '',
        amount: '',
        receiverCount: '',
        taskUrl: ''
    });
    const [res, setRes] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAuthenticate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            console.log("Base Url: ", baseServerUrl);
            const response = await axios.post(`${baseServerUrl}/partners/authenticate`, {
                name: formData.name,
                secret: formData.secret
            });
            setAuthToken(response.data.token);
            setSuccess('Authentication successful');
        } catch (error) {
            console.error('Authentication failed:', error);
            setError('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGiveaway = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            console.log("Authtoken", authToken);
            const response = await axios.post(`${baseServerUrl}/giveaways`, formData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setSuccess('Giveaway created successfully');
            console.log('Giveaway response:', response.data);
            setRes(response.data);
        } catch (error) {
            console.error('Failed to create giveaway:', error);
            setError('Failed to create giveaway');
        } finally {
            setLoading(false);
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

    return (
        <div className="App">
            <h1>Create Giveaway</h1>
            <CustomAlert message={error || success} severity={error ? 'error' : 'success'} />
            {res ?
                <>
                    <div>
                        Share giveaway link: 
                        <Link href={res.giveawayLink} underline="none">
                            {res.giveawayLink}
                        </Link>
                        <Button variant="text" onClick={() => copyToClipboard(res.giveawayLink)}>COPY</Button>
                    </div>

                    <div>
                        Use this link to top up:
                        <Link href={res.topUpLink} underline="none">
                            {res.topUpLink}
                        </Link>
                        <Button variant="text" onClick={() => copyToClipboard(res.topUpLink)}>COPY</Button>
                    </div>

                    {res.taskToken &&
                        <div>
                            Task token:
                            {res.taskToken}
                            <Button variant="text" onClick={() => copyToClipboard(res.taskToken)}>COPY</Button>
                        </div>}
                </>
                :
                !authToken ? (
                    <Box component="form" onSubmit={handleAuthenticate} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                        <h2>Authenticate</h2>

                        <TextField
                            required
                            id="name"
                            label="Name"
                            variant="standard"
                            type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name"
                        />
                        <br />
                        <TextField
                            required
                            id="secret"
                            label="Secret"
                            variant="standard"
                            type="password" name="secret" value={formData.secret} onChange={handleChange}
                        /><br />
                        <Button type="submit" variant="contained" disabled={loading}>
                            Authenticate
                        </Button>
                    </Box>

                ) : (
                    <Box component="form" onSubmit={handleCreateGiveaway} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                        <TextField
                            select
                            id="type"
                            label="Type"
                            variant="standard"
                            name="type" value={formData.type} onChange={handleChange}
                        >
                            <MenuItem key='instant' value='instant'>Instant</MenuItem>
                            <MenuItem key='lottery' value='lottery'>Lottery</MenuItem>

                        </TextField><br />

                        {formData.type === 'lottery' && (
                            <><TextField required variant="standard" type="datetime-local" name="endsAt" value={formData.endsAt} onChange={handleChange} /><br /></>
                        )}
                        <TextField variant="standard" type="text" name="tokenAddress" value={formData.tokenAddress} onChange={handleChange} label="Token Address" /><br />
                        <TextField required variant="standard" type="number" name="amount" value={formData.amount} onChange={handleChange} label="Amount (Nano)" /><br />
                        <TextField required variant="standard" type="number" name="receiverCount" value={formData.receiverCount} onChange={handleChange} label="Receiver Count" /><br />
                        <TextField variant="standard" type="text" name="taskUrl" value={formData.taskUrl} onChange={handleChange} label="Task URL (optional)" /><br />


                        <Button type="submit" variant="contained" disabled={loading}>
                            Create Giveaway
                        </Button>
                    </Box>
                )}
        </div>
    );
}

export default GiveAways;
