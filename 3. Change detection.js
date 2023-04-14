/*______CHANGE DETECTION in GEE______*/

//____________ 1) Adding Surat city shapefile along with other classified images to earth engine_________

// Insert the Surat city shapefiles along with the classified images to the google earth engine from Assets
// Rename Surat city shapefile to ROI in imports
// Change "image_classified_2000" and "image_classified_2010" to "before" and "after" respectively for change detection

var before = image_classified_2000;
var after = image_classified_2010;

// To set the map at center.
Map.centerObject(ROI);
Map.addLayer(ROI);

// ___________ 2) Reclassify the classes and changing the areas to new classes to calculate change ____________________________

// Reclassify from 0-3 to 1-4
var beforeClasses = before.remap([0, 1, 2, 3, 4], [1, 2, 3, 4, 5]);
var afterClasses = after.remap([0, 1, 2, 3, 4], [1, 2, 3, 4, 5]);

// Show all changed areas
var changed = afterClasses.subtract(beforeClasses).neq(0).clip(ROI);
Map.addLayer(changed, {min:0, max:1, palette: ['white', 'red']}, 'Change');

//____________ 3) Calculating Transition matrix _____________________________

var merged = beforeClasses.multiply(100).add(afterClasses).rename('transitions');

// Use a frequency Histogram to get a pixel count per class
var transitionMatrix = merged.reduceRegion({
  reducer: ee.Reducer.frequencyHistogram(), 
  geometry: ROI,
  maxPixels: 1e13,
  scale:30,
});
// This prints number of pixels for each class transition
print(transitionMatrix.get('transitions'), 'Transition Matrix');

// we used group reducer to calculate the area of each class transition

// Divide by 1e6 to get the area in sq.km.
var areaImage = ee.Image.pixelArea().divide(1e6).addBands(merged);
// Calculate Area by each Transition Class
// using a Grouped Reducer
var areas = areaImage.reduceRegion({
      reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'transitions',
    }),
    geometry: ROI,
    scale: 30,
    maxPixels: 1e13
    }); 
    
print(areas)

// Printing the Transition areas in the console for clear results
var classAreas = ee.List(areas.get('groups'));
var classAreaLists = classAreas.map(function(item) {
      var areaDict = ee.Dictionary(item);
      var classNumber = ee.Number(areaDict.get('transitions')).format();
      var area = ee.Number(areaDict.get('sum')).round();
      return ee.List([classNumber, area]);
    });
var classTransitionsAreaDict = ee.Dictionary(classAreaLists.flatten());
print(classTransitionsAreaDict);

//To calculate the transition matrix of 2000 and 2010, the same can be reproduced by taking 'image_classified_2010' as 'before' and 'image_classified_2020' as 'after'.