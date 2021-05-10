import "./App.css";
import { useState } from "react";
import { createWorker } from "tesseract.js";
import ImageUploader from "react-images-upload";

import LoadingBar from "./components/LoadingBar";
import MatchesList from "./components/MatchesList";

const App = () => {
  const [uploadedImgs, setUploadedImgs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [coordinates, setCoordinates] = useState({
    fullMatches: [],
    partialMatches: [],
  });

  // function for uploading/formatting pictures:
  const onDrop = (_, pictureURL) => {
    setUploadedImgs(pictureURL);
  };

  // formatting coordainate matches:
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

  // webworker progress logger:
  const worker = createWorker({
    logger: (worker) => {
      if (worker.progress * 100 > progress) setProgress(worker.progress * 100);
    },
  });

  //tesseract script for optical character recognition, splitting full and partial matches:
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

  // handling user corrections to matches:
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
      <div className="button" onClick={handleImageOCR}>
        Run OCR
      </div>
      {(coordinates.partialMatches?.length > 0 ||
        coordinates.fullMatches?.length > 0) && (
        <div className="results-container">
          <table className="results-table">
            <tbody>
              <tr className="header-row">
                <td className="match-label"></td>
                <td>DD°</td>
                <td>MM"</td>
                <td>SS'</td>
                <td>CD</td>
                <td>DD°</td>
                <td>MM"</td>
                <td>SS'</td>
                <td>CD</td>
                <td>Link</td>
              </tr>

              {coordinates.fullMatches?.map((match, idx) => (
                <MatchesList
                  match={match}
                  idx={idx}
                  fullMatch={true}
                  handleChange={handleChange}
                />
              ))}
              {coordinates.partialMatches?.map((match, idx) => (
                <MatchesList
                  match={match}
                  idx={idx}
                  fullMatch={false}
                  handleChange={handleChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
