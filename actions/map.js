export const FETCH_ADDRESSES = 'FETCH_ADDRESSES';
export const FETCH_ADDRESSES_SUCCESS = 'FETCH_ADDRESSES_SUCCESS';
export const FETCH_ADDRESSES_FAILURE = 'FETCH_ADDRESSES_FAILURE';
export const TO_PLACING_MAP = 'TO_PLACING_MAP';
export const TO_MAP = 'TO_MAP';

export function getAddresses() {
  return {
    type: FETCH_ADDRESSES,
  };
}

export function getAddressesSuccess(data) {
  return {
    type: FETCH_ADDRESSES_SUCCESS,
    payload: data
  };
}

export function getAddressesFailure(error) {
  return {
    type: FETCH_ADDRESSES_FAILURE,
    payload: error
  };
}

export function toMap() {
  return {
    type: TO_MAP,
  };
}

export function toPlacingMap() {
  return {
    type: TO_PLACING_MAP,
  };
}
