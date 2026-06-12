import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Requests from "./pages/Requests";
import RequestDetails from "./pages/RequestDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/requests/:id" element={<RequestDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;