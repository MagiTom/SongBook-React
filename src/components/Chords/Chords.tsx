import { Chord, Interval } from "tonal"
import { useTransposeContext } from "../../context/TransposeContext"
import "./style.scss";

export const Chords: React.FC<any> = ({ children }) => {
  const { semitones } = useTransposeContext()

  const chords = children.replace(/\w+/g, (chord: string) =>
    Chord.transpose(chord, Interval.fromSemitones(semitones))
  )

  return <pre className="chord">{chords}</pre>
}