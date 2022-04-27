import { types } from "../types/types";

const initialState = {
}; 
export const filtroReducer = (state = {}, action) => {
  switch (action.type) {
    case types.contenido:
      return {
        filtroSelected: action.payload.filtroSelected,
        settings: action.payload.settings,
      };

    default:
      return state;
  }
};
