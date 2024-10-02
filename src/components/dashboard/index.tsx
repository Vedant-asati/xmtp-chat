import { Box, Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");

  return (
    <Stack direction="row" sx={{ height: '100vh', width: '100%' }}>
      {/* Sidebar should take up fixed width on desktop */}
      {isDesktop && (
        <Box>
          <SideNav />
        </Box>
      )}
      {/* Main content area, will take remaining space */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default DashboardLayout;
