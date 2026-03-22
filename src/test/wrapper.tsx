import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import compareReducer from "../store/compareSlice";

export function createTestStore(preloadedState?: { compare: { names: string[] } }) {
  return configureStore({
    reducer: { compare: compareReducer },
    preloadedState,
  });
}

export function TestWrapper({
  children,
  initialEntries = ["/"],
  store,
}: {
  children: ReactNode;
  initialEntries?: string[];
  store?: ReturnType<typeof createTestStore>;
}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const testStore = store ?? createTestStore();

  return (
    <Provider store={testStore}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
}
