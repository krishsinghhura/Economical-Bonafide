import Validator from "./pages/Validator"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/validate" element={<Validator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;