import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';


const STATE = Object.freeze({
    LOADING: Symbol('Loading'),
    SUCCESS: Symbol('Success'),
    RETRY: Symbol('Retry'),
    FAILED: Symbol('Failed'),
    CANCELED: Symbol('Canceled')
});

/**
 * CountDownTimer
 * Helper component to display a countdown timer
 * TODO: Rewrite component to remove render props
 */
class CountDownTimer extends PureComponent {
    state ={
        count: this.props.timer
    };

    timer = undefined;

    componentDidMount() {
        this.timer = setInterval(this.updateTimer.bind(this), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    updateTimer() {
        if (this.state.count <= 0)
            clearInterval(this.timer);

        this.setState(state => ({
            count: state.count > 0 ? state.count - 1 : 0
        }));
    }

    render() {
        return this.props.children(this.state.count);
    }

    static get propTypes() {
        return {
            timer: PropTypes.number.isRequired,
            children: PropTypes.func.isRequired
        };
    }

    static get defaultProps() {
        return {
            timer: 5
        };
    }
}

/**
 * withRetry
 * @param {React Component} Model: the model to display during data transfer
 */

function withRetry(Model) {
    /**
     *
     * @param {React Component} WrappedComponent
     * @param {Options Object} options { retryCount, retryDelay }
     */
    function _withRetry( WrappedComponent, {retryCount: maxRetry=3, retryDelay=5}={}) {
        /**
         * WithRetry React Compoennt
         */
        class WithRetry extends PureComponent {

            state = {
                formKey: 0,
                openModel: false,
                uploadState: STATE.LOADING,
                retryCount: 1,
                errorMessage: ''
            };

            // uploadFunction needs to be a function which returns a promise
            uploadFunction = undefined;
            // Retry timer handle
            retryTimer = undefined;

            componentWillUnmount() {
                clearTimeout(this.retryTimer);
            }

            closeModel = this.closeModel.bind(this);
            closeModel() {
                const { uploadState } = this.state;

                if (uploadState === STATE.SUCCESS) {
                    // reset state, increment formKey to
                    // clear the form
                    this.setState(state => ({
                        openModel: false,
                        formKey: state.formKey + 1,
                        retryCount: 1,
                    }));
                } else if (uploadState === STATE.FAILED ||
                        uploadState === STATE.CANCELED) {

                    this.setState({
                        openModel: false,
                        retryCount: 1,
                    });
                }
            }

            onSubmit = this.onSubmit.bind(this);
            onSubmit(uploadFunction) {
                if (typeof uploadFunction !== 'function')
                    throw new TypeError('onSubmit expects a function which returns a promise.');

                this.uploadFunction = uploadFunction;
                // initialize upload
                this.setState({
                    openModel: true,
                    uploadState: STATE.LOADING,
                    errorMessage: ''
                });

                this.sendData();
            }

            sendData() {
                this.uploadFunction()
                    .then(response => {
                        this.setState({
                            uploadState: STATE.SUCCESS
                        });
                    })
                    .catch(error => {
                        // Should we try sending data again?
                        if (this.state.retryCount < maxRetry ) {
                            this.setState(state => ({
                                uploadState: STATE.RETRY,
                                retryCount: state.retryCount + 1
                            }));
                            this.retryTimer = setTimeout(() => {
                                this.setState({
                                    uploadState: STATE.LOADING
                                }, this.sendData)
                            }, retryDelay * 1000);
                        } else {
                            // Failed sending data, giving up
                            let errorMessage;
                            try {
                                errorMessage = JSON.stringify(error.message);
                            } catch(e) {
                                errorMessage = "Unknown Error Occurred";
                            }
                            this.setState({
                                uploadState: STATE.FAILED,
                                errorMessage
                            });
                        }
                    });
            }

            cancelable = () => this.state.uploadState === STATE.RETRY;

            cancel = this.cancel.bind(this);
            cancel() {
                if (this.cancelable()) {
                    clearTimeout(this.retryTimer);
                    this.setState({
                        uploadState: STATE.CANCELED,
                        retryCount: 0
                    });
                }
            }

            closeable = () => this.state.uploadState === STATE.SUCCESS
                || this.state.uploadState === STATE.FAILED
                || this.state.uploadState === STATE.CANCELED;

            render() {
                const { formKey, uploadState, openModel, errorMessage } = this.state;
                const { ...props } = this.props;
                return (
                    <Fragment>
                        <WrappedComponent { ...props }
                            key={ formKey.toString() }
                            onSubmit={ this.onSubmit } />

                        <Model
                            open={ openModel }
                            onClose={ this.closeModel }
                            onCancel={this.cancel}
                            state={ uploadState }
                            errorMessage={ errorMessage }
                            cancelable={ this.cancelable }
                            closeable={ this.closeable }
                            />

                    </Fragment>
                );
            }
        }

        return WithRetry;
    }

    return _withRetry;
}

export default withRetry;

export {
    CountDownTimer,
    withRetry,
    STATE as LOADING_STATES
};