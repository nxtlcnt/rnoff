import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";

type Props = {
  geojson: GeoJSON.FeatureCollection | null;
  tileUrl?: string;
};

const MapView: React.FC<Props> = ({ geojson, tileUrl }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      center: [110, -7],
      zoom: 5,
    });

    mapRef.current = map;

    map.on("load", () => {
      console.log("🗺️ Map loaded");

      if (tileUrl) {
        console.log("🌊 Adding GEE Tile URL:", tileUrl);

        if (!map.getSource("gee-flood")) {
          map.addSource("gee-flood", {
            type: "raster",
            tiles: [tileUrl],
            tileSize: 256,
          });

          map.addLayer({
            id: "gee-flood-layer",
            type: "raster",
            source: "gee-flood",
            paint: {},
          });
        }
      }
    });

    return () => {
      map.remove();
    };
  }, []); // ❗ tileUrl dihapus dari deps — hanya run sekali saat init

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geojson) return;

    const updateLayer = () => {
      if (map.getSource("flood")) {
        (map.getSource("flood") as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource("flood", {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: "flood-layer",
          type: "fill",
          source: "flood",
          paint: {
            "fill-color": "#ff0000",
            "fill-opacity": 0.5,
          },
        });
      }

      // Zoom ke bounds dari geojson
      const bounds = new maplibregl.LngLatBounds();
      geojson.features.forEach((feature) => {
        const coords = feature.geometry;
        if (coords.type === "Polygon") {
          coords.coordinates[0].forEach(([lng, lat]) =>
            bounds.extend([lng, lat])
          );
        } else if (coords.type === "MultiPolygon") {
          coords.coordinates.forEach((poly) =>
            poly[0].forEach(([lng, lat]) => bounds.extend([lng, lat]))
          );
        }
      });
      map.fitBounds(bounds, { padding: 30 });
    };

    if (map.isStyleLoaded()) {
      updateLayer();
    } else {
      map.once("load", updateLayer);
    }
  }, [geojson]);

  return <div className="h-[80vh] w-full" ref={mapContainer} />;
};

export default MapView;
