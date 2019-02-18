import React, { PureComponent, Fragment } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import compose from 'recompose/compose';
import Dialog from './Dialog';
import withRetry from './lib/withRetry';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const SIMULATE = Object.freeze({
    SUCCESS: 'success',
    INTERMEDIATE: 'random',
    FAILURE: 'failed'
});

const styles = theme => ({
    button: {
        margin: '20px auto 0 auto'
    },
    formContainer: {
        border: '1px solid #ffffff66',
        borderRadius: '8px'
    },
    legend: {
        marginLeft: '10px',
        padding: '0 5px'
    },
    radioGroup: {
        margin: '10px 20px'
    },
    selectLabelRoot: {
        color: theme.palette.text.secondary,
        '&$selectLabelFocused': {
            color: theme.palette.text.secondary
        }
    },
    selectLabelFocused: { }
});

class UploadForm extends PureComponent {

    state = {
        simulate: SIMULATE.INTERMEDIATE
    }

    onInputChange = this.onInputChange.bind(this);
    onInputChange(e) {
        this.setState({
            simulate: e.target.value
        });
    }

    onSubmit = this.onSubmit.bind(this);
    onSubmit() {
        this.props.onSubmit(
            () =>
                axios.post(`/api/${this.state.simulate}`)
        );
    }

    render() {
        const { simulate } = this.state;
        const { classes } = this.props;

        return (
            <Fragment>
                <FormControl
                    component="fieldset"
                    className={ classes.formContainer }>

                    <FormLabel
                        component="legend"
                        className={ classes.legend }
                        classes={{
                            root: classes.selectLabelRoot,
                            focused: classes.selectLabelFocused
                        }}>Connection Simulator</FormLabel>

                    <RadioGroup
                        className={ classes.radioGroup }
                        value={simulate}
                        onChange={this.onInputChange}>
                        <FormControlLabel
                            value={ SIMULATE.SUCCESS }
                            control={ <Radio /> }
                            label="Successful upload"
                            />

                        <FormControlLabel
                            value={ SIMULATE.INTERMEDIATE }
                            control={ <Radio /> }
                            label="Intermediate upload Failure"
                            />

                        <FormControlLabel
                            value={ SIMULATE.FAILURE }
                            control={ <Radio />}
                            label="Failed upload"
                            />

                    </RadioGroup>
                </FormControl>

                <Button
                    type="submit"
                    onClick={ this.onSubmit}
                    className={ classes.button }
                    variant="outlined">Simulate Upload</Button>

            </Fragment>
        );
    }

    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired,
            onSubmit: PropTypes.func.isRequired
        };
    }
}


export default compose(
    withStyles(styles),
    withRetry(Dialog)
) (UploadForm);