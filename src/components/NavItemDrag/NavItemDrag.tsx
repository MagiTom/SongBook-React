import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Tooltip } from "@mui/material";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { Identifier, XYCoord } from "dnd-core";
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { SongListRight } from "../../models/SongListRight.model";
import "./style.scss";

export const ItemTypes = {
  SONG: "song",
};

const style = {
  border: "1px dashed rgb(125, 153, 79, 0.5)",
  padding: "0.2rem 0.5rem",
  marginBottom: ".1rem",
  cursor: "move",
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface NavItemDragProps {
  song: SongListRight;
  index: number;
  selected: boolean;
  goToPage: () => void;
  moveSong: (fromIndex: number, toIndex: number) => void;
  removeSong: () => void;
}

export const NavItemDrag: React.FC<NavItemDragProps> = ({
  song,
  index,
  selected,
  goToPage,
  moveSong,
  removeSong,
}) => {
  const ref = useRef<any>(null);
  const handleRemoveSong = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    removeSong();
  };

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.SONG,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveSong(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SONG,
    item: () => {
      return { id: song.id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <>
      <ListItem
        ref={ref}
        data-handler-id={handlerId}
        style={{ ...style, opacity }}
        onClick={() => goToPage()}
      >
        <Tooltip title="Usuń" arrow>
          <ListItemIcon onClick={handleRemoveSong}>
            {<RemoveCircleIcon />}
          </ListItemIcon>
        </Tooltip>
        <ListItemButton
          selected={selected}
          sx={{ padding: 0.5, cursor: "move" }}
        >
          <ListItemText
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: "bolder",
            }}
            className="text"
            primary={song.title}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
};
