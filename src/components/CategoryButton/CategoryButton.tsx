import React from "react";
import Button from "@mui/material/Button";
import { Category } from "../../constans/categories";

interface CategoryButtonProps {
  category: Category;
  getCategory: (category: Category) => void;
  marked: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = (props) => {
  return <Button disableElevation onClick={() => props.getCategory(props.category)} variant={props.marked ? "contained" : "outlined"}>{props.category.name}</Button>;
};

export default CategoryButton;
