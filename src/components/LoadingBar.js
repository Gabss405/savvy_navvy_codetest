import "./LoadingBar.css";

const LoadingBar = ({ progress }) => {
  if (progress > 1 && progress < 100 && progress !== 50) {
    return (
      <div className="loading-bar-container">
        <div
          style={{
            width: `${progress}%`,
            height: "10px",
            backgroundColor: "#3f4257",
            alignSelf: "flex-start",
            border: "1px solid black",
            borderRadius: "30px",
          }}
        ></div>
        <div className="process-label">{Math.floor(progress)}% Processed</div>
      </div>
    );
  } else {
    return <div className="process-label"> 0% Processed</div>;
  }
};

export default LoadingBar;
