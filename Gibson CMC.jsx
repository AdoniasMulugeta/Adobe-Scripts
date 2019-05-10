#include json2.js
var doc = app.activeDocument;
var layer = doc.activeLayer;

var sourcePath = doc.path
var images = getFiles(sourcePath);
var templateDocument = doc;

var saveName = "";
var destPath = sourcePath;
var counter = 1;
var sections = Folder(sourcePath).getFiles (function(f) { return f instanceof Folder; });

for(var j=0 ; j< sections.length ; j++){
    var folders = Folder(sections[j]).getFiles (function(f) { return f instanceof Folder; });
    for(var i=0 ; i < folders.length ; i++){
        var casualRegex = new RegExp('casual');
        var gownRegex = new RegExp('gown');
        var babyRegex = new RegExp('baby');

        var casualPhoto = Folder(folders[i]).getFiles(casualRegex)
        var gownPhoto = Folder(folders[i]).getFiles(gownRegex)
        var babyPicture = Folder(folders[i]).getFiles(babyRegex)

        var list = loadJson (folders[i]+ "/lastword.json")

        var casualGroup = doc.layerSets.getByName ("CASUAL")
        var gownGroup = doc.layerSets.getByName ("GOWN")
        var babyGroup = doc.layerSets.getByName ("BABY")
        var textGroup = doc.layerSets.getByName ("FIELDS")
        var whiteColor = new SolidColor();
        whiteColor.rgb.red = 255;
        whiteColor.rgb.green = 255;
        whiteColor.rgb.blue = 255;
        var hasBaby = false;
        var hasCasual = false;
        var hasGown = false;
        var hasLastword = false;
        //Init();
        //-----------------------------------------------------------
        if(casualPhoto[0]){
            doc = app.open(casualPhoto[0]);
            resizeImage(2539, null);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var casualLayer = pasteIntoLayer()
            //translateLayer(casualLayer, 600, 0);
            casualLayer.move(casualGroup, ElementPlacement.PLACEATEND)
            hasCasual= true;
        }
        //-----------------------------------------------------------
        if(gownPhoto[0]){
            doc = app.open(gownPhoto[0]);
            resizeImage(null, 963);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var gownLayer = pasteIntoLayer ();
            gownLayer.move(gownGroup, ElementPlacement.PLACEATBEGINNING)
            moveLayer(gownLayer, 135, 346);
            hasGown = true;
        }


        //-----------------------------------------------------------
        if(babyPicture[0]){
            doc = app.open(babyPicture[0]);
            resizeImage(null, 675);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var babyLayer = pasteIntoLayer ();
            babyLayer.move(babyGroup, ElementPlacement.PLACEATBEGINNING)
            moveLayer(babyLayer, 153, 1112)
            hasBaby = true;
        }
      populateTexts (list)
      destPath = folders[i]
      savePSD (list["Name"],sections[j])
       //saveJPEG (list["fullname"]);

       layer = templateDocument.activeLayer;

        if(hasCasual) casualLayer.remove();
        if(hasGown) gownLayer.remove();
        if(hasBaby) babyLayer.remove();
    }
}



function savePSD(name, dest){
    var savePath = new File(dest+"/"+name+".psd");
    var PSDSaveOptions = new PhotoshopSaveOptions();
    doc.saveAs(savePath, PSDSaveOptions, true);
}
function saveJPEG(name){
    var savePath = new File(destPath+name);
    var JPEGSaveOpts = new JPEGSaveOptions();
    JPEGSaveOptions.quality = 12;
    doc.saveAs(savePath, JPEGSaveOpts, true);
}
function copyImage(){
    doc.activeLayer.copy ()
    saveName = doc.name;
}
function moveLayer(layer,targetX,targetY ){
    var Position = layer.bounds;
    Position[0] = targetX- Position[0];
    Position[1] = targetY - Position[1];

    layer.translate(-Position[0],-Position[1]);
}
function translateLayer(layer , x , y){
    layer.translate (600 , 0)
}
function resizeImage(width, height){
    var heightValue = height ? UnitValue(height,"px") : null;
    var widthValue = width ? UnitValue(width,"px") : null;
    doc.resizeImage (widthValue, heightValue, null, ResampleMethod.BICUBIC)
}
function getFiles(path){
    return Folder(path).getFiles("*.png");
}
function pasteIntoLayer(layer){
    if(doc.artLayers.getByName ("temp")){
       layer = doc.artLayers.getByName ("temp");
       doc.selection.selectAll()
       return doc.paste ()
    }
}
function Init(){
     //doc = app.documents.getByName ("template.psd")
     layer = doc.artLayers.getByName ("casual")
     var selection01 = doc.selection.selectAll()
     doc.selection.clear();
     doc.selection.deselect();
     app.preferences.rulerUnits = Units.PIXELS;
}
function setActiveLayer(layerName){
    layer = doc.artLayers.getByName (layerName);
}
function loadJson(path){
    var jsonFile = new File(path);
    jsonFile.open ('r');
    var jsonStr = jsonFile.read ();
    jsonFile.close();
    return JSON.parse(jsonStr);
}
function replaceText (layerName, text, size){
    try{
       var textItem = textGroup.artLayers.getByName (layerName).textItem;
       textItem.contents = text || "";
       textItem.font=  "Nexa Light";
       //textItem.width = new UnitValue(800,"px");
       textItem.size = new UnitValue(size || 10,"px");
       textItem.color = whiteColor;
    }
    catch(error){
        console.log(error)
    }
}
function populateTexts(list){
    replaceText ("NAME",list["Name"]);
    replaceText ("NICK NAME",list["Nick Name"]);
    replaceText ("FREQUENT WORDS",list["Frequently used word"]);
    replaceText ("ROLE MODEL",list["Role model"]);
    replaceText ("FED UP WITH",list["Fed up with"]);
    replaceText ("QUOTE",list["Favorite quote"]);
    replaceText ("NEVER FORGET",list["Will never forget"]);
    replaceText ("ADDICTED TO",list["Addicted to"]);
    replaceText ("3 WORDS",list["Senior year in 3 words"]);
    replaceText ("IN 10 YEARS ",list["You in 2029"]);
    replaceText ("LAST WORD", list["Last word"]);
    replaceText ("PHONE",list["Phone Number"]);
    replaceText ("EMAIL",list["Email"]);
    replaceText ("PAGE NUMBER",counter++,14);
}


