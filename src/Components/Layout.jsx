import React, { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { Menu, MenuItem } from "@mui/material";

const drawerWidth = 240;
const navItems = [
  { text: "All products", link: "/", isAuth: false },
  { text: "My products", link: "/my-articles", isAuth: true },
  { text: "Profile", link: "/profile", isAuth: true },
];

const Layout = ({ children, window }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const currentNavItem = user ? navItems : navItems.filter((x) => !x.isAuth);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        GARMIN
      </Typography>
      <Divider />
      <List>
        {currentNavItem.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            component={Link}
            to={item.link}
            sx={{ color: "#000" }}
          >
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {user && (
          <ListItem disablePadding sx={{ color: "#000" }}>
            <ListItemButton onClick={handleLogout} sx={{ textAlign: "center" }}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
        {!user && (
          <ListItem
            disablePadding
            component={Link}
            to={"/login"}
            sx={{ color: "#000" }}
          >
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );
  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: "#000" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            GARMIN
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {currentNavItem.map((item) => (
              <Button
                key={item}
                sx={{
                  color: "#fff",
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": { backgroundColor: "#fff", color: "#000" },
                  marginRight: 2,
                }}
                component={Link}
                to={item.link}
              >
                {item.text}
              </Button>
            ))}
            {user && (
              <>
                <Button
                  sx={{
                    color: "#fff",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": { backgroundColor: "#fff", color: "#000" },
                  }}
                  onClick={handleMenuClick}
                >{`Hellow, ${user.name}`}</Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
            {!user && (
              <Button
                component={Link}
                to={"/login"}
                sx={{
                  color: "#fff",
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": { backgroundColor: "#fff", color: "#000" },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3, width: "100%" }}>
        <Toolbar />
        <Typography>{children}</Typography>
      </Box>
    </Box>
  );
};

export default Layout;
