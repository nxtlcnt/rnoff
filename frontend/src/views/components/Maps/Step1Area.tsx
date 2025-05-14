import { useState } from "react";
import shp from "shpjs";

const Step1Area = ({
  onNext,
}: {
  onNext: (geom: GeoJSON.Geometry, geojson: GeoJSON.FeatureCollection) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    let geojson;
    if (file.name.endsWith(".geojson") || file.name.endsWith(".json")) {
      const text = await file.text();
      geojson = JSON.parse(text);
    } else {
      const buffer = await file.arrayBuffer();
      geojson = await shp(buffer);
    }

    const geom = geojson.features[0].geometry;
    onNext(geom, geojson);
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Upload Area</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Step1Area;
