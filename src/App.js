import "./App.css";
import { useState } from "react";
import Tesseract from "tesseract.js";
import ImageUploader from "react-images-upload";

const App = () => {
  const [uploadedImgs, setUploadedImgs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [processedText, setProcessedText] = useState([]);
  const [coordinates, setCoordinates] = useState({
    fullMatches: [],
    partialMatches: [],
  });

  const onDrop = (_, pictureURL) => {
    setUploadedImgs(pictureURL);
  };

  const handleImageOCR = () => {
    uploadedImgs.forEach((picture) => {
      console.log(picture);
      Tesseract.recognize(picture, "eng", {
        logger: (ww) => {
          setProgress(ww.progress * 100);
        },
      }).then(({ data: { text } }) => {
        setProcessedText((prevProcessedTexts) => [...prevProcessedTexts, text]);
        return processedText;
      });
    });
  };

  const latLngFinder = (ot) => {
    console.log(
      ot.match(
        /[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[NS]\s[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[WE]/gi
      )
    );
    console.log(
      ot.match(/[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[NS]\s[0-9]{2}.[0-9]{2}/gi)
    );
  };

  {
    processedText.map((ot) => (
      <li className="ocr-element" key={processedText.indexOf(ot)}>
        <strong>{processedText.indexOf(ot) + 1}. </strong>
        {latLngFinder(ot)})
      </li>
    ));
  }

  const loadingBar =
    progress > 1 && progress < 100 && progress != 50 ? (
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
    ) : (
      <div className="process-label"> 0% Processed</div>
    );

  return (
    <div className="main-container">
      <h1>savvy navvy code test submission</h1>
      <ImageUploader
        withIcon={true}
        withPreview={true}
        buttonText="Choose Images"
        onChange={onDrop}
        imgExtension={[".jpg", ".gif", ".png", ".gif"]}
        maxFileSize={5242880}
      />
      <>{loadingBar}</>
      <div className="button-OCR" onClick={handleImageOCR}>
        Run OCR
      </div>
      {(coordinates?.partialMatches.length > 0 ||
        coordinates?.fullMatches.length > 0) && (
        <div className="results-container">
          <ul className="full-matches">
            {" "}
            {coordinates.fullMatches.map((matches) => (
              <li
                className="coordinate"
                key={coordinates.fullMatches.indexOf(matches)}
              >
                <strong>
                  {coordinates.fullMatches.indexOf(matches) + 1}.{" "}
                </strong>
              </li>
            ))}
          </ul>
          <ul className="partial-matches">
            {" "}
            {coordinates.partialMatches.map((matches) => (
              <li
                className="coordinate"
                key={coordinates.partialMatches.indexOf(matches)}
              >
                <strong>
                  {coordinates.partialMatches.indexOf(matches) + 1}.{" "}
                </strong>
                {}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
