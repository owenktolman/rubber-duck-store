import {HOST} from '../main.jsx'
import {setConstants, setDucks} from '../reducers/reducer.jsx'

export const fetchDucks = () => async (dispatch) => {
    const response = await fetch(`${HOST}`).then((response) =>  response.ok ? response.json() : response.text())
        .catch(error => console.error(error))
        .then((response) => response)
    dispatch(setDucks(response))
}

export const fetchDuckConstants = () => async (dispatch) => {
    const response = await fetch(`${HOST}/constants`).then((response) =>  response.ok ? response.json() : response.text())
        .catch(error => console.error(error))
        .then((response) => response)
    dispatch(setConstants(response))
}

export const addNewDuck = (duck) => async (dispatch) => {
    await fetch(`${HOST}/duck/`, {
        method: 'POST',
        body: JSON.stringify(duck),
        headers: { 'Content-Type': 'application/json' },
    }).catch(error => console.error(error))
    //fetch ducks after adding new duck, optimization: add duck to store immediately instead of fetch and match up later
    dispatch(fetchDucks())
}

export const updateDuck = (duck) => async (dispatch) => {
    await fetch(`${HOST}/duck/${duck._id}`, {
        method: 'POST',
        body: JSON.stringify(duck),
        headers: { 'Content-Type': 'application/json' },
    }).catch(error => console.error(error))
    //fetch ducks after updating duck, optimization: update duck in store immediately and match up later
    dispatch(fetchDucks())
}

export const orderDucks = async (destination, mode, duck) => {
    const data = {
        destination: destination,
        shippingMode: mode,
        duck: { ...duck },
    }
    await fetch(`${HOST}/order`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    }).catch(error => console.error(error))
}
