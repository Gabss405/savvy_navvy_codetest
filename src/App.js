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
      {processedText.length > 0 && (
        <ul className="ocr-list">
          {processedText.map((ot) => (
            <li className="ocr-element" key={processedText.indexOf(ot)}>
              <strong>{processedText.indexOf(ot) + 1}. </strong>
              {latLngFinder(ot)})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
