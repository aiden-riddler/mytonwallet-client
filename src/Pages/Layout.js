import { React, useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { useTonConnect } from '../TonConnectContext';
import { useTonWallet } from '@tonconnect/ui-react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import GiveAways from './Giveaways';
import GiveawayDetails from './Giveaway';
import CheckinComponent from './Checkin';
import CompleteTaskComponent from './CompleteTask';

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
}));

const Layout = () => {
  const currentWallet = useTonWallet();
  const { connectWallet, tonConnectUI, updateCurrentWallet, disconnectCurrentWallet } = useTonConnect();
  const [ anchorElNav, setAnchorElNav] = useState(null);
  const [ anchorElUser, setAnchorElUser] = useState(null);
  const [ panel, setPanel] = useState(0);
  const [ loading, setLoading ] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleConn = async () => {
    try {
      if (currentWallet){
        await disconnectCurrentWallet(tonConnectUI.wallet);
      } else {
        connectWallet();
      }
    } catch (error){
      console.log("An error occured. Try again later.");
    }
  }

  const pages = [
    { name: 'Create GiveAway', route: '/giveaways' }
  ]
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <FingerprintIcon fontSize='large' />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              MyTonWallet Giveaways
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <Link to={page.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Link to={page.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {page.name}
                  </Link>
                </Button>
              ))}

            </Box>
            <Button variant="text" color="inherit" onClick={handleConn}>
              {currentWallet ? 'Disconnect Wallet' : 'Connect Wallet'}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <div className='main-div'>
        <div className='first-panel'>
        <DemoPaper>
                        <Stack spacing={2}>
                            <Button variant='text' onClick={() => setPanel(0)} disabled={loading}>Create Giveaway</Button>
                            <Button variant='text' onClick={() => setPanel(1)} disabled={loading}>View Giveaway</Button>
                            <Button variant='text' onClick={() => setPanel(2)} disabled={loading}>Giveaway Checkin</Button>
                            <Button variant='text' onClick={() => setPanel(3)} disabled={loading}>Complete Giveaway Task</Button>
                        </Stack>
                    </DemoPaper>
          </div>
          <div className='second-panel'>
          <DemoPaper>
            { panel === 0 && <GiveAways />}
            { panel === 1 && <GiveawayDetails />}
            { panel === 2 && <CheckinComponent />}
            { panel === 3 && <CompleteTaskComponent />}

                    </DemoPaper>
          </div>
      </div>
    </>
  );
}

export default Layout;
