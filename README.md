# withRetry (React Component)

withRetry manages the state and logic of re-sending data to an api endpoint, while keeping the end user update to date through a dialog box.

[Demo](http://with-retry.digital-logic.net/)

## How it works

1. Create a model to display to the user during the network transaction.
```Javascript
import { LOADING_STATES } from 'withRetry';

function MyModel({open, onClose, onCancel, state, errorMessage}) {

    const modelStates = {
        [LOADING_STATES.LOADING]: (
            // display loading message
        ),
        [LOADING_STATES.SUCCESS]: (
            // display Successful message
        ),
        [LOADING_STATES.RETRY]: (
            // display retry message
        ),
        [LOADING_STATES.CANCELED]: (
            // display canceled message
        ),
        [LOADING_STATES.FAILED]: (
            // display failed message
        )
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}>
            {
                modelStates[state]
            }
        </Dialog>
    );
}
```

2. Create your form

```Javascript
import withRetry from 'withRetry';

class MyForm extends PureComponent {

    onSubmit() {
        // withRetry will provide a onSubmit prop to your form component
        // onSubmit requires a function that returns a Promise
        this.props.onSubmit(() => {
            axios.post('/api/contact', data)
        })
    }

    render() {
        return (
            <form>
                <label>Name
                    <input />
                </label>
            </form>
        );
    }
}

export default withRetry(MyModel)(MyForm);
```
