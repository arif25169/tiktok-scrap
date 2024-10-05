import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChartView from "./ChartView";
import TableView from "./TableView";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChartView />} />
        <Route path="/table" element={<TableView />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
