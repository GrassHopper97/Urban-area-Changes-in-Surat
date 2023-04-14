/*______RANDOM FOREST Land Use Land Cover Classification (LULC)______*/

//_________1) Create Training Data__________
var tag = 'Class';
var bands = ['SR_B1','SR_B2','SR_B3','SR_B4','SR_B5','SR_B7'];
var input = landsat7_2000.select(bands);

var training = Water.merge(Builtup).merge(Agriculture).merge(Barrenland).merge(Vegetation);
print(training);

//_______2) Overlay the points on the image to get training_______
var trainImage = input.sampleRegions({
  collection: training,
  properties: [tag],
  scale: 30
}).randomColumn();

var trainSet = trainImage.filter(ee.Filter.lessThan('random', 0.8));
var testSet = trainImage.filter(ee.Filter.greaterThanOrEquals('random',0.8));

//Print these variables to see how much training and testing data you are using
print('Samples n =', trainImage.aggregate_count('.all'));
print('Training n =', trainImage.aggregate_count('.all'));
print('Testing n =', testSet.aggregate_count('.all'));

//_________3) Random Forest  Classification__________//

//Run the RF model using 300 trees and 5 randomly selected predictors per split ("(300,5)"). 
//Train using bands and land cover property and pull the land cover property from classes
var classifier = ee.Classifier.smileRandomForest(300,5).train({ 
features: trainSet,
classProperty: tag,
inputProperties: bands
});

var landcoverPalette = [
  '#0c2c84', //water (0)
  '#e31a1c', //builtup (1)
  '#8fce00', //vegetation (4)
  '#f1c232', //agriculture (2)
  '#ce7e00', //barrenland (3)
];

//Classify the image and add it to the map
var classified = input.classify(classifier);
print(classified.getInfo());

Map.addLayer(classified, {palette: landcoverPalette, min: 0, max:4}, 'LULC 2000 Classification')

//_________4) Test the accuracy of the model________

//Print Confusion Matrix and Overall Accuracy
var confusionMatrix = classifier.confusionMatrix();
print('Confusion matrix: ', confusionMatrix);
print('Training Overall Accuracy: ', confusionMatrix.accuracy());
var kappa = confusionMatrix.kappa();
print('Training Kappa', kappa);
 
var validation = testSet.classify(classifier);
var testAccuracy = validation.errorMatrix(tag, 'classification');
print('Validation Error Matrix RF: ', testAccuracy);
print('Validation Overall Accuracy RF: ', testAccuracy.accuracy());
var kappa1 = testAccuracy.kappa();
print('Validation Kappa', kappa1);

//Apply the trained classifier to the image
 var classified = landsat7_2000.select(bands).classify(classifier);

//________5) Creating a legend for LULC Visualisation________//

//Set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
//Create legend title
var legendTitle = ui.Label({
  value: 'Classification Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
//Add the title to the panel
legend.add(legendTitle);
 
//Create and style 1 row of the legend.
var makeRow = function(color, names) {
 
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
      
      var description = ui.Label({
        value: names,
        style: {margin: '0 0 5px 6px'}
      });
 
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};

//Identify palette and names with the legend colors
var palette =['0c2c84', 'e31a1c', '8fce00', 'f1c232','ce7e00']; 
var names = ['Water','Built up','Vegetation','Cropland','Barren land'];
for (var i = 0; i < 5; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }  

//Add legend to map
Map.add(legend);

//______ 6) Calculating the area of each class_________
var areaImage = ee.Image.pixelArea().addBands(classified)

var areas = areaImage.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField:1,
    groupName:'class'
  }),
  geometry:ROI,
  scale:500,
  maxPixels : 1e10
  
})

print (areas)

var classAreas = ee.List(areas.get('groups'))

var classAreaLists = classAreas.map(function(item){
  var areaDict = ee.Dictionary(item)
  var classNumber = ee.Number(areaDict.get('class')).format()
  var area = ee.Number(
    areaDict.get('sum')).divide(1000000).round()
    return ee.List([classNumber, area])
})

var result = ee.Dictionary(classAreaLists.flatten())
print (result)

// ________ 7) Export classified map to drive Google_________
 Export.image.toDrive({
   image: classified,
   description: 'Landsat_Classified_RF_2001',
   folder:'Classified_Image',
   crs: 'EPSG: 4326',
   scale:30,
   region: ROI,
   fileFormat:'GeoTIFF',
   maxPixels: 1e13,
 })
