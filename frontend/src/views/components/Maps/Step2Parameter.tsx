import { useState } from "react";
import { postFloodAnalysis } from "../../../api/gee";

const Step2Parameter = ({
  geometry,
  onBack,
  onNext,
}: {
  geometry: GeoJSON.Geometry;
  onBack: () => void;
  onNext: (res: any) => void;
}) => {
  const [beforeStart, setBeforeStart] = useState("2019-03-01");
  const [beforeEnd, setBeforeEnd] = useState("2019-03-10");
  const [afterStart, setAfterStart] = useState("2019-03-10");
  const [afterEnd, setAfterEnd] = useState("2019-03-23");
  const [polarization, setPolarization] = useState("VH");
  const [passDirection, setPassDirection] = useState("DESCENDING");
  const [threshold, setThreshold] = useState(1.25);

  const handleSubmit = async () => {
    const payload = {
      geometry,
      before_start: beforeStart,
      before_end: beforeEnd,
      after_start: afterStart,
      after_end: afterEnd,
      polarization,
      pass_direction: passDirection,
      difference_threshold: threshold,
    };

    const res = await postFloodAnalysis(payload);
    onNext(res);
  };

  return (
    <div className="space-y-2">
      <button onClick={onBack}>← Back</button>
      <label>Tanggal Before:</label>
      <input
        type="date"
        value={beforeStart}
        onChange={(e) => setBeforeStart(e.target.value)}
      />
      <input
        type="date"
        value={beforeEnd}
        onChange={(e) => setBeforeEnd(e.target.value)}
      />
      <label>Tanggal After:</label>
      <input
        type="date"
        value={afterStart}
        onChange={(e) => setAfterStart(e.target.value)}
      />
      <input
        type="date"
        value={afterEnd}
        onChange={(e) => setAfterEnd(e.target.value)}
      />

      <label>Polarization</label>
      <select
        value={polarization}
        onChange={(e) => setPolarization(e.target.value)}
      >
        <option value="VH">VH</option>
        <option value="VV">VV</option>
      </select>

      <label>Pass Direction</label>
      <select
        value={passDirection}
        onChange={(e) => setPassDirection(e.target.value)}
      >
        <option value="DESCENDING">Descending</option>
        <option value="ASCENDING">Ascending</option>
      </select>

      <label>Threshold</label>
      <input
        type="number"
        step="0.01"
        value={threshold}
        onChange={(e) => setThreshold(parseFloat(e.target.value))}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
      >
        Submit
      </button>
    </div>
  );
};

export default Step2Parameter;
