import React, { useState } from "react";
import Step1Area from "./Step1Area";
import Step2Parameter from "./Step2Parameter";
import Step3Result from "./Step3Result";

const Sidebar: React.FC<{
  setGeojson: (geojson: GeoJSON.FeatureCollection) => void;
}> = ({ setGeojson }) => {
  const [step, setStep] = useState(1);
  const [geometry, setGeometry] = useState<GeoJSON.Geometry | null>(null);
  const [result, setResult] = useState<any>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Analisis Banjir</h2>

      {step === 1 && (
        <Step1Area
          onNext={(geom, geojson) => {
            setGeometry(geom);
            setGeojson(geojson);
            setStep(2);
          }}
        />
      )}

      {step === 2 && geometry && (
        <Step2Parameter
          geometry={geometry}
          onBack={() => setStep(1)}
          onNext={(res) => {
            setResult(res);
            setStep(3);
          }}
        />
      )}

      {step === 3 && result && (
        <Step3Result result={result} onBack={() => setStep(2)} />
      )}
    </div>
  );
};

export default Sidebar;
