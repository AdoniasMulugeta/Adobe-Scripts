 //@include "json2.js"
var doc = app.activeDocument;
var layer = doc.activeLayer;

// var sourcePath = doc.path
var images = getFiles(sourcePath);
var templateDocument = doc;

var saveName = "";
var destPath = sourcePath;
var pageNumberCounter = 1;
var sections = Folder(sourcePath).getFiles (function(f) { return f instanceof Folder; });

for(var j=1 ; j< sections.length ; j++){
    var folders = Folder(sections[j]).getFiles (function(f) { return f instanceof Folder; });
    for(var i=3 ; i < folders.length ; i++){
        var list = LoadJSON (folders[i]+ "/lastword.json")
        var textGroup = doc.layerSets.getByName ("FIELDS")
        
        var whiteColor = new SolidColor();
        whiteColor.rgb.red = 255;
        whiteColor.rgb.green = 255;
        whiteColor.rgb.blue = 255;

        var blackColor = new SolidColor();
        blackColor.rgb.red = 0;
        blackColor.rgb.green = 0;
        blackColor.rgb.blue = 0;
        
        populateTexts (list)
        /*
        var casualPhoto = Folder(folders[i]).getFiles(/casual/)
        var gownPhoto = Folder(folders[i]).getFiles(/gown/)
        var babyPicture = Folder(folders[i]).getFiles(/baby/)
        
        

        var casualGroup = doc.layerSets.getByName ("CASUAL")
        var gownGroup = doc.layerSets.getByName ("GOWN")
        var babyGroup = doc.layerSets.getByName ("BABY")
        var textGroup = doc.layerSets.getByName ("FIELDS")
        

        var hasBaby = false;
        var hasCasual = false;
        var hasGown = false;
        var hasLastword = false;

        if(casualPhoto[0]){
            doc = app.open(casualPhoto[0]);
            resizeImage(null,3188);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var casualLayer = paste();
            moveLayer(casualLayer, 700,118);
            casualLayer.move(casualGroup, ElementPlacement.PLACEATBEGINNING)
            hasCasual= true;
        }
         if(gownPhoto[0]){
            doc = app.open(gownPhoto[0]);
            resizeImage(1155, null);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var gownLayer = paste();
            moveLayer(gownLayer, 180,112);
            gownLayer.move(gownGroup.artLayers.getByName("mask"), ElementPlacement.PLACEBEFORE)
            hasGown = true;
        }
        if(babyPicture[0]){
            doc = app.open(babyPicture[0]);
            resizeImage(886, null);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var babyLayer = paste ();
            babyLayer.move(babyGroup.artLayers.getByName("mask"), ElementPlacement.PLACEBEFORE)
            moveLayer(babyLayer, 1597, 1843)
            hasBaby = true;
        }
        */
        var ID = list.id ? list.id+"#" : "";
        var section = list.section ? list.section+"#" : "";
        var fullname = list.name ? list.name.split("/")[0] : "";
        var PSDPath = sections[j]+"/"+section+ID+fullname+".PSD";
        
        SavePSD (PSDPath)
    
        // layer = templateDocument.activeLayer;
        // if(hasCasual) casualLayer.remove();
        // if(hasGown) gownLayer.remove();
        // if(hasBaby) babyLayer.remove();
        // pageNumberCounter++;  
        
    }
}

function SavePSD(destPath){
    var savePath = new File(destPath);
    var PSDSaveOptions = new PhotoshopSaveOptions();
    doc.saveAs(savePath, PSDSaveOptions, true);
}  
function saveJPEG(){
    var savePath = new File(destPath);
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
function LoadJSON(path){
    var jsonFile = new File(path);
    jsonFile.open ('r');
    var jsonStr = jsonFile.read ();
    jsonFile.close();
    return JSON.parse(jsonStr);
}
function placeText (layerName, text, size, color){
    try{
       var textItem = textGroup.artLayers.getByName (layerName).textItem;
       if(text){
            textItem.contents = text.toString() || "";
       }
       if(color === "white"){
            textItem.color = whiteColor;
       }
       else if(color === "black"){
            textItem.color = blackColor;
       }
       textItem.size = new UnitValue(size || 9,"px"); 
    }
    catch(error){
        console.log(error)
    }
}
function populateTexts(list){
    // list["phone number"] = list["phone number"] && list["phone number"].toString().length === 9 ? "0"+list["phone number"] : list["phone number"];
    // if(!list["phone number"]){
    //     list["phone number"] = ""
    // }
    // placeText ("NAME",list["name"],30, "white" )
    // placeText ("NICK NAME",list["nick name"])
    placeText ("BIRTHDATE",list["birthdate"])
    // placeText ("HOROSCOPE",list["horoscope"])
    // placeText ("FREQUENT",list["frequently used words"])
    // placeText ("ROLE MODEL",list["role model"])
    // placeText ("3 WORDS",list["3 words"])
    // placeText ("FROM HIGHSCHOOL",list["who would you want to see"])
    // placeText ("BE REMEMBERED",list["be remembered"])
    // placeText ("10 YEARS",list["10 years"])
    // placeText ("QUOTE",list["favorite quote"])
    // placeText ("UNFORGETTEBLE",list["unforgettable moment"])
    // placeText ("PHONE",list["phone"])
    // placeText ("LASTWORD", list["last words"])
    // placeText ("PAGE NUMBER",pageNumberCounter, 14)
    
}

function ChangeToRGB(doc){
    doc.changeMode(ChangeMode.RGB)
}
