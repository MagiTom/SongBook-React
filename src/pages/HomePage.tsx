import React from "react";
import CategoryButton from "../components/CategoryButton/CategoryButton";
import { categories } from "../constans/categories";
import './style.scss'

export const HomePage = () => {
  const categoriesList = categories;

  return (
    <div className="categories">
      {categoriesList.map(category => (
        <CategoryButton
          key={category.id} // Dodaj klucz unikalny dla każdego elementu w mapie
          category={category}
          getCategory={() => console.log("jajajja")} // Utwórz anonimową funkcję, aby przekazać jako props
        />
      ))}
    </div>
  );
};

export default HomePage;
