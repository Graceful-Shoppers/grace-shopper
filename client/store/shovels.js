import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_SHOVELS = 'GET_SHOVELS'
const REMOVE_SHOVELS = 'REMOVE_SHOVELS'

/**
 * INITIAL STATE
 */
const defaultShovels = []

/**
 * ACTION CREATORS
 */
const getShovels = shovels => ({type: GET_SHOVELS, shovels})

/**
 * THUNK CREATORS
 */
export const getAllShovels = () => async dispatch => {
  try {
    const res = await axios.get('/api/shovels')
    dispatch(getShovels(res.data))
  } catch (err) {
    console.error(err)
  }
}
/**
 * REDUCER
 */
export default function(state = defaultShovels, action) {
  switch (action.type) {
    case GET_SHOVELS:
      return action.shovels
    default:
      return state
  }
}