﻿//@include "json2.js"
var doc = app.activeDocument;
var layer = doc.activeLayer;

var sourcePath = doc.path
var images = getFiles(sourcePath);
var templateDocument = doc;

var saveName = "";
var destPath = sourcePath;
var pageNumberCounter = 1;
var sections = Folder(sourcePath).getFiles (function(f) { return f instanceof Folder; });

for(var j=0 ; j< sections.length ; j++){
    var folders = Folder(sections[j]).getFiles (function(f) { return f instanceof Folder; });
    for(var i=0 ; i < folders.length ; i++){
        var list = LoadJson (folders[i]+ "/lastword.json")
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
            var casualLayer = Paste();
            //translateLayer(casualLayer, 600, 0);
            casualLayer.move(casualGroup, ElementPlacement.PLACEATBEGINNING)
            hasCasual= true;
        }
        //-----------------------------------------------------------
        if(gownPhoto[0]){
            doc = app.open(gownPhoto[0]);
            resizeImage(null, 1337);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var gownLayer = Paste ();
            gownLayer.move(gownGroup.artLayers.getByName("mask"), ElementPlacement.PLACEBEFORE)
            moveLayer(gownLayer, 0 ,357);
            hasGown = true;
        }


        //-----------------------------------------------------------
        if(babyPicture[0]){
            doc = app.open(babyPicture[0]);
            resizeImage(740, null);
            copyImage();
            doc.close(SaveOptions.DONOTSAVECHANGES);
            doc = templateDocument;
            var babyLayer = Paste ();
            babyLayer.move(babyGroup.artLayers.getByName("mask"), ElementPlacement.PLACEBEFORE)
            moveLayer(babyLayer, 0, 274)
            hasBaby = true;
        }

        destPath = folders[i]
        SavePSD (list["name"])
        saveJPEG (list["name"]);
    
        layer = templateDocument.activeLayer;
        
        if(hasCasual) casualLayer.remove();
        if(hasGown) gownLayer.remove();
        if(hasBaby) babyLayer.remove();
        pageNumberCounter++
        
    }
}

function SavePSD(name, dest){
    var savePath = new File(destPath+name);
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
function Paste(){
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
function LoadJson(path){
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
       textItem.font=  "Dina's Handwriting";
       //textItem.width = new UnitValue(800,"px");
       textItem.size = new UnitValue(size || 10,"px");
       textItem.color = whiteColor;
    }
    catch(error){
        console.log(error)
    }
}
function populateTexts(list){
    list.phone = list && list.phone.toString().length === 9 ? "0"+list.phone : list.phone;
    placeText ("NAME",list["name"])
    placeText ("NICK_NAME",list["nickname"])
    placeText ("OBSSESSED_WITH",list["obssessed"])
    placeText ("3_WORDS",list["senior year 3 words"])
    placeText ("PHOBIA",list["phobia"])
    placeText ("FREQUENT",list["frequent words"])
    placeText ("QUOTE",list["quote"])
    placeText ("ROLE_MODEL",list["role model"])
    placeText ("UNFORGETTABLE",list["unforgettable moment"])
    placeText ("AMBITION",list["ambition"])
    placeText ("10_YEARS",list["10 years"])
    placeText ("LASTWORD",list["last word"])
    placeText ("CONTACT",list.phone + list["contact info"])
    placeText ("PAGE NUMBER",pageNumberCounter, 24)
    
}

