// add csrfFetch()
import { csrfFetch } from '../store/csrf';


// for dive sites page in card layout
 const LOAD_LOCATIONS = "location/LOAD_LOCATIONS";
 const UPDATE_LOCATION = "location/UPDATE_LOCATION";
 const REMOVE_LOCATION = "location/REMOVE_LOCATION";
 const ADD_LOCATION = "location/ADD_LOCATION";
 const LOAD_LOCATION = "location/LOAD_LOCATION";


// ===========================================================================
// TYPES
// ===========================================================================
// load ALL locations from DB
export const loadLocations = list => ({
    type: LOAD_LOCATIONS,
    list,
});

// load single location once clicked on
export const loadLocation = location => ({
    type: LOAD_LOCATION,
    location,
});

export const updateLocation = (location) => ({
    type: UPDATE_LOCATION,
    location,
});

export const addLocation = (location) => ({
    type: ADD_LOCATION,
    location,
});

export const removeLocation = (locationId) => ({
    type: REMOVE_LOCATION,
    locationId,
});
// ===========================================================================
// API's
// ===========================================================================
// GET /api/locations/
export const getLocations = () => async (dispatch) => {
    const res = await csrfFetch(`/api/locations/`);
    if (res.ok) {
        const list = await res.json();
        dispatch(loadLocations(list));
        return list;
    }
};

// GET /api/location/:id
export const getLocation = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/location/${id}`);
    if (res.ok) {
        const location = await res.json();
        dispatch(loadLocation(location));
        return location;
    }
};

// PUT /api/locations/:id
export const editLocation = (payload, id) => async (dispatch, getState) => {
    const {  title, body, address, state, zipCode } = payload;
    console.log('Dive Site PUT',  title, body, address, state, zipCode );

    const res = await csrfFetch(`/api/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (res.ok) {
        const location = await res.json();
        dispatch(updateLocation(location));
        console.log('location return', location);
        return location;
    }
};

// DELETE /api/locations/:id
export const deleteLocation = (id) => async dispatch => {
    const res = await csrfFetch(`/api/locations/${id}`, {
        method: 'DELETE'
    });
    if (res.ok) {
        const locationId = await res.json();
        dispatch(removeLocation(id));
    }
};


// ===========================================================================
// REDUCER
// ===========================================================================
const initialState = {
    list: []
};

const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_LOCATIONS:
            const allLoc = {};
            action.list.forEach(location => {
                allLoc[location.id] = location;
            });
            return allLoc;
        case LOAD_LOCATION:
            const loc = {...state};
            loc[action.location.id] = action.location; 
            return loc;
        case REMOVE_LOCATION:
            return {
                ...state,
                [action.locationId]: {
                    ...state[action.locationId],
                }
            };
        case ADD_LOCATION:
            if (!state[action.location.id]) {
                const newState = {
                    ...state,
                    [action.location.id]: action.location
                };
                const locationList = newState.list.map(id => newState[id]);
                locationList.push(action.location);
                return newState;
            }
            return {
                ...state,
                [action.location.id]: {
                    ...state[action.location.id],
                    ...action.location
                }
            };
        case UPDATE_LOCATION:
            return {
                ...state,
                [action.location.id]: action.location
            };
        default:
            return state;
    }
}


export default locationReducer;