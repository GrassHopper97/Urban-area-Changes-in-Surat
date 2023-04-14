/*______Dowloading the satellite imagery in GEE______*/


//_____1) Adding the Surat city shapefile layer from Assets and renaming it as 'ROI'______

Map.addLayer(ROI);
Map.centerObject(ROI); //used to make sure the map recenters to ROI

/*_____2) Loading Landsat 7 for 2000 and 2010 and applying scaling factors________*/

var L7 = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2") 
.filterBounds(ROI);

// Surface reflectance function:
function maskL457sr(image) {
    var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111',
        2)).eq(0);
    var saturationMask = image.select('QA_RADSAT').eq(0);

    // Apply the scaling factors to the appropriate bands.
    var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-
        0.2);
    var thermalBand = image.select('ST_B6').multiply(0.00341802).add(
        149.0);

    // Replace the original bands with the scaled ones and apply the masks.
    return image.addBands(opticalBands, null, true)
        .addBands(thermalBand, null, true)
        .updateMask(qaMask)
        .updateMask(saturationMask);
}

//_______ Map the function over one year of 2000 data___________

var collection = L7.filterDate('2000-01-01', '2000-12-31').map(
    maskL457sr);
var landsat7_2000 = collection.median().clip(ROI);

Map.addLayer(landsat7_2000, {
    bands: ['SR_B3', 'SR_B2', 'SR_B1'],
    min: 0,
    max: 0.3
}, 'Landsat 7, 2000');

// _______ Map the function over one year of 2010 data_________
var collection1 = L7.filterDate('2010-01-01', '2010-12-31').map(
    maskL457sr);
var landsat7_2010 = collection1.median().clip(ROI);

Map.addLayer(landsat7_2010, {
    bands: ['SR_B3', 'SR_B2', 'SR_B1'],
    min: 0,
    max: 0.3
}, 'Landsat 7, 2010');


/*________ 3) Loading Landsat 8 for 2020 data_______*/

var L8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2") 
.filterBounds(ROI)

// Surface reflectance function:
function maskL457sr(image) {
    var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111',
        2)).eq(0);
    var saturationMask = image.select('QA_RADSAT').eq(0);

    // Apply the scaling factors to the appropriate bands.
    var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-
        0.2);
    var thermalBand = image.select('ST_B.*').multiply(0.00341802).add(
        149.0);

    // Replace the original bands with the scaled ones and apply the masks.
    return image.addBands(opticalBands, null, true)
        .addBands(thermalBand, null, true)
        .updateMask(qaMask)
        .updateMask(saturationMask);
}
// Map the function over one year of 2020 data.
var collection2 = L8.filterDate('2020-01-01', '2020-12-31').map(
    maskL457sr);
var landsat8_2020 = collection2.median().clip(ROI);

Map.addLayer(landsat8_2020, {
    bands: ['SR_B4', 'SR_B3', 'SR_B2'],
    min: 0,
    max: 0.3
}, 'Landsat 8, 2020');


/*______ 4) Exporting the images to the drive_______*/

Export.image.toDrive({
  image: landsat7_2000,
  description: 'Landsat_2001',
  folder:'Classified_Image',
  crs: 'EPSG: 4326',
  scale:30,
  region: ROI,
  fileFormat:'GeoTIFF',
  maxPixels: 1e13,
})

Export.image.toDrive({
  image: landsat7_2010,
  description: 'Landsat_2010',
  folder:'Classified_Image',
  crs: 'EPSG: 4326',
  scale:30,
  region: ROI,
  fileFormat:'GeoTIFF',
  maxPixels: 1e13,
})

Export.image.toDrive({
  image: landsat7_2020,
  description: 'Landsat_2020',
  folder:'Classified_Image',
  crs: 'EPSG: 4326',
  scale:30,
  region: ROI,
  fileFormat:'GeoTIFF',
  maxPixels: 1e13,
})