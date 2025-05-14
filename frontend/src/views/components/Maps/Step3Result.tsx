import {
  Waves,
  Users,
  Wheat,
  Building,
  Download,
  ArrowLeft,
} from "lucide-react";

const Step3Result = ({
  result,
  onBack,
}: {
  result: any;
  onBack: () => void;
}) => {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center text-sm text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <h3 className="text-lg font-semibold mb-4">Hasil Analisis</h3>

      <ul className="space-y-3">
        <li className="flex items-center gap-2">
          <Waves size={20} className="text-blue-600" />
          <span>Flood Area: {result.flood_area_ha} ha</span>
        </li>
        <li className="flex items-center gap-2">
          <Users size={20} className="text-rose-600" />
          <span>Exposed Population: {result.exposed_population}</span>
        </li>
        <li className="flex items-center gap-2">
          <Wheat size={20} className="text-green-600" />
          <span>Cropland Affected: {result.affected_cropland_ha} ha</span>
        </li>
        <li className="flex items-center gap-2">
          <Building size={20} className="text-purple-600" />
          <span>Urban Affected: {result.affected_urban_ha} ha</span>
        </li>
      </ul>

      <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        <Download size={18} />
        Download GeoJSON
      </button>
    </div>
  );
};

export default Step3Result;
