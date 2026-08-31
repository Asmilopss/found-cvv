import "./DotBackground.css";

function DotBackground({ children }) {
    return (
        <div className="dot-background">
            <div className="dot-content">
                {children}
            </div>
        </div>
    )
}
export default DotBackground;