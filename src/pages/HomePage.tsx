import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import CategoryButton from "../components/CategoryButton/CategoryButton";
import { useSongsDbContext } from "../context/firebaseContext";
import "./style.scss";

export const HomePage = () => {
  const { category } = useParams();
  const { categoriesDb } = useSongsDbContext();
  const [categoryItem, setCategoryItem] = useState<string>();
  const all = "all";

  useEffect(() => {
    setCategoryItem(category);
  }, []);

  const navigate = useNavigate();
  const goToCategory = (category: string) => {
    setCategoryItem(category);
    return navigate(`/${category}`);
  };

  return (
    <div className="home">
      <div className="categories">
        {categoriesDb.map((category) => (
          <CategoryButton
            marked={category.name === categoryItem}
            key={category.id}
            category={category}
            getCategory={() => goToCategory(category.name)}
          />
        ))}
        {
          <CategoryButton
            marked={!categoryItem}
            category={{ id: all, name: "wszystkie" }}
            getCategory={() => goToCategory("")}
          />
        }
      </div>
      <div className="songs">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
