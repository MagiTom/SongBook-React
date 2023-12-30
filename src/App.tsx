import * as React from 'react';
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
import { useNavigate } from 'react-router-dom';
import Router from './components/router';
import { NavListItem } from './components/NavListItem/NavListItem';
import { SongItem, SongList } from './constans/songList';
import { useIndexedDbContext } from './context/IndexedDbContext';
import { useTransposeContext } from './context/TransposeContext';
import { initDB } from "react-indexed-db-hook";
import { useIndexedDB } from "react-indexed-db-hook";
import { DBConfig } from './lib/DBConfig';
import PrintToPdf from './components/PrintToPdf/PrintToPdf';
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import './App.css'
import { useSongListContext } from './context/SongListContext';
import AddSongDialog from './components/AddSongDialog/AddSongDialog';
import LoginDialog from './components/LoginDialog/LoginDialog';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import { ListItem } from '@mui/material';
import { useSongsDbContext } from './context/firebaseContext';
import { useErrorContext } from './context/ErrorContext';
import ErrorModal from './components/ErrorModal/ErrorModal';


initDB(DBConfig);
// Define separate themes for light and dark modes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#44803F',
      dark: '#146152',
    },
    secondary: {
      main: '#B4CF66',
    },
    error: {
      main: '#FF5A33'
    }
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    // Define your dark mode color palette here
  },
});


const drawerWidth = 240;
export type NavDraver = 'drawer1' | 'drawer2'

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open1?: boolean, open2?: boolean
}>(({ theme, open1, open2 }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: `${open1 ? drawerWidth : 0}px`,
  marginRight: `${open2 ? drawerWidth : 0}px`,
  transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
  open1?: boolean;
  open2?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open1, open2 }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(100% - ${open1 || open2 ? drawerWidth : open1 && open2 ? drawerWidth * 2 : 0}px)`,
  marginLeft: `${open1 ? drawerWidth : 0}px`,
  marginRight: `${open2 ? drawerWidth : 0}px`,
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
  const { addSong, removeSong, songItemList, allSongList } = useSongListContext();
  const [open1, setOpen1] = React.useState(true);
  const [open2, setOpen2] = React.useState(true);
  const [user, setUser] = useState<User | null>();
  const { getCategoriesDb } = useSongsDbContext();
  const { error, addError } = useErrorContext();
  const [currentMode, setCurrentMode] = React.useState<'light' | 'dark'>('light'); // Track the current mode
  const navigate = useNavigate();
  // const user = auth.currentUser;

  useEffect(() => {
    getCategoriesDb();
    }, [])

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      setUser(user);
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
      
          const uid = user.uid;
          // ...
          console.log("uid", uid)
        } else {
          // User is signed out
          // ...
          console.log("user is logged out")
        }
      });
     
}, [user])

    const handleDrawerOpen = (drawer: NavDraver) => {
      if (drawer === 'drawer1') {
        setOpen1(true);
        return;
      }
      setOpen2(true);
    };

    const handleDrawerClose = (drawer: NavDraver) => {
      if (drawer === 'drawer1') {
        setOpen1(false);
        return;
      }
      setOpen2(false);
    };

    const goToPage = (url: string) => {
      return navigate(url);
    };

    function handleAddSong(song: SongItem) {
      addSong(song);
    }

    function handleRemoveSong(song: SongItem) {
      removeSong(song)
    }

    const toggleMode = () => {
      setCurrentMode(currentMode === 'light' ? 'dark' : 'light');
    };

    return (
      <ThemeProvider theme={currentMode === 'light' ? lightTheme : darkTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={{
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
          <Typography className='drawerTitle' color={'primary'}>Spis piosenek</Typography>
            <IconButton onClick={() => handleDrawerClose('drawer1')}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {allSongList.map((song: SongItem) => (
              <NavListItem addToList={() => handleAddSong(song)} goToPage={() => goToPage(`/song/${song.id}`)} song={song} key={song.id}></NavListItem>
            ))}
          </List>
          <Divider />
          {/* <List className="footer">
            <ListItem>
            { user && <AddSongDialog></AddSongDialog> }
            </ListItem>
            <ListItem>
            <LoginDialog isLogin={!!user?.uid}></LoginDialog>
            </ListItem>
          </List> */}

          {error && <ErrorModal message={error}></ErrorModal>}

          <div className="footer">
          { user && <AddSongDialog></AddSongDialog> }
          <LoginDialog isLogin={!!user?.uid}></LoginDialog>
          </div>
        </Drawer>

        <AppBar position="fixed" open1={open1} open2={open2}>
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
            <Typography className='drawerTitle' onClick={() => goToPage('/')} variant="h6" sx={{ flexGrow: 2 }} noWrap component="div">
              Śpiewnik Uwielbieniowy
              <MusicNoteIcon></MusicNoteIcon>
            </Typography>
            <Typography color="secondary" className='drawerEmail' variant="h6" sx={{ flexGrow: 1 }} noWrap component="div">
              {user?.email}
            </Typography>
           
            <IconButton onClick={toggleMode}>{currentMode === 'light' ? <Brightness5Icon/> : <Brightness4Icon />}</IconButton>
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
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="right"
          open={open2}
        >
          <DrawerHeader>
            <Typography color={'primary'} className='drawerTitle'>Wybrane utwory</Typography>
            <IconButton onClick={() => handleDrawerClose('drawer2')}>
              {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {songItemList?.map(((song: SongItem) => (
              <NavListItem removeSong={() => handleRemoveSong(song)} goToPage={() => goToPage(`/song/${song.id}`)} song={song} key={song.id}></NavListItem>
            )))}
          </List>
          <Divider />
          <PrintToPdf songs={songItemList}></PrintToPdf>
        </Drawer>

        <Main open1={open1} open2={open2}>
          <DrawerHeader />
          <Router></Router>
        </Main>

      </Box>
      </ThemeProvider>
    );
  }

