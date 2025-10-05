import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth"
import AppRoutes from "./routes/AppRoutes"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App