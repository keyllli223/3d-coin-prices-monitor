import Gallery from "./components/Gallery";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path={"/"} element={<Gallery/>}/>
        </Routes>
    )
}

export default App

