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

  const sanitise = (text) => {
    let sanitizedText = {
      dd1: text.substr(0, 2),
      mm1: text.substr(3, 2),
      ss1: text.substr(7, 2),
      cd1: text[9],
      dd2: text.substr(10, 3),
      mm2: text.substr(14, 2),
      ss2: text.substr(18, 2),
      cd2: text[20],
    };
    return sanitizedText;
  };

  const fullMatchRegex = /[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[NS]\s[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[WE]/gi;

  const partialMatchRegex = /([0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[NS]\s[0-9]{2}.[0-9]{2})/gi;

  const handleImageOCR = () => {
    uploadedImgs.forEach((picture) => {
      Tesseract.recognize(picture, "eng", {
        logger: (worker) => {
          if (worker.progress * 100 > progress)
            setProgress(worker.progress * 100);
        },
      })
        .then(({ data: { text } }) => {
          console.log(text);
          let tempFullMatches = text.match(fullMatchRegex);
          let fullMatches = [];
          let partialMatches = [];

          tempFullMatches.forEach((el) => {
            fullMatches.push(sanitise(el));
          });

          let textNoFullMatches = text.replace(fullMatchRegex, "");

          console.log(textNoFullMatches);
          textNoFullMatches.match(partialMatchRegex).forEach((el) => {
            partialMatches.push(sanitise(el));
          });

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
        maxFileSize={5242880 * 2}
      />
      <>{loadingBar}</>
      <div className="button-OCR" onClick={handleImageOCR}>
        Run OCR
      </div>
      {(coordinates.partialMatches?.length > 0 ||
        coordinates.fullMatches?.length > 0) && (
        <div className="results-container">
          <table className="results-table">
            <thead className="results-header">
              <th></th>
              <th>DD</th>
              <th>MM</th>
              <th>SS</th>
              <th>CD</th>
              <th>DD</th>
              <th>MM</th>
              <th>SS</th>
              <th>CD</th>
              <th>Link</th>
            </thead>
            {coordinates.fullMatches.map((match) => (
              <tr
                className="table-row-full"
                key={coordinates.fullMatches.indexOf(match)}
              >
                <td>Full match {coordinates.fullMatches.indexOf(match)}</td>
                <td>
                  <textarea>{match.dd1}</textarea>
                </td>
                <td>
                  <textarea>{match.mm1}</textarea>
                </td>
                <td>
                  <textarea>{match.ss1}</textarea>
                </td>
                <td>
                  <textarea>{match.cd1}</textarea>
                </td>
                <td>
                  <textarea>{match.dd2}</textarea>
                </td>
                <td>
                  <textarea>{match.mm2}</textarea>
                </td>
                <td>
                  <textarea>{match.ss2}</textarea>
                </td>
                <td>
                  <textarea>{match.cd2}</textarea>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(
                        `https://www.google.com/maps/place/56%C2%B003'22.0%22N+3%C2%B014'21.0%22W`,
                        "_blank"
                      );
                    }}
                  >
                    {" "}
                    Open
                  </button>
                </td>
              </tr>
            ))}
            {coordinates.partialMatches.map((match) => (
              <tr
                className="table-row-partial"
                key={coordinates.partialMatches.indexOf(match)}
              >
                <td>
                  Partial match {coordinates.partialMatches.indexOf(match)}
                </td>
                <td>
                  <textarea>{match.dd1}</textarea>
                </td>
                <td>
                  <textarea>{match.mm1}</textarea>
                </td>
                <td>
                  <textarea>{match.ss1}</textarea>
                </td>
                <td>
                  <textarea>{match.cd1}</textarea>
                </td>
                <td>
                  <textarea>{match.dd2}</textarea>
                </td>
                <td>
                  <textarea>{match.mm2}</textarea>
                </td>
                <td>
                  <textarea>{match.ss2}</textarea>
                </td>
                <td>
                  <textarea>{match.cd2}</textarea>
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
};

export default App;

{
  /* <ul className="full-matches">
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
  {"+" + coordinates.partialMatches.length + " partial matches"}
</strong>{" "}
{coordinates.partialMatches.map((match) => (
  <li
    className="coordinate-list-element"
    key={coordinates.partialMatches.indexOf(match)}
  >
    <p>{match}</p>
  </li>
))}
</ul> */
}
