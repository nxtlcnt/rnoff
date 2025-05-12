import ee
import os
import json
import re
from datetime import datetime

# Initialize Earth Engine
key_json_str = os.getenv("EE_PRIVATE_KEY_JSON")
service_account = os.getenv("EE_SERVICE_ACCOUNT")

if not key_json_str or not service_account:
    raise RuntimeError("Missing Earth Engine credentials in environment variables.")

# Fix and parse the JSON string 
try:
    # Parse the JSON with all escapes properly handled
    # First, try direct parsing
    key_json = json.loads(key_json_str)
    
    # Extract the private key and fix the formatting
    private_key = key_json['private_key']
    
    # Handle various escaping issues in the private key
    private_key = private_key.replace('\\n', '\n')
    
    # Print for debugging (remove in production)
    print("First 50 chars of private key after formatting:", private_key[:50])
    
    # Initialize Earth Engine with the formatted private key
    credentials = ee.ServiceAccountCredentials(
        service_account,
        key_data=private_key
    )
    
    ee.Initialize(credentials)
    print("Earth Engine initialized successfully")
    
except Exception as e:
    print(f"Error initializing Earth Engine: {str(e)}")
    # Try alternative approach with a temporary file
    try:
        import tempfile
        
        # Create a temporary file with the credentials
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json') as temp_file:
            temp_file.write(key_json_str)
            temp_path = temp_file.name
        
        # Initialize with the file path instead
        ee.Initialize(
            ee.ServiceAccountCredentials(service_account, key_file=temp_path)
        )
        print("Earth Engine initialized with temp file approach")
        
        # Clean up the temporary file
        import os
        os.unlink(temp_path)
    except Exception as e2:
        raise RuntimeError(f"All Earth Engine initialization methods failed. Last error: {str(e2)}")

def analyze_flood(geometry, before_start, before_end, after_start, after_end,
                  polarization, pass_direction, threshold):
    aoi = ee.Geometry(geometry)

    # Sentinel-1 preprocessing
    collection = (ee.ImageCollection('COPERNICUS/S1_GRD')
                  .filter(ee.Filter.eq('instrumentMode', 'IW'))
                  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', polarization))
                  .filter(ee.Filter.eq('orbitProperties_pass', pass_direction))
                  .filterBounds(aoi)
                  .select(polarization))

    before = collection.filterDate(before_start, before_end).mosaic().clip(aoi).focal_mean(50, 'circle', 'meters')
    after = collection.filterDate(after_start, after_end).mosaic().clip(aoi).focal_mean(50, 'circle', 'meters')

    # Difference analysis
    difference = after.divide(before)
    difference_binary = difference.gt(threshold)

    # Mask permanent water
    swater = ee.Image('JRC/GSW1_0/GlobalSurfaceWater').select('seasonality')
    swater_mask = swater.gte(10).updateMask(swater.gte(10))
    flooded = difference_binary.where(swater_mask, 0).updateMask(difference_binary)

    # Filter noise and slope
    flooded = flooded.updateMask(flooded.connectedPixelCount().gte(8))
    slope = ee.Algorithms.Terrain(ee.Image('WWF/HydroSHEDS/03VFDEM')).select('slope')
    flooded = flooded.updateMask(slope.lt(5))

    # Flood extent (hectares)
    flood_area = (flooded
                  .multiply(ee.Image.pixelArea())
                  .reduceRegion(ee.Reducer.sum(), aoi, 10, bestEffort=True)
                  .getNumber(polarization)
                  .divide(10000).round())

    # Population exposure
    pop = ee.Image('JRC/GHSL/P2016/POP_GPW_GLOBE_V1/2015').clip(aoi)
    pop_exp = pop.updateMask(flooded.reproject(pop.projection())).updateMask(pop)
    pop_total = pop_exp.reduceRegion(ee.Reducer.sum(), aoi, 250, maxPixels=1e9).getNumber('population_count').round()

    # MODIS land cover
    LC = (ee.ImageCollection('MODIS/006/MCD12Q1')
          .filterDate('2014-01-01', after_end)
          .sort('system:index', False)
          .select("LC_Type1")
          .first()
          .clip(aoi))

    modis_proj = LC.projection()
    flood_res = flooded.reproject(modis_proj)

    # Affected cropland
    cropmask = LC.eq(12).bitwiseOr(LC.eq(14))
    cropland = LC.updateMask(cropmask)
    crop_aff = flood_res.updateMask(cropland)
    crop_area = crop_aff.multiply(ee.Image.pixelArea())
    crop_ha = crop_area.reduceRegion(ee.Reducer.sum(), aoi, 500, maxPixels=1e9).getNumber(polarization).divide(10000).round()

    # Affected urban
    urban = LC.updateMask(LC.eq(13))
    urban_aff = flood_res.updateMask(urban)
    urban_area = urban_aff.multiply(ee.Image.pixelArea())
    urban_ha = urban_area.reduceRegion(ee.Reducer.sum(), aoi, 500, bestEffort=True).getNumber('LC_Type1').divide(10000).round()

    return {
        "flood_area_ha": flood_area.getInfo(),
        "exposed_population": pop_total.getInfo(),
        "affected_cropland_ha": crop_ha.getInfo(),
        "affected_urban_ha": urban_ha.getInfo(),
        "date_range": {"before": [before_start, before_end], "after": [after_start, after_end]}
    }