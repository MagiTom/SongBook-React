import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Route, RouterProvider, Routes, createBrowserRouter, redirect, useNavigate, useNavigation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SongPage from './pages/SongPage/SongPage';
import Router from './components/router';
import { NavListItem } from './components/NavListItem/NavListItem';
import { SongList } from './constans/songList';


const drawerWidth = 240;
export type NavDraver = 'drawer1' | 'drawer2'

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open1, setOpen1] = React.useState(true);
  const [open2, setOpen2] = React.useState(true);
  const navigate = useNavigate();

  const handleDrawerOpen = (drawer: NavDraver) => {
    if(drawer === 'drawer1'){
      setOpen1(true);
      return
    }
    setOpen2(true)
  };

  const handleDrawerClose = (drawer: NavDraver) => {
    if(drawer === 'drawer1'){
      setOpen1(false);
      return
    }
    setOpen2(false)
  };

  const goToPage = (url: string) => {
    return navigate(url);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
  
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open1}
      >
        <DrawerHeader>
          <IconButton onClick={() => handleDrawerClose('drawer1')}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {SongList.map((song) => (
            <NavListItem goToPage={() => goToPage(`/song/${song.id}`)} text={song.title}  key={song.id} ></NavListItem>
          ))}
        </List>
        <Divider />
      </Drawer>

      <AppBar position="fixed" open={open1}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => handleDrawerOpen('drawer1')}
            edge="start"
            sx={{ mr: 2, ...(open1 && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography onClick={() => goToPage('/')} variant="h6" sx={{ flexGrow: 1 }} noWrap component="div">
            Persistent drawer
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => handleDrawerOpen('drawer2')}
            edge="end"
            sx={{ ml: 0, ...(open2 && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>


      <Drawer
        sx={{
     
          flexShrink: 0,
          '& .MuiDrawer-paper': {
      
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open2}
      >
        <DrawerHeader>
          <IconButton onClick={() => handleDrawerClose('drawer2')}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {SongList.map((song) => (
            <NavListItem goToPage={() => goToPage(`/song/${song.id}`)} text={song.title}  key={song.id} ></NavListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      
      <Main open={open1}>
        <DrawerHeader />
     <Router></Router>
      </Main>

    </Box>
  );
}

