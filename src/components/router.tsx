import { Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import SongPage from "../pages/SongPage/SongPage"
import { CategoryPage } from "../pages/CategoryPage/CategoryPage"


export const Router = () =>{
    return (
        <Routes>
        <Route path="/" element={<HomePage />}>
        <Route path="/" element={<CategoryPage />} />
        <Route path="/:category" element={<CategoryPage />} />
        </Route>
        <Route path="/song/:id" element={<SongPage />} />
     </Routes>
    )
}

export default Router;