import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage.tsx";

function App() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<MainPage />} />
        </Routes>
    </div>
  )
}

export default App
