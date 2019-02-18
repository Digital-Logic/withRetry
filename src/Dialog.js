import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Progress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { LOADING_STATES, CountDownTimer } from './lib/withRetry';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';


const styles = theme => ({
    root: {
        minWidth: '200px',
        maxWidth: '400px'
    },
    counter: {
        fontSize: '2.5em',
        fontWeight: 400,
        margin: '5px'
    }
});

function DownloadDialog({ open, onClose, onCancel, state, classes, cancelable, closeable, errorMessage }) {

    const actionButtons = (
        <ActionButtons
            state={state}
            onClose={onClose}
            onCancel={onCancel}
            cancelable={cancelable}
            closeable={closeable}
        />
    );

    const states = {
        [LOADING_STATES.LOADING]: (
            <Fragment>
                <DialogTitle align="center">Sending Data</DialogTitle>
                <DialogContent>
                    <Grid container justify="center">
                        <Progress color="secondary" size={60} thickness={3}/>
                    </Grid>
                </DialogContent>
               { actionButtons }
            </Fragment>
        ),
        [LOADING_STATES.SUCCESS]: (
            <Fragment>
                <DialogTitle align="center">Success</DialogTitle>
                <DialogContent>
                    <Grid container justify="center">
                        <Typography>Data has been sent</Typography>
                    </Grid>
                </DialogContent>
                { actionButtons }
            </Fragment>
        ),
        [LOADING_STATES.RETRY]: (
            <Fragment>
                <DialogTitle align="center">Error Sending Data</DialogTitle>
                <CountDownTimer>
                {   (count) => (
                        <DialogContent>
                            <Grid container justify="center" direction="column">
                                <Typography align="center">Retry in...</Typography>
                                <Typography
                                    className={classes.counter}
                                    align="center">{count}</Typography>
                            </Grid>
                        </DialogContent>
                    )
                }
                </CountDownTimer>
                { actionButtons }
            </Fragment>
        ),
        [LOADING_STATES.CANCELED]: (
            <Fragment>
                <DialogTitle align="center">Data Upload Canceled</DialogTitle>
                <DialogContent>
                    <Grid container justify="center">
                        <Typography>Data upload was canceled by the user.</Typography>
                    </Grid>
                </DialogContent>
                { actionButtons }
            </Fragment>
        ),
        [LOADING_STATES.FAILED]: (
            <Fragment>
                <DialogTitle align="center">Error Sending Data</DialogTitle>
                <DialogContent>
                    <Grid container justify="center">
                        <Typography>{ errorMessage }</Typography>
                    </Grid>
                </DialogContent>
                { actionButtons }
            </Fragment>
        )
    };

    return (
        <Dialog open={open}
            classes={{ paper: classes.root }}
            onClose={onClose}>
            {
                states[state]
            }
        </Dialog>
    );
}

DownloadDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    state: PropTypes.symbol.isRequired,
    cancelable: PropTypes.func,
    closeable: PropTypes.func
};


function ActionButtons({ onClose, onCancel, cancelable, closeable }) {
    return (
        <DialogActions>
            <Grid container justify="space-between">
                <Button
                    disabled={!cancelable()}
                    onClick={onCancel}
                    >Cancel</Button>
                <Button
                    disabled={!closeable()}
                    variant="outlined"
                    onClick={onClose}>Close</Button>
            </Grid>
        </DialogActions>
    );
}

export default withStyles(styles)(DownloadDialog);