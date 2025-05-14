import ee
import os
import json
from datetime import datetime
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

# Initialize Earth Engine
key_json_str = os.getenv("EE_PRIVATE_KEY_JSON")
service_account = os.getenv("EE_SERVICE_ACCOUNT")

if not key_json_str or not service_account:
    raise RuntimeError("Missing Earth Engine credentials in environment variables.")

try:
    key_json = json.loads(key_json_str)
    private_key = key_json['private_key'].replace('\\n', '\n')
    credentials = ee.ServiceAccountCredentials(service_account, key_data=private_key)
    ee.Initialize(credentials)
except Exception:
    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json') as temp_file:
        temp_file.write(key_json_str)
        temp_path = temp_file.name
    ee.Initialize(ee.ServiceAccountCredentials(service_account, key_file=temp_path))
    os.unlink(temp_path)

# Helper to safely extract number from reduceRegion dictionary
def safe_get_number(result, key):
    return ee.Algorithms.If(
        result.contains(key),
        result.getNumber(key),
        ee.Number(0)
    )

def analyze_flood(geometry, before_start, before_end, after_start, after_end,
                  polarization, pass_direction, threshold):
    aoi = ee.Geometry(geometry)

    # Sentinel-1 preprocessing
    collection = (ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.eq('instrumentMode', 'IW'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', polarization))
        .filter(ee.Filter.eq('orbitProperties_pass', pass_direction))
        .filter(ee.Filter.eq('resolution_meters', 10))
        .filterBounds(aoi)
        .select(polarization))

    # Check if collections are empty before proceeding
    before_collection = collection.filterDate(before_start, before_end)
    after_collection = collection.filterDate(after_start, after_end)
    
    before_count = before_collection.size().getInfo()
    after_count = after_collection.size().getInfo()
    
    if before_count == 0:
        raise ValueError(f"No images found for before period: {before_start} to {before_end}")
    if after_count == 0:
        raise ValueError(f"No images found for after period: {after_start} to {after_end}")
        
    # Create mosaic images and apply focal mean filtering
    before = before_collection.mosaic().clip(aoi)
    after = after_collection.mosaic().clip(aoi)
    
    before = before.focal_mean(50, 'circle', 'meters')
    after = after.focal_mean(50, 'circle', 'meters')

    # Make sure both images are valid before division
    before_safe = before.unmask(0.001)
    after_safe = after.unmask(0.001)
    
    # Difference and thresholding
    difference = after_safe.divide(before_safe)
    difference_binary = difference.gt(threshold)

    # Mask permanent water
    swater = ee.Image('JRC/GSW1_0/GlobalSurfaceWater').select('seasonality')
    swater_mask = swater.gte(10).updateMask(swater.gte(10))
    flooded = difference_binary.where(swater_mask, 0).updateMask(difference_binary)

    # Filter noise and slope
    flooded = flooded.updateMask(flooded.connectedPixelCount().gte(8))
    slope = ee.Algorithms.Terrain(ee.Image('WWF/HydroSHEDS/03VFDEM')).select('slope')
    flooded = flooded.updateMask(slope.lt(5))

    # Flood area (ha)
    flood_area_dict = flooded.multiply(ee.Image.pixelArea()) \
        .reduceRegion(ee.Reducer.sum(), aoi, 10, bestEffort=True)
    flood_area = ee.Number(safe_get_number(flood_area_dict, polarization)).divide(10000).round()

    # Population exposure
    pop = ee.Image('JRC/GHSL/P2016/POP_GPW_GLOBE_V1/2015').select('population_count').clip(aoi)
    pop_exp = pop.updateMask(flooded.reproject(pop.projection())).updateMask(pop)
    pop_total_dict = pop_exp.reduceRegion(ee.Reducer.sum(), aoi, 250, maxPixels=1e9)
    pop_total = ee.Number(safe_get_number(pop_total_dict, 'population_count')).round()

    # MODIS land cover
    LC = (ee.ImageCollection('MODIS/006/MCD12Q1')
        .filterDate('2014-01-01', after_end)
        .sort('system:index', False)
        .select("LC_Type1")
        .first()
        .clip(aoi))
    modis_proj = LC.projection()
    flood_res = flooded.reproject(modis_proj)

    # Cropland affected (class 12 & 14)
    cropmask = LC.eq(12).bitwiseOr(LC.eq(14))
    cropland = LC.updateMask(cropmask)
    crop_aff = flood_res.updateMask(cropland)
    crop_area = crop_aff.multiply(ee.Image.pixelArea())
    crop_area_dict = crop_area.reduceRegion(ee.Reducer.sum(), aoi, 500, maxPixels=1e9)
    crop_ha = ee.Number(safe_get_number(crop_area_dict, polarization)).divide(10000).round()

    # Urban affected (class 13)
    urban = LC.updateMask(LC.eq(13))
    urban_aff = flood_res.updateMask(urban)
    urban_area = urban_aff.multiply(ee.Image.pixelArea())
    urban_area_dict = urban_area.reduceRegion(ee.Reducer.sum(), aoi, 500, bestEffort=True)
    urban_ha = ee.Number(safe_get_number(urban_area_dict, 'LC_Type1')).divide(10000).round()

    return {
        "flood_area_ha": flood_area.getInfo(),
        "exposed_population": pop_total.getInfo(),
        "affected_cropland_ha": crop_ha.getInfo(),
        "affected_urban_ha": urban_ha.getInfo(),
        "date_range": {"before": [before_start, before_end], "after": [after_start, after_end]}
    }
