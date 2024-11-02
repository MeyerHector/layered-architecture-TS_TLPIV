export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN': {
            return {
                ...state,
                ...action.payload,
                isLogged: true
            };
        }
        case 'LOGOUT': {
            return {
                isLogged: false
            };
        }
        default:
            return state;
    }
};