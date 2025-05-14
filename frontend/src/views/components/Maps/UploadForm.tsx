import React, { useState } from "react";
import shp from "shpjs";
import { postFloodAnalysis } from "../../../api/gee";

type Props = {
  setGeojson: (geojson: GeoJSON.FeatureCollection) => void;
};

const UploadForm: React.FC<Props> = ({ setGeojson }) => {
  const [file, setFile] = useState<File | null>(null);
  const [beforeStart, setBeforeStart] = useState("");
  const [beforeEnd, setBeforeEnd] = useState("");
  const [afterStart, setAfterStart] = useState("");
  const [afterEnd, setAfterEnd] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;

    let geojson: GeoJSON.FeatureCollection;
    if (file.name.endsWith(".geojson") || file.name.endsWith(".json")) {
      const text = await file.text();
      geojson = JSON.parse(text);
    } else {
      const arrayBuffer = await file.arrayBuffer();
      geojson = await shp(arrayBuffer);
    }

    const payload = {
      geometry: geojson.features[0].geometry, // hanya 1 polygon
      before_start: beforeStart,
      before_end: beforeEnd,
      after_start: afterStart,
      after_end: afterEnd,
      polarization: "VH",
      pass_direction: "DESCENDING",
      difference_threshold: 1.25,
    };

    const result = await postFloodAnalysis(payload);
    console.log(result); // log analytics data

    setGeojson({
      type: "FeatureCollection",
      features: [geojson.features[0]], // tampilkan area input
    });
  };

  return (
    <div className="space-y-2 p-4">
      <input type="file" accept=".geojson,.zip" onChange={handleFile} />
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
      <button
        onClick={handleSubmit}
        className="bg-blue-500 px-3 py-1 rounded text-white"
      >
        Submit
      </button>
    </div>
  );
};

export default UploadForm;
