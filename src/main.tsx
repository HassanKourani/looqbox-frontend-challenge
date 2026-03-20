import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, theme } from 'antd'
import { store } from './store'
import App from './App.tsx'
import { PokemonDetail } from './pages/PokemonDetail'
import './index.css'

const queryClient = new QueryClient()

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: isDark ? '#c084fc' : '#aa3bff',
              colorBgContainer: isDark ? '#16171d' : '#ffffff',
              colorBgElevated: isDark ? '#1f2028' : '#ffffff',
              colorText: isDark ? '#9ca3af' : '#6b6375',
              colorTextBase: isDark ? '#f3f4f6' : '#08060d',
              colorBorder: isDark ? '#2e303a' : '#e5e4e7',
              borderRadius: 8,
            },
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/pokemon/:name" element={<PokemonDetail />} />
            </Routes>
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
