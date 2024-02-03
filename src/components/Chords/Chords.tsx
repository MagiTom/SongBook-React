import { useState } from "react";
import { useTransposeContext } from "../../context/TransposeContext";
import "./style.scss";
import { ChordDisplay, getChordByName } from "@magicdidac/chord-display";
import { Chord } from "chordsheetjs";

export const Chords: React.FC<any> = ({ children }) => {
  const { semitones } = useTransposeContext();
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setShowTooltip(index);
  };

  const handleMouseLeave = () => {
    setShowTooltip(null);
  };

  const transposeChord = (chordEl: string) => {
      const chord = Chord.parse(chordEl);
      const chord2 = chord?.transpose(semitones);
      return chord2 ? chord2?.toString() : chordEl;
  };

  const chords: string = children.replace(/\w+/g, (chord: string) => {
    return chord;
  });

  const chordsArr = (): string[] => {
    const result: any[] = [];
    const array = Array.from(chords);
  
    for (let i = 0; i < array.length; i++) {
      if (array[i]?.trim() && array[i + 1]?.trim()) {
        const el = `${array[i].trim()}${array[i + 1].trim()}${
          array[i + 2] ? array[i + 2].trim() : ""
        }`;
        const newEl = transposeChord(el);
        result.push(newEl);
        array[i + 2] ? (i = i + 2) : i++;
      } else {
        const newEl = transposeChord(array[i]);
        result.push(newEl);
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
                width: "100px",
                height: "auto",
              }}
            >
              <ChordDisplay
                chord={getChordByName(chord)}
              />
            </div>
          )}
        </span>
      ))}
    </pre>
  );
};
