import React, { useState } from "react";
import MapView from "../components/Maps/MapView";
import Sidebar from "../components/Maps/Sidebar";

const Maps: React.FC = () => {
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(
    null
  );

  return (
    <div className="flex h-screen">
      <aside className="w-96 bg-white p-4 border-r overflow-y-auto">
        <Sidebar setGeojson={setGeojson} />
      </aside>
      <main className="flex-1">
        <MapView geojson={geojson} />
      </main>
    </div>
  );
};

export default Maps;
