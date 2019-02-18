import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const darkTheme = {
    typography: {
        useNextVariants: true
    },
    palette: {
        type: 'dark',
        primary: {
            main: "#2f5b79"
        },
        secondary: {
            main: '#6ffff0'
        }
    }
};

function applyTheme(WrappedComponent) {
    function ApplyTheme(props) {
        return (
            <MuiThemeProvider
                theme={ createMuiTheme(darkTheme) }>
                <CssBaseline />
                <WrappedComponent {...props } />
            </MuiThemeProvider>
        );
    }
    return ApplyTheme;
}

export default applyTheme;