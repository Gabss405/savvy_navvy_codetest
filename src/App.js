import "./App.css";
import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import ImageUploader from "react-images-upload";

const App = () => {
  const [uploadedImgs, setUploadedImgs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [coordinates, setCoordinates] = useState({
    fullMatches: [],
    partialMatches: [],
  });

  const onDrop = (_, pictureURL) => {
    setUploadedImgs(pictureURL);
  };

  const sanitize = (text) => {
    console.log(text);
    let sanitizedText =
      text.substr(0, 2) +
      "°" +
      text.substr(3, 2) +
      '"' +
      "." +
      text.substr(7, 3) +
      text.substr(10, 3) +
      "°" +
      text.substr(14, 3) +
      "." +
      text.substr(18, 3);
    return sanitizedText;
  };

  const fullMatchRegex = /[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[NS]\s[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[WE]/gi;
  const partialMatchRegex = /[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[NS]\s[0-9]{2}.[0-9]{2}/gi;

  const handleImageOCR = () => {
    uploadedImgs.forEach((picture) => {
      Tesseract.recognize(picture, "eng", {
        logger: (worker) => {
          if (worker.progress * 100 > progress)
            setProgress(worker.progress * 100);
        },
      })
        .then(({ data: { text } }) => {
          let fullMatches = [];
          let partialMatches = [];
          text.match(fullMatchRegex).forEach((match) => {
            fullMatches.push(sanitize(match));
          });

          text.match(partialMatchRegex);

          console.log(fullMatches);
          return { fullMatches, partialMatches };
        })
        .then(({ fullMatches, partialMatches }) => {
          setCoordinates({
            fullMatches,
            partialMatches,
          });
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
    progress > 1 && progress < 100 && progress !== 50 ? (
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
            <strong>{coordinates.fullMatches.length + " full matches"}</strong>
            {coordinates.fullMatches.map((match) => (
              <li
                className="coordinate-list-element"
                key={coordinates.fullMatches.indexOf(match)}
              >
                <p>{match}</p>
              </li>
            ))}
          </ul>
          <ul className="partial-matches">
            <strong>
              {coordinates.partialMatches.length + " partial matches"}
            </strong>{" "}
            {coordinates.partialMatches.map((match) => (
              <li
                className="coordinate-list-element"
                key={coordinates.partialMatches.indexOf(match)}
              >
                <p>{match}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
