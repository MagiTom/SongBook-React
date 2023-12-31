import "./style.scss";

export const Lyrics: React.FC<any> = ({ children }) => {
    return <pre className="lyric">{children}</pre>
}

export default Lyrics;