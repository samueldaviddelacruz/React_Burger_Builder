import reducer from './auth'
import * as actionTypes from '../actions/actionTypes'


describe('auth reducer', () => {

    it('should return the initial state', () => {
        //  const initialState =
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        })
    })

    it('should return the token upon login', () => {
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        }, {
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'fake_token',
            userId: 'fake_id'
        })).toEqual({
            token: 'fake_token',
            userId: 'fake_id',
            error: null,
            loading: false,
            authRedirectPath: '/'
        })
    })

})