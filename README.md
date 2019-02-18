# withRetry (React Component)

## The Problem
You send a request to a back-end api and wait for a response. But what if the request fails? You probably want to retry before giving up - depending on why the request failed.

This component handles the retry request, while keeping the user up to date on whats going on. However, it does not handle filtering errors, yet...

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



### Task Lists

- [x] Handles basic response
- [x] Keeps user informed of what is happening
- [ ] Handles authorization failures
- [ ] Filtering and routing
