import * as actionCreator from "./actions";

const initialState = {
  isAuthenticated: false,
  isLoggedIn: "",
  authMethod: "",
  userId: "",
  sName: ""
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionCreator.LOGOUT:
      console.log("i am in logout...");
      return {
        ...state,
        isAuthenticated: false,
        authMethod: null,
        userId: null,
        sName: null
      };
    case actionCreator.LOGIN:
      console.log("i am in login...");
      return {
        ...state,
        ...action.data
      };

    default:
      return state;
  }
}
