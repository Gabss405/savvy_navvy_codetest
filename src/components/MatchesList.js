import "./MatchesList.css";

const MatchesList = ({ match, idx, handleChange, fullMatch }) => {
  return (
    <tr className="full-matches" key={idx}>
      <td className="match-label">
        {" "}
        {fullMatch ? "Full match" : "Partial Match"} {idx + 1 + ":"}
      </td>
      <td>
        <textarea
          name="dd1"
          id={idx}
          className={fullMatch ? "td-fullm" : "td-partialm"}
          onChange={handleChange}
          defaultValue={match.dd1}
        ></textarea>
      </td>
      <td>
        <textarea
          name="mm1"
          id={idx}
          className={fullMatch ? "td-fullm" : "td-partialm"}
          onChange={handleChange}
          defaultValue={match.mm1}
        ></textarea>
      </td>
      <td>
        <textarea
          name="ss1"
          id={idx}
          className={fullMatch ? "td-fullm" : "td-partialm"}
          onChange={handleChange}
          defaultValue={match.ss1}
        ></textarea>
      </td>
      <td>
        <textarea
          name="cd1"
          id={idx}
          className={fullMatch ? "td-fullm" : "td-partialm"}
          onChange={handleChange}
          defaultValue={match.cd1}
        ></textarea>
      </td>
      <td>
        <textarea
          name="dd2"
          id={idx}
          className={fullMatch ? "td-fullm" : "td-partialm"}
          onChange={handleChange}
          defaultValue={match.dd2}
        ></textarea>
      </td>
      <td>
        <textarea
          name="mm2"
          id={idx}
          className={fullMatch ? "td-fullm" : "td-partialm"}
          onChange={handleChange}
          defaultValue={match.mm2}
        ></textarea>
      </td>
      <td>
        <textarea
          name="ss2"
          id={idx}
          className={fullMatch ? "td-fullm" : "td-partialm"}
          onChange={handleChange}
          defaultValue={match.ss2}
        ></textarea>
      </td>
      <td>
        <textarea
          name="cd2"
          id={idx}
          className={fullMatch ? "td-fullm" : "td-partialm"}
          onChange={handleChange}
          defaultValue={match.cd2}
        ></textarea>
      </td>
      <td className="buttons-container">
        <div
          className="button list-button"
          onClick={(e) => {
            e.preventDefault();
            window.open(
              `https://www.google.com/maps/place/${match.dd1}%C2%B0${match.mm1}'${match.ss1}.0%22${match.cd1}+${match.dd2}%C2%B0${match.mm2}'${match.ss2}.0%22${match.cd2}`,
              "_blank"
            );
          }}
        >
          Open
        </div>
        <div
          className="button list-button"
          onClick={() => {
            navigator.clipboard.writeText(
              `${match.dd1}° ${match.mm1}" ${match.ss1}' ${match.cd1} ${match.dd2}° ${match.mm2}" ${match.ss2}' ${match.cd2}`
            );
          }}
        >
          Copy
        </div>
      </td>
    </tr>
  );
};

export default MatchesList;
