import { createTheme } from "@mui/material/styles";

// Defines shared colors, typography, and component styling.
export const theme = createTheme({
    palette: {
        primary: { main: "#153E52" },
        secondary: { main: "#087F8C" },
        background: { default: "#F4F7FA", paper: "#FFFFFF" },
        text: { primary: "#183342", secondary: "#607582" }
    },
    typography: {
        fontFamily: '"Segoe UI", Arial, sans-serif',
        h4: { fontWeight: 750 },
        h5: { fontWeight: 700 },
        button: { textTransform: "none", fontWeight: 600 }
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 10, padding: "10px 20px" }
            }
        },
        MuiTextField: {
            defaultProps: { fullWidth: true, variant: "outlined" }
        },
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: { border: "1px solid #E2EAF0" }
            }
        }
    }
});