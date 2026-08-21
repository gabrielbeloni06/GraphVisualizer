import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Visualizer from "./pages/Visualizer";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/visualizer" element={<Visualizer />} />
    </Routes>
  );
}