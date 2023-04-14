//Surat zone boundaries shapefile with .shx, .prj and .dbf files are loaded in Asset, from Asset it is loaded in the editor as ROI
//For the years 2000 and 2010, datastes of landsat 7 are used
//For the year 2020, datasets of Sentinel 2 are used

//----------------------------------For the Year 2000------------------------------------//
//Loading Landsat 7 imagaries for the year 2000
//Adjusted and clipped with the shapefile ROI
var L7 = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2")
          .filterDate('2000-01-01', '2000-12-31')
          .filterBounds(ROI)
          .filterMetadata('CLOUD_COVER', 'less_than', 30);
          
//Taking median image of from the collection of the 2000

var L7_2000_median_image = ee.Image(L7.median());
Map.addLayer(L7_2000_median_image,imageVisParam2);
//Calculatiing NDVI of Surat for year 2000
var ndvi_c_2000 = L7_2000_median_image
                  .normalizedDifference(['SR_B4','SR_B3']);
                  
//Binarizing NDVI and clipping it with Surat shapefile                  
var thrs_1 = 0.15
var ndvi_b_2000 = ndvi_c_2000.gt(thrs_1).rename('binary_NDvI_2000');

var  surt_ndvi_2000 = ndvi_b_2000.clip(ROI);
Map.addLayer(surt_ndvi_2000,{ min:0.5,max:1,palette:['blue','green']},'surat_ndvi_2000')

//Calculating NDBI of Surat for year 2000
var ndbi_c_2000 = L7_2000_median_image
            .normalizedDifference(['SR_B5','SR_B4']);
//Binarizing NDBI
var thrs_2 = -0.04
var ndbi_b_2000 = ndbi_c_2000.gt(thrs_2).rename('binary_NDbI_2000');

var  surt_ndbi_2000 = ndbi_b_2000.clip(ROI);
Map.addLayer(surt_ndbi_2000,{ min:0,max:1,palette:['blue','green']},'surat_ndbi_2000')

//Calculation BUI for Surat in 2000
var bu_2000 = surt_ndbi_2000.subtract(surt_ndvi_2000).rename("bu_2000")

Map.addLayer(bu_2000,{ min:-0.7,max:1,palette:['blue','cyan','grey','white']},'BU_2000')

//MNDWI Calculation
var mndwi_2000 = L7_2000_median_image.normalizedDifference (['SR_B2','SR_B5']).rename(['mndwi_2000']);

// Binarizing MNDWI
var thr = 0.05
var binary_0 = mndwi_2000.gt(thr).rename('binary_MNDWI');
var  surt_mndwi_2000 = binary_0.clip(ROI);
Map.addLayer(surt_mndwi_2000, { min:0,max:1,palette:['green','blue']},'MNDWI_B_2000')


//SAVI Calculation
var savi_2000 = L7_2000_median_image.expression (
  
'1.5*((NIR-RED)/(NIR+RED+0.5))', {
  'NIR':L7_2000_median_image.select ('SR_B4'),
  'RED':L7_2000_median_image.select ('SR_B3'),
   
}).rename('savi');
var saviVis = {'min':0.0, 'max':1, 'palette':['yellow', 'green']};

// Binarizing SAVI
var thr_1 = 0.18
var binary_00 = savi_2000.gt(thr_1).rename('binary_SAVI');
var  surt_savi_2000 = binary_00.clip(ROI);
Map.addLayer(surt_savi_2000, { min:0,max:1,palette:['green','blue']},'SAVI_B_2000')

//IBI Calculation
var ibi = surt_ndbi_2000.subtract((surt_savi_2000.add(surt_mndwi_2000)).divide(2)).divide(surt_ndbi_2000.add((surt_savi_2000.add(surt_mndwi_2000)).divide(2))).rename('ibi');
var ibi_surat_2000 = ibi.clip(ROI);
Map.addLayer(ibi_surat_2000, {min: 0, max:1, palette: ['white', 'red']}, 'IBI_2000');


//--------------------------------For the Year 2010-------------------------------------//

//Loading Landsat 7 imagaries for the year 2010
//Adjusted and clipped with the shapefile ROI
var L72 = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2")
        .filterDate('2010-01-01','2010-12-31')
        .filterBounds(ROI)
        .filterMetadata('CLOUD_COVER','less_than',30);
//

var L72_2010_median_image = ee.Image(L72.median());
Map.addLayer(L72_2010_median_image,imageVisParam2);
//Calculatiing NDVI of Surat for year 2010
var ndvi_c_2010 = L72_2010_median_image
                  .normalizedDifference(['SR_B4','SR_B3']);
                  
//Binarizing NDVI and clipping it with Surat shapefile  
var thrs_3 = 0.14
var ndvi_b_2010 = ndvi_c_2010.gt(thrs_3).rename('binary_NDvI_2010');
var  surt_ndvi_2010 = ndvi_b_2010.clip(ROI);
Map.addLayer(surt_ndvi_2010,{ min:0.5,max:1,palette:['blue','green']},'surat_ndvi_2010')

//Calculatiing NDBI of Surat for year 2010 
var ndbi_c_2010 = L72_2010_median_image
                  .normalizedDifference(['SR_B5','SR_B4']);
                  
//Binarizing NDVI and clipping it with Surat shapefile 
var thrs_4 = -0.04
var ndbi_b_2010 = ndbi_c_2010.gt(thrs_4).rename('binary_NDbI_2010');
var  surt_ndbi_2010 = ndbi_b_2010.clip(ROI);
Map.addLayer(surt_ndbi_2010,{ min:0,max:1,palette:['blue','green']},'surat_ndbi_2010')

//Calculation BUI for Surat in 2000
var bu_2010 = surt_ndbi_2010.subtract(surt_ndvi_2010).rename("bu_2000")
Map.addLayer(bu_2010,{ min:-0.7,max:1,palette:['blue','cyan','grey','white']},'BU_2010')

//MNDWI
var mndwi_2010 = L72_2010_median_image.normalizedDifference (['SR_B2','SR_B5']).rename(['mndwi_2010']);
//Binarizing it
var thr = 0
var binary_01 = mndwi_2010.gt(thr).rename('binary_MNDWI');
var  surt_mndwi_2010 = binary_01.clip(ROI);
Map.addLayer(surt_mndwi_2010, { min:0,max:1,palette:['green','blue']},'MNDWI_B_2010')

//SAVI
var savi_2010 = L72_2010_median_image.expression (
  
'1.5*((NIR-RED)/(NIR+RED+0.5))', {
  'NIR':L72_2010_median_image.select ('SR_B4'),
  'RED':L72_2010_median_image.select ('SR_B3'),
   
}).rename('savi');
var saviVis_1 = {'min':0.0, 'max':1, 'palette':['yellow', 'green']};
// Binary savi
var thr_1 = 0.18
var binary_001 = savi_2010.gt(thr_1).rename('binary_SAVI');
var  surt_savi_2010 = binary_001.clip(ROI);
Map.addLayer(surt_savi_2010, { min:0,max:1,palette:['green','blue']},'SAVI_B_2010')

//IBI
var ibi_1 = surt_ndbi_2010.subtract((surt_savi_2010.add(surt_mndwi_2010)).divide(2)).divide(surt_ndbi_2010.add((surt_savi_2010.add(surt_mndwi_2010)).divide(2))).rename('ibi_1');
var ibi_surat_2010 = ibi.clip(ROI);
Map.addLayer(ibi_surat_2010, {min: 0, max:1, palette: ['white', 'red']}, 'IBI_2010');


//--------------------------------For the Year 2020------------------------------------------//

//Loading Sentinel 2 datasets for the year 2020 and clipping it with the Shapefile
//Visual Parameters are set as the TCC set, ie. in the composition of Red, Green and Blue
var sen2 = ee.ImageCollection("COPERNICUS/S2")
Map.addLayer(ROI)
Map.centerObject(ROI, 10)

var dry = sen2.filterBounds(ROI).filterDate('2020-01-01','2020-12-31').sort('CLOUDY_PIXEL_PERCENTAGE', false).mosaic().clip(ROI)
Map.addLayer(dry,imageVisParam)
//var Green_sen2 = dry.select('B3')
//var SWIR_sen2 = dry.select('B11')

var ndwi_dry = dry.normalizedDifference(['B3','B8'])

Map.addLayer(ndwi_dry, { min:-1,max:1,palette:['red','blue']}, 'NDWI_2020')

//Calculation NDBI(Normalized Difference BuildUp Index)
//NDBI = (SWIR-NIR/SWIR+NIR),in Sentinel 2 B11 is SWIR band and B8 is NIR band
var ndbi_dry = dry.normalizedDifference(['B11','B8'])

// Binarize NDBI values using a threshold of 0 and Visualizing it
var threshold = 0;
var binary_1 = ndbi_dry.gt(threshold).rename('binary_NDBI');
Map.addLayer(binary_1, { min:0,max:1,palette:['green','blue']},'NDBI_d')
//Calculation NDVI(Normalized Difference Vegetation Index)
//NDVI = (NIR-RED/NIR+RED),in Sentinel 2 B4 is RED band and B8 is NIR band
var ndvi_dry = dry.normalizedDifference(['B8','B4'])

//Binarize NDVI values using a threshold of 0.4 and Visualizing it
var threshold_1 = 0.4;
var binary_2 = ndvi_dry.gt(threshold_1).rename('binary_NDvI');
Map.addLayer(binary_2,{ min:0,max:1,palette:['white','red']},'NDVI_d')
//Calculating BUI(Build-Up Index)
//BUI = (NDBI(binarized)-NDVI(binarized))
var Bui_20 = binary_1.subtract(binary_2);
Map.addLayer(Bui_20,{ min:-0.7,max:1,palette:['blue','cyan','grey','white']},'BUI_20')

//MNDWI(Modified Normalized Difference Water Index)for 2020 using Sentinel 2 datasets
//MNDWI = (Green-SWIR/Green+SWIR),in Sentinel 2 B3 is Green
var mndwi_2020 = dry.normalizedDifference(['B3','B11']); 

//Binaryzing MNDWI
var thr0 = 0.3
var binary_010 = mndwi_2020.gt(thr0).rename('binary_MNDWI_0');
Map.addLayer(binary_010, { min:0,max:1,palette:['green','blue']},'MNDWI_B_2020');

//SAVI(Soil Adjusted Vegetation Index)
//SAVI = ((1+L)*(NIR-RED)/(NIR+RED+L)), where L is 0.5
var savi_2020 = dry.expression (
  
 '1.5*((NIR-RED)/(NIR+RED+0.5))', {
   'NIR':dry.select ('B8'),
   'RED':dry.select ('B4'),
   
 }).rename('savi');
  
 var saviVis_2 = {'min':0.0, 'max':1, 'palette':['yellow', 'green']};

// // Binarized savi
 var thr_1 = 0.3
 var binary_002 = savi_2020.gt(thr_1).rename('binary_SAVI');
Map.addLayer(binary_002, { min:0,max:1,palette:['green','blue']},'SAVI_B_2020')
//Calculation of IBI
//IBI = ()
var ibi_2020 = binary_1.subtract((binary_002.add(binary_010)).divide(2)).divide(binary_1.add((binary_002.add(binary_010)).divide(2))).rename('ibi_1');
Map.addLayer(ibi_2020, {min: 0, max:1, palette: ['white', 'red']}, 'IBI_2020');



Export.image.toDrive({image:Bui_20,description:'BUI_2020',fileFormat:'GeoTIFF',scale:30,region:ROI});
Export.image.toDrive({image:bu_2000,description:'BUI_2000',fileFormat:'GeoTIFF',scale:30,region:ROI});
Export.image.toDrive({image:bu_2010,description:'BUI_2010',fileFormat:'GeoTIFF',scale:30,region:ROI});
Export.image.toDrive({image:ibi_surat_2010,description:'IBI_2010',fileFormat:'GeoTIFF',scale:30,region:ROI});
Export.image.toDrive({image:ibi_surat_2000,description:'IBI_2000',fileFormat:'GeoTIFF',scale:30,region:ROI});
Export.image.toDrive({image:ibi_2020,description:'IBI_2020',fileFormat:'GeoTIFF',scale:30,region:ROI})
