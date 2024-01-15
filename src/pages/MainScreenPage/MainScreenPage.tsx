import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Button, LinearProgress, ListItem, useMediaQuery } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import {
  ThemeProvider,
  createTheme,
  styled,
  useTheme,
} from "@mui/material/styles";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import * as React from "react";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { initDB } from "react-indexed-db-hook";
import { Outlet, useNavigate } from "react-router-dom";
import AddSongDialog from "../../components/AddSongDialog/AddSongDialog";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import { NavItemDrag } from "../../components/NavItemDrag/NavItemDrag";
import { NavListItem } from "../../components/NavListItem/NavListItem";
import PrintToPdf from "../../components/PrintToPdf/PrintToPdf";
import { useErrorContext } from "../../context/ErrorContext";
import { useSongListContext } from "../../context/SongListContext";
import { useSongsDbContext } from "../../context/firebaseContext";
import { auth } from "../../firebase-config";
import { DBConfig } from "../../lib/DBConfig";
import { SongListLeft } from "../../models/SongListLeft.model";
import { SongListRight } from "../../models/SongListRight.model";
import "./style.scss";

type ModeType = "light" | "dark";

initDB(DBConfig);
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#44803F",
      dark: "#146152",
    },
    secondary: {
      main: "#B4CF66",
    },
    error: {
      main: "#FF5A33",
    },
  },
  typography: {
    allVariants: {
      fontFamily: "Raleway, Arial",
      lineHeight: 1,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const drawerWidth = 240;
export type NavDraver = "drawer1" | "drawer2";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open1?: boolean;
  open2?: boolean;
}>(({ theme, open1, open2 }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: `${open1 ? drawerWidth : 0}px`,
  marginRight: `${open2 ? drawerWidth : 0}px`,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open1?: boolean;
  open2?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open1, open2 }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(100% - ${
    open1 || open2 ? drawerWidth : open1 && open2 ? drawerWidth * 2 : 0
  }px)`,
  marginLeft: `${open1 ? drawerWidth : 0}px`,
  marginRight: `${open2 ? drawerWidth : 0}px`,
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const {
    setSelectedIndex,
    selectedIndex,
  } = useSongListContext();
  const [open1, setOpen1] = useState<boolean>(true);
  const [open2, setOpen2] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>();
  const { getCategoriesDb, loading } = useSongsDbContext();
  const {
    getSongListAdmin,
    addSongRight,
    removeSongRight,
    songListLeft,
    songListRight,
    updateChoosenSongList,
  } = useSongListContext();
  const { error } = useErrorContext();
  const [currentMode, setCurrentMode] = React.useState<ModeType>("light"); // Track the current mode
  const navigate = useNavigate();
  const matches = useMediaQuery("(max-width: 480px)");

  useEffect(() => {
    const mode: ModeType = localStorage.getItem("currentMode") as ModeType;
    if (matches) {
      setOpen1(false);
      setOpen2(false);
    }
    setCurrentMode(mode || "light");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      getSongListAdmin();
      getCategoriesDb();
    });
  }, [user, getCategoriesDb, getSongListAdmin]);

  const handleDrawerOpen = (drawer: NavDraver) => {
    if (drawer === "drawer1") {
      setOpen1(true);
      return;
    }
    setOpen2(true);
  };

  const handleDrawerClose = (drawer: NavDraver) => {
    if (drawer === "drawer1") {
      setOpen1(false);
      return;
    }
    setOpen2(false);
  };

  const goToPage = (id: string) => {
    setSelectedIndex(id);
    const url = id ? `/song/${id}` : "/";
    return navigate(url);
  };

  function handleAddSong(song: SongListLeft) {
    addSongRight(song);
  }

  function handleRemoveSong(song: SongListRight) {
    removeSongRight(song);
  }

  const toggleMode = () => {
    const mode = currentMode === "light" ? "dark" : "light";
    setCurrentMode(mode);
    localStorage.setItem("currentMode", mode);
  };
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch(() => {
        // An error happened.
      });
  };
  const moveSong = (fromIndex: any, toIndex: any) => {
    updateChoosenSongList(fromIndex, toIndex);
  };

  return (
    <ThemeProvider theme={currentMode === "light" ? lightTheme : darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open1}
        >
          <DrawerHeader>
            <Typography className="drawerTitle" color={"primary"}>
              Spis piosenek
            </Typography>
            <IconButton onClick={() => handleDrawerClose("drawer1")}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List sx={{pt: 0.1}}>
            {songListLeft
              .sort(function (a: SongListLeft, b: SongListLeft) {
                if (a.title < b.title) {
                  return -1;
                }
                if (a.title > b.title) {
                  return 1;
                }
                return 0;
              })
              .map((song: SongListLeft) => (
                <NavListItem
                  selected={selectedIndex === song.id}
                  addToList={() => handleAddSong(song)}
                  goToPage={() => goToPage(song.id)}
                  song={song}
                  key={song.id}
                ></NavListItem>
              ))}
          </List>
          <Divider />

          <List
            style={{
              bottom: 0,
              position: "fixed",
              background: currentMode === "dark" ? "#121212" : "white",
            }}
          >
            <ListItem>
              <div className="footer">
                {user && <AddSongDialog semitones={0}></AddSongDialog>}
                <Button variant="outlined" onClick={handleLogOut}>
                  wyloguj
                </Button>
              </div>
            </ListItem>
          </List>
          {error && <ErrorModal message={error}></ErrorModal>}
        </Drawer>

        <AppBar position="fixed" open1={open1} open2={open2}>
          <Toolbar sx={{cursor: 'pointer'}}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => handleDrawerOpen("drawer1")}
              edge="start"
              sx={{ mr: 2, ...(open1 && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className="drawerTitle"
              onClick={() => goToPage("")}
              variant="h6"
              sx={{ flexGrow: 2 }}
              noWrap
              component="div"
            >
              Śpiewnik
              <MusicNoteIcon></MusicNoteIcon>
            </Typography>
            <Typography
              color="secondary"
              className="drawerEmail"
              variant="h6"
              sx={{ flexGrow: 1 }}
              noWrap
              component="div"
            >
              {user?.email}
            </Typography>

            <IconButton onClick={toggleMode}>
              {currentMode === "light" ? (
                <Brightness5Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => handleDrawerOpen("drawer2")}
              edge="end"
              sx={{ ml: 0, ...(open2 && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
          {loading && <LinearProgress color="success" />}
        </AppBar>

        <Drawer
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="right"
          open={open2}
        >
          <DrawerHeader>
            <Typography color={"primary"} className="drawerTitle">
              Wybrane utwory
            </Typography>
            <IconButton onClick={() => handleDrawerClose("drawer2")}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <DndProvider backend={HTML5Backend}>
            <List sx={{pt: 0.1}}>
              {songListRight?.map((song: SongListRight, index: number) => (
                <NavItemDrag
                  key={song.id}
                  goToPage={() => goToPage(!user ? song.id : song?.id || "")}
                  song={song}
                  selected={selectedIndex === song.id}
                  removeSong={() => handleRemoveSong(song)}
                  index={index}
                  moveSong={moveSong}
                />
              ))}
            </List>
          </DndProvider>
          <Divider />
          <PrintToPdf songs={songListRight}></PrintToPdf>
        </Drawer>

        <Main open1={open1} open2={open2}>
          <DrawerHeader />
          <Outlet />
        </Main>
      </Box>
    </ThemeProvider>
  );
}
