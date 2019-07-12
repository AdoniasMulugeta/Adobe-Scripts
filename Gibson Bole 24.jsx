#include json2.js
var doc = app.activeDocument;
var layer = doc.activeLayer;

var sourcePath = doc.path
var images = getFiles(sourcePath);
var templateDocument = doc;

var saveName = "";
var destPath = sourcePath;
var pageNumberCounter = 6;
var sections = Folder(sourcePath).getFiles (function(f) { return f instanceof Folder; });

for(var j=0 ; j< sections.length ; j++){
    var folders = Folder(sections[j]).getFiles (function(f) { return f instanceof Folder; });
    for(var i=0 ; i < folders.length ; i++){
        var list = loadJson (folders[i]+ "/lastword.json")
        var textGroup = doc.layerSets.getByName ("FIELDS")
        
        var whiteColor = new SolidColor();
        whiteColor.rgb.red = 255;
        whiteColor.rgb.green = 255;
        whiteColor.rgb.blue = 255;
        
        populateTexts (list)
        
        var casualPhoto = Folder(folders[i]).getFiles(/casual/)
        var gownPhoto = Folder(folders[i]).getFiles(/gown/)
        var babyPicture = Folder(folders[i]).getFiles(/baby/)
        
        

        var casualGroup = doc.layerSets.getByName ("CASUAL")
        var gownGroup = doc.layerSets.getByName ("GOWN")
        var babyGroup = doc.layerSets.getByName ("BABY")
        var textGroup = doc.layerSets.getByName ("FIELDS")
        
        //var casualLayer = casualGroup.artLayers.getByName ("casual layer")
        //var babyLayer = babyGroup.artLayers.getByName ("baby layer")
        //var gownLayer = gownGroup.artLayers.getByName ("gown layer")
        

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
            var casualLayer = paste();
            //translateLayer(casualLayer, 600, 0);
            casualLayer.move(casualGroup, ElementPlacement.PLACEATBEGINNING)
            hasCasual= true;
        }
        //-----------------------------------------------------------
        if(gownPhoto[0]){
            doc = app.open(gownPhoto[0]);
            resizeImage(null, 2010);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var gownLayer = paste ();
            gownLayer.move(gownGroup.artLayers.getByName("mask"), ElementPlacement.PLACEBEFORE)
            MoveLayer(gownLayer, 0 ,191);
            hasGown = true;
        }


        //-----------------------------------------------------------
        if(babyPicture[0]){
            doc = app.open(babyPicture[0]);
            resizeImage(753, null);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var babyLayer = paste ();
            babyLayer.move(babyGroup.artLayers.getByName("mask"), ElementPlacement.PLACEBEFORE)
            MoveLayer(babyLayer, 119, 125)
            hasBaby = true;
        }

        destPath = folders[i]
        savePSD (list["fullname"],sections[j])
        saveJPEG (list["fullname"]);
    
        layer = templateDocument.activeLayer;

        if(hasCasual) casualLayer.remove();
        if(hasGown) gownLayer.remove();
        if(hasBaby) babyLayer.remove();
        pageNumberCounter++
        
    }
}

function savePSD(name, dest){
    var savePath = new File(destPath+name+".PSD");
    var PSDSaveOptions = new PhotoshopSaveOptions();
    doc.saveAs(savePath, PSDSaveOptions, true);
}  
function saveJPEG(name){
    var savePath = new File(destPath+name+".JPG");
    var JPEGSaveOpts = new JPEGSaveOptions();
    JPEGSaveOptions.quality = 12;
    doc.saveAs(savePath, JPEGSaveOpts, true);
}
function copyImage(){
    doc.activeLayer.copy ()
    saveName = doc.name;
}
function MoveLayer(layer,targetX,targetY ){
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
function paste(){
       doc.selection.selectAll()
       return doc.paste ()
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
function placeText (layerName, text, size){
    try{
       var textItem = textGroup.artLayers.getByName (layerName).textItem;
       textItem.contents = text.toString() || "";
       textItem.font=  "Nexa Light";
       //textItem.width = new UnitValue(800,"px");
       textItem.size = new UnitValue(size || 8,"px");
       textItem.color = whiteColor;
    }
    catch(error){
        console.log(error)
    }
}
function populateTexts(list){
    placeText ("NAME",          list["full name"], 20)
    placeText ("NICK NAME",     list["nick name"])
    placeText ("FREQUENT WORDS",list["frequent word"])
    placeText ("ROLE MODEL",    list["role model"])
    placeText ("HOBBIES",       list["hobbies"])
    placeText ("AMBITION",      list["ambition in life"])
    placeText ("OBSSESED",      list["obsessed with"])
    placeText ("NEVER FORGET", list["unforgettable moment"])
     placeText ("IN 10 YEARS",   list["in 10 years"])
    placeText ("QUOTE",         list["favorite quote"])
    if(list["phone"] && list["phone"] .toString().length === 9) list["phone"] = "0"+list["phone"].toString();
    placeText ("PHONE",         list["phone"])
    placeText ("EMAIL",         list["email"])
    placeText ("LAST WORD",     list["last word"])
    placeText ("PAGE NUMBER",     pageNumberCounter, 24)
    
}

