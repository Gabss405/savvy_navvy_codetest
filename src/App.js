import "./App.css";
import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import ImageUploader from "react-images-upload";

import LoadingBar from "./components/LoadingBar";

const App = () => {
  const [uploadedImgs, setUploadedImgs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [coordinates, setCoordinates] = useState({
    fullMatches: [],
    partialMatches: [],
  });

  // function for uploading/formatting pictures
  const onDrop = (_, pictureURL) => {
    setUploadedImgs(pictureURL);
  };

  //
  const sanitise = (text) => {
    let sanitisedText = {
      dd1: text.substr(0, 2),
      mm1: text.substr(3, 2),
      ss1: text.substr(7, 2),
      cd1: text[9] ? text[9].toUpperCase() : "",
      dd2: text.substr(10, 3),
      mm2: text.substr(14, 2),
      ss2: text.substr(18, 2),
      cd2: text[20] ? text[20].toUpperCase() : "",
    };
    return sanitisedText;
  };

  const fullMatchRegex = /[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[NS]\s[0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[WE]/gi;

  const partialMatchRegex = /([0-9]{2}.[0-9]{2}.{1,2}[0-9]{2}[NS]\s[0-9]{2}.[0-9]{2})/gi;

  const worker = createWorker({
    logger: (worker) => {
      if (worker.progress * 100 > progress) setProgress(worker.progress * 100);
    },
  });

  const handleImageOCR = async () => {
    uploadedImgs.forEach(async (img) => {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      const {
        data: { text },
      } = await worker.recognize(img);

      let fullMatches = [];
      let partialMatches = [];

      let tempFullMatches = text.match(fullMatchRegex);

      tempFullMatches?.forEach((el) => {
        fullMatches.push(sanitise(el));
      });

      let textNoFullMatches = text.replace(fullMatchRegex, "");

      textNoFullMatches.match(partialMatchRegex)?.forEach((el) => {
        console.log(el);
        partialMatches.push(sanitise(el));
      });

      setCoordinates({
        fullMatches,
        partialMatches,
      });
      console.log(text);
      await worker.terminate();
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value, id, className } = e.target;
    if (className.includes("td-fullm")) {
      setCoordinates(({ fullMatches, partialMatches }) => {
        let tempArray = [...fullMatches];
        let tempObjs = { ...tempArray[+id] };
        tempObjs[name] = value;
        tempArray[+id] = tempObjs;
        return { fullMatches: tempArray, partialMatches };
      });
    }
    if (className.includes("td-partialm")) {
      setCoordinates(({ fullMatches, partialMatches }) => {
        let tempArray = [...partialMatches];
        let tempObjs = { ...tempArray[+id] };
        tempObjs[name] = value;
        tempArray[+id] = tempObjs;
        return { fullMatches, partialMatches: tempArray };
      });
    }
  };

  console.log(coordinates);

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
      <LoadingBar progress={progress} />
      <div className="button-OCR" onClick={handleImageOCR}>
        Run OCR
      </div>
      {(coordinates.partialMatches?.length > 0 ||
        coordinates.fullMatches?.length > 0) && (
        <div className="results-container">
          <table className="results-table">
            <thead className="results-header">
              <tr>
                <th className="match-label"></th>
                <th>DD°</th>
                <th>MM"</th>
                <th>SS'</th>
                <th>CD</th>
                <th>DD°</th>
                <th>MM"</th>
                <th>SS'</th>
                <th>CD</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {coordinates.fullMatches?.map((match, idx) => (
                <tr className="full-matches" key={idx}>
                  <td className="match-label">Full match {idx + 1 + ":"}</td>
                  <td>
                    <textarea
                      name="dd1"
                      id={idx}
                      className="td-fullm"
                      onChange={handleChange}
                      defaultValue={match.dd1}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="mm1"
                      id={idx}
                      className="td-fullm"
                      onChange={handleChange}
                      defaultValue={match.mm1}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="ss1"
                      id={idx}
                      className="td-fullm"
                      onChange={handleChange}
                      defaultValue={match.ss1}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="cd1"
                      id={idx}
                      className="td-fullm"
                      onChange={handleChange}
                      defaultValue={match.cd1}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="dd2"
                      id={idx}
                      className="td-fullm"
                      onChange={handleChange}
                      defaultValue={match.dd2}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="mm2"
                      id={idx}
                      className="td-fullm"
                      onChange={handleChange}
                      defaultValue={match.mm2}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="ss2"
                      id={idx}
                      className="td-fullm"
                      onChange={handleChange}
                      defaultValue={match.ss2}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="cd2"
                      id={idx}
                      className="td-fullm"
                      onChange={handleChange}
                      defaultValue={match.cd2}
                    ></textarea>
                  </td>
                  <td className="buttons-container">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          `https://www.google.com/maps/place/${match.dd1}%C2%B0${match.mm1}'${match.ss1}.0%22${match.cd1}+${match.dd2}%C2%B0${match.mm2}'${match.ss2}.0%22${match.cd2}`,
                          "_blank"
                        );
                      }}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${match.dd1}° ${match.mm1}" ${match.ss1}' ${match.cd1} ${match.dd2}° ${match.mm2}" ${match.ss2}' ${match.cd2}`
                        );
                      }}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
              {coordinates.partialMatches?.map((match, idx) => (
                <tr className="partial-matches" key={idx}>
                  <td className="match-label">
                    Partial match{" " + (idx + 1) + ":"}
                  </td>
                  <td>
                    <textarea
                      name="dd1"
                      id={idx}
                      className="td-partialm"
                      onChange={handleChange}
                      defaultValue={match.dd1}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="mm1"
                      id={idx}
                      className="td-partialm"
                      onChange={handleChange}
                      defaultValue={match.mm1}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="ss1"
                      id={idx}
                      className="td-partialm"
                      onChange={handleChange}
                      defaultValue={match.ss1}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="cd1"
                      id={idx}
                      className="td-partialm"
                      onChange={handleChange}
                      defaultValue={match.cd1}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="dd2"
                      id={idx}
                      className="td-partialm"
                      onChange={handleChange}
                      defaultValue={match.dd2}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="mm2"
                      id={idx}
                      className="td-partialm"
                      onChange={handleChange}
                      defaultValue={match.mm2}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="ss2"
                      id={idx}
                      className="td-partialm"
                      onChange={handleChange}
                      defaultValue={match.ss2}
                    ></textarea>
                  </td>
                  <td>
                    <textarea
                      name="cd2"
                      id={idx}
                      className="td-partialm"
                      onChange={handleChange}
                      defaultValue={match.cd2}
                    ></textarea>
                  </td>
                  <td className="buttons-container">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          `https://www.google.com/maps/place/${match.dd1}%C2%B0${match.mm1}'0.${match.ss1}%22${match.cd1}+${match.dd2}%C2%B0${match.mm2}'0.${match.ss2}%22${match.cd2}`,
                          "_blank"
                        );
                      }}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${match.dd1}° ${match.mm1}" ${match.ss1}' ${match.cd1} ${match.dd2}° ${match.mm2}" ${match.ss2}' ${match.cd2}`
                        );
                      }}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
