import { Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import SongPage from "../pages/SongPage/SongPage"


export const Router = () =>{
    return (
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/song/:id" element={<SongPage />} />
     </Routes>
    )
}

export default Router;