import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useTransposeContext } from "../../context/TransposeContext"
import IconButton from "@mui/material/IconButton"
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./styles.scss";

export function TransposeControl() {
  const { semitones, reset, decrement, increment } = useTransposeContext()
  const isUnison = semitones === 0

  return (
    <div className="trans">
      <span className="trans__title">Transpose</span>

      <IconButton onClick={reset} disabled={isUnison}>
        <RestartAltIcon/>
      </IconButton>
      <IconButton onClick={decrement}>
        <RemoveCircleOutlineIcon />
      </IconButton>
      <div>{semitones}</div>
      <IconButton onClick={increment}>
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  )
}