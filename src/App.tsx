/** @format */

import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import AppContextProvider from "@crema/context/AppContextProvider";
import AppThemeProvider from "@crema/context/AppThemeProvider";
import AppStyleProvider from "@crema/context/AppStyleProvider";
import AppLocaleProvider from "@crema/context/AppLocaleProvider";
import InfoViewContextProvider from "@crema/context/AppContextProvider/InfoViewContextProvider";
import AuthRoutes from "@crema/components/AuthRoutes";
import AppLayout from "@crema/core/AppLayout";
import AppAuthProvider from "@crema/core/AppAuthProvider";
import "./styles/index.css";
import { persister, store } from "./redux-config/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppInfoView from "./@crema/components/AppInfoView";
import Toasts from "./Components/toasts";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<>loading...</>} persistor={persister}>
          <AppContextProvider>
            <AppThemeProvider>
              <AppStyleProvider>
                <AppLocaleProvider>
                  <BrowserRouter>
                    <InfoViewContextProvider>
                      <AppAuthProvider>
                        <AuthRoutes>
                          <CssBaseline />
                          <AppLayout />
                          <AppInfoView />
                          <Toasts />
                        </AuthRoutes>
                      </AppAuthProvider>
                    </InfoViewContextProvider>
                  </BrowserRouter>
                </AppLocaleProvider>
              </AppStyleProvider>
            </AppThemeProvider>
          </AppContextProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
