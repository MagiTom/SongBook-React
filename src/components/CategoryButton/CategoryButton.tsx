import React from "react";
import Button from "@mui/material/Button";
import { Category } from "../../constans/categories";

interface CategoryButtonProps {
  category: Category;
  getCategory: (category: Category) => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = (props) => {
  return <Button onClick={() => props.getCategory(props.category)} variant="outlined">{props.category.name}</Button>;
};

export default CategoryButton;
