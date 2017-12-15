import * as actionTypes from './actionTypes'
import axios from 'axios'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const auth = (email, password, isSignup) => {
    return (dispatch) => {
        dispatch(authStart())

        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        console.log(authData)
        const apiKey = 'AIzaSyBcbPCWtXwmIPnjFH9woS_46kNpgGrOZig'
        let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${apiKey}`
        if (!isSignup) {
            url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`
        }
        axios.post(url, authData)
            .then((response) => {
                console.log(response)
                dispatch(authSuccess(response.data.idToken, response.data.localId))
            }).catch((error) => {
            console.log(error)
            dispatch(authFail(error.response.data.error))
        })
        // dispatch(authSuccess())
    }
}