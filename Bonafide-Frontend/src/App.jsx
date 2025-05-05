import Validator from "./pages/Validator"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editdata from "./pages/EditData";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/validate" element={<Validator />} />
        <Route path="/edit-data" element={<Editdata />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;