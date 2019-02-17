import { AsyncStorage } from "react-native";

export const LOGGINGIN = "LOGGINGIN";
export const LOGOUT = "LOGOUT";
export const LOGIN = "LOGIN";

export const LOGIN_DETAILS = "LOGIN_DETAILS";

export const loggingIn = res => {
  return {
    type: LOGGINGIN,
    data: res
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};

export const fetchLoginDetails = () => {
  return async dispatch => {
    //console.log(data);

    try {
      isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
      authMethod = await AsyncStorage.getItem("authMethod");
      userId = await AsyncStorage.getItem("userId");
      sname = await AsyncStorage.getItem("sName");
      language = await AsyncStorage.getItem("language");
      var acData = {
        isAuthenticated: isAuthenticated,
        authMethod: authMethod,
        userId: userId,
        sName: sname,
        language: language
      };
      dispatch(login(acData));
    } catch (error) {
      console.log("Error getting  Data from async");
    }
  };
};

export const userLogout = data => {
  return async dispatch => {
    dispatch(logout());

    //console.log(data);

    try {
      await AsyncStorage.removeItem("isAuthenticated");
      await AsyncStorage.removeItem("authMethod");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("sName");
    } catch (error) {
      console.log("Error Saving Data");
    }
  };
};

export const loginDetails = data => {
  return async dispatch => {
    dispatch(login(data));

    console.log(data);

    try {
      await AsyncStorage.setItem(
        "isAuthenticated",
        JSON.stringify(data.isAuthenticated)
      );
      await AsyncStorage.setItem("authMethod", data.authMethod);
      await AsyncStorage.setItem("userId", data.userId);
      await AsyncStorage.setItem("sName", data.sName);
    } catch (error) {
      console.log("Error Saving Data");
    }
  };
};

export const login = data => {
  return {
    type: LOGIN,
    data: data
  };
};
