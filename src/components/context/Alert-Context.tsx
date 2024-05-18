'use client';

import { createContext, useContext, useState } from 'react';

export interface Info {
  status: 'success' | 'warning' | 'error';
  message: string;
}

interface State {
  status: 'success' | 'warning' | 'error' | null;
  isShow: boolean;
  message: string;
  show: (info: Info) => void;
  close: () => void;
}

const defaultState: State = {
  status: null,
  isShow: false,
  message: '',
  show: (info: Info) => {},
  close: () => {},
};

const StateContext = createContext(defaultState);

function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(defaultState);

  function show(info: Info) {
    setState((prev) => ({
      ...prev,
      status: info.status,
      isShow: true,
      message: info.message,
    }));
  }

  function close() {
    setState(defaultState);
  }

  const alertInfo: State = {
    status: state.status,
    isShow: state.isShow,
    message: state.message,
    show,
    close,
  };

  return (
    <StateContext.Provider value={alertInfo}>{children}</StateContext.Provider>
  );
}

export const useAlert = () => {
  return useContext(StateContext);
};

export default AlertProvider;
