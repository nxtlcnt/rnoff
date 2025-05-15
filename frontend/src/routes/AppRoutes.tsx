import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, NotFound, Maps, ChatBot } from "../views/pages";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
