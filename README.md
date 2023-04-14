# Urban area Changes in Surat
Decadal Changes in the Urban Areas in Surat, Gujrat from 2000 to 2020
INTRODUCTION:
The project demonstrates the decade-wise expansion of urban areas in Surat municipal division of Gujrat. The entire process, starting from acquiring images to carrying out classification, detecting changes, visualizing using spectral indices and creating a dashboard, has been implemented on Google Earth Engine.

METHODOLOGY:
1.To analyze the land use and land cover classification of the study area, Landsat 7 and Landsat 8 datasets were utilized. The study period spans from 2000 to 2020, and three decades within this timeframe were observed for LULC in the years 2000, 2010, and 2020. For 2000 and 2010, the Tier-1, Level-2 Landsat 7 dataset was used, while for 2020, the Tier-1, Level-2 Landsat 8 dataset was used. The initial step involved atmospheric correction of the dataset, followed by applying a scaling factor to the image collection.
2.To classify the data, training samples were generated from the median image of the filtered dataset for each year. These samples were merged and randomly split into 80% for classification and 20% for testing.Five classes were taken, Waterbodies, BuiltUp areas, Barren Land, Crop Land and Vegetation. The Random Forest model was employed with 300 trees and 5 randomly selected predictors per split. The kappa statistic, with a threshold of over 0.8, was used to determine the accuracy of the classification. Post-classification, confusion matrix, error matrix, and kappa statistic were calculated. Finally, the variation in the area of each class was analyzed over the decades.
3.For the Change Detection analysis, a Transition Matrix was created to display the transitions between each class. The changes in the classes were analyzed for two decade-long periods: 2000-2010 and 2010-2020. The resultant images indicate the changed and unchanged pixels.
4.For visualization of the growth in the urban areas, several spectral indices were calculated and visualized. 
5.Spectral Indices used are IBI and BUI. This indices are calculated from other indices, NDVI,NDBI,SAVI and MNDWI. Landsat 7 data were used for 2000 and 2010, for 2020, Sentinel 2 MSI data were used.
6.Sentinel 2 was resampled down to 30m resolution.
7. Dashboard is created using Google Earth Engine.

SCALABILITY OF THE PROJECT:
1.The boundary can be modified as required for another area of interests.
2.One can choose a different image collection within Landsat or another satellite image collection, adjusting the scale accordingly.
3.If a different algorithm than smileRandomForest is preferred, the Google Earth Engine documentation can be consulted to learn how to use the chosen algorithm.
4.The number of classes or level of classification can be modified, and the training samples can be adjusted accordingly by modifying the code containing the geometries. The visualization parameters for the classified image can also be altered.
5. For more better results, one can take samples from images generated from using several indices and then take classes for classification.
6.For visualization of indices, one should check for threshold values for binarization.
7.The dashboard can be modified using the Google Earth Engine documentation as a guide.
