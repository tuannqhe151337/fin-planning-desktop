import { configureStore } from "@reduxjs/toolkit";
import forgotPasswordReducer from "./slices/forgotPasswordSlice";
import { authAPI } from "./api/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { usersApi as usersAPI } from "./api/usersApi";
import { roleAPI } from "./api/roleApi";
import { departmentAPI } from "./api/departmentApi";
import { positionAPI } from "./api/positionApi";
import { termAPI } from "./api/termApi";
import { plansApi } from "./api/plansApi";
import { annualAPI } from "./api/annualsAPI";
import { statusAPI } from "./api/statusApi";
import { costTypeAPI } from "./api/costTypeAPI";
import { reportsAPI } from "./api/reportsAPI";
import { projectAPI } from "./api/projectsApi";
import { supplierAPI } from "./api/supplierApi";
import { exchangeRateAPI } from "./api/exchangeRateApi";
import { currencyApi } from "./api/currencyApi";
import { dashboardApi } from "./api/dashboardAPI";
import { fcmApi } from "./api/fcmApi";

export const store = configureStore({
  reducer: {
    forgotPassword: forgotPasswordReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
    [roleAPI.reducerPath]: roleAPI.reducer,
    [departmentAPI.reducerPath]: departmentAPI.reducer,
    [positionAPI.reducerPath]: positionAPI.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [termAPI.reducerPath]: termAPI.reducer,
    [annualAPI.reducerPath]: annualAPI.reducer,
    [statusAPI.reducerPath]: statusAPI.reducer,
    [costTypeAPI.reducerPath]: costTypeAPI.reducer,
    [reportsAPI.reducerPath]: reportsAPI.reducer,
    [projectAPI.reducerPath]: projectAPI.reducer,
    [supplierAPI.reducerPath]: supplierAPI.reducer,
    [exchangeRateAPI.reducerPath]: exchangeRateAPI.reducer,
    [currencyApi.reducerPath]: currencyApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [fcmApi.reducerPath]: fcmApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      usersAPI.middleware,
      roleAPI.middleware,
      departmentAPI.middleware,
      positionAPI.middleware,
      plansApi.middleware,
      termAPI.middleware,
      annualAPI.middleware,
      statusAPI.middleware,
      costTypeAPI.middleware,
      reportsAPI.middleware,
      projectAPI.middleware,
      supplierAPI.middleware,
      exchangeRateAPI.middleware,
      currencyApi.middleware,
      dashboardApi.middleware,
      fcmApi.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
