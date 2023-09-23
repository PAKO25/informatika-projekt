var state = {}

function setState(key, value) {
    state[key] = value;
}
function getState(key) {
    return state[key]
}


export {setState, getState};