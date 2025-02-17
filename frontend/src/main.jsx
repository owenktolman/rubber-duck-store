import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {CssBaseline, CssVarsProvider} from '@mui/joy'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/store.jsx'

export const HOST = 'http://localhost:5000/api/ducks'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <CssVarsProvider>
          <CssBaseline />
          {/* CssBaseLine is a JoyUI component that makes baseline CSS more consistent across browsers */}
          <Provider store={store}>
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          </Provider>

      </CssVarsProvider>
  </StrictMode>,
)
