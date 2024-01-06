import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
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
import { User, onAuthStateChanged } from "firebase/auth";
import * as React from "react";
import { useEffect, useState } from "react";
import { initDB } from "react-indexed-db-hook";
import { useNavigate } from "react-router-dom";
import "./App.css";
import AddSongDialog from "./components/AddSongDialog/AddSongDialog";
import ErrorModal from "./components/ErrorModal/ErrorModal";
import LoginDialog from "./components/LoginDialog/LoginDialog";
import { NavListItem } from "./components/NavListItem/NavListItem";
import PrintToPdf from "./components/PrintToPdf/PrintToPdf";
import Router from "./components/router";
import { SongItem, SongPageItem } from "./constans/songList";
import { useErrorContext } from "./context/ErrorContext";
import { useSongListContext } from "./context/SongListContext";
import { useSongsDbContext } from "./context/firebaseContext";
import { auth } from "./firebase-config";
import { DBConfig } from "./lib/DBConfig";
import { ListItem, useMediaQuery } from "@mui/material";
import { SongListLeft } from "./models/SongListLeft.model";
import { SongListRight } from "./models/SongListRight.model";

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
    addSong,
    removeSong,
    songItemList,
    allSongList,
    setSelectedIndex,
    selectedIndex,
  } = useSongListContext();
  const [open1, setOpen1] = React.useState(true);
  const [open2, setOpen2] = React.useState(true);
  const [user, setUser] = useState<User | null>();
  const { getCategoriesDb } = useSongsDbContext();
  const {
    updateSongLists,
    getSongListAdmin,
    addSongRight,
    removeSongRight,
    updateSongAdmin,
  } = useSongListContext();
  const { error } = useErrorContext();
  const [currentMode, setCurrentMode] = React.useState<ModeType>("light"); // Track the current mode
  const navigate = useNavigate();
  const matches = useMediaQuery("(max-width: 480px)");

  console.log("songItemList", songItemList);

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
  }, [user]);

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
    removeSongRight(song)
  }

  const toggleMode = () => {
    const mode = currentMode === "light" ? "dark" : "light";
    setCurrentMode(mode);
    localStorage.setItem("currentMode", mode);
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
          <List>
            {allSongList.map((song: SongItem) => (
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
                {user && <AddSongDialog></AddSongDialog>}
                <LoginDialog isLogin={!!user?.uid}></LoginDialog>
              </div>
            </ListItem>
          </List>
          {error && <ErrorModal message={error}></ErrorModal>}
        </Drawer>

        <AppBar position="fixed" open1={open1} open2={open2}>
          <Toolbar>
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
          <List>
            {songItemList?.map((song: SongListRight) => (
              <NavListItem
                selected={selectedIndex === song.id}
                removeSong={() => handleRemoveSong(song)}
                goToPage={() => goToPage(!user ? song.id : song?.id || "")}
                song={song}
                key={song.id}
              ></NavListItem>
            ))}
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
