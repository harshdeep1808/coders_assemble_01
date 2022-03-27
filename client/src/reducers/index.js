import {combineReducers} from 'redux'
import alert from './alert'
import auth from './auth'
import profileReducer from './profile'

export default combineReducers({
     alert,
     auth,
     profile:profileReducer
})
