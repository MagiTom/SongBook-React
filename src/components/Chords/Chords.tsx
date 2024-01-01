import { useState } from "react";
import { Chord, Interval } from "tonal";
import { useTransposeContext } from "../../context/TransposeContext";
import "./style.scss";
import { ChordDisplay, getChordByName } from "@magicdidac/chord-display";

export const Chords: React.FC<any> = ({ children }) => {
  const { semitones } = useTransposeContext();
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setShowTooltip(index);
  };

  const handleMouseLeave = () => {
    setShowTooltip(null);
  };

  const chords: string = children.replace(/\w+/g, (chord: string) => {
    return Chord.transpose(chord, Interval.fromSemitones(semitones));
  });

  const chordsArr = (): string[] => {
    const result = [];
    const array = Array.from(chords);

    for (let i = 0; i < array.length; i++) {
      if (array[i]?.trim() && array[i + 1]?.trim()) {
        result.push(
          `${array[i].trim()}${array[i + 1].trim()}${
            array[i + 2] ? array[i + 2] : ""
          }`
        );
        array[i + 2] ? (i = i + 2) : i++;
      } else {
        result.push(array[i]);
      }
    }
    return result;
  };

  return (
    <pre className="chord">
      {chordsArr().map((chord, index) => (
        <span
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          style={{ position: "relative", display: "inline-block" }}
          key={chord + Math.random + index}
        >
          {chord}
          {chord.trim() && showTooltip === index && (
            <div
              style={{
                position: "absolute",
                zIndex: 10000,
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#fff",
                padding: "2px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                width: '100px',
                height: 'auto'
              }}
            >
              <ChordDisplay
                chord={getChordByName(chord)}
                // {/* chord={Chords.C} */}
              />
            </div>
          )}
        </span>
      ))}
    </pre>
  );
};
