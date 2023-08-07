
import { useTransposeContext } from "../../context/TransposeContext";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./styles.scss";


export const TransposeControl: React.FC<any> = ({ semitones, onSemitonesChange }) => {
  const { reset, decrement, increment } = useTransposeContext();
  const isUnison = semitones === 0;

  const reseting = () => {
    reset();
    onSemitonesChange(0);
  };
  const decrementing = () => {
    decrement();
    onSemitonesChange(semitones - 1); 
  };
  const incrementing = () => {
    increment();
    onSemitonesChange(semitones + 1);
  };
  return (
    <div className="trans">
      <span className="trans__title">Transponuj</span>

      <IconButton color="primary" onClick={reseting} disabled={isUnison}>
        <RestartAltIcon />
      </IconButton>
      <IconButton color="primary" onClick={decrementing}>
        <RemoveCircleOutlineIcon />
      </IconButton>
      <div className="trans__semitones">{semitones}</div>
      <IconButton color="primary" onClick={() => incrementing()}>
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  );
};
