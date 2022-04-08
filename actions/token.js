
export const FETCH_TOKEN_SUCCESS = 'FETCH_TOKEN_SUCCESS';
export const FETCH_TOKEN_FAILURE = 'FETCH_TOKEN_FAILURE';


export function getTokenSuccess(data) {
  return {
    type: FETCH_TOKEN_SUCCESS,
    payload: data
  };
}

export function getTokenFailure(error) {
  return {
    type: FETCH_TOKEN_FAILURE,
    payload: error
  };
}
