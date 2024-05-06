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

const Layout = () => {
  const { connectWallet, currentWallet, tonConnectUI, updateCurrentWallet, disconnectCurrentWallet } = useTonConnect();
  const [ anchorElNav, setAnchorElNav] = useState(null);
  const [ anchorElUser, setAnchorElUser] = useState(null);

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
        console.log("Disconnecting wallet")
        await disconnectCurrentWallet(tonConnectUI.wallet);
      } else {
        console.log("Connecting wallet", tonConnectUI.wallet)
        updateCurrentWallet(tonConnectUI.wallet);
        if (tonConnectUI.wallet == null) {
          connectWallet();
        }
      }
      
    } catch (error){
      connectWallet();
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
      <Outlet />
    </>
  );
}

export default Layout;
