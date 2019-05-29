//@include "json2.js"
var doc = app.activeDocument;
var templateDocument = app.activeDocument;
sourcePath = "C:\\Users\\adonias\\Desktop\\SOT Bole";
var sections = GetFolders(sourcePath);
for(var i=0 ; i <= sections.length ; i++){
    var folders = GetFolders(sections[i]);
    for(var j=0 ; j < folders.length ; j++){
        var gownPicture = GetFiles(folders[j],/gown/);
        if(gownPicture && gownPicture.length){
            var list = LoadJSON (folders[j]+ "/lastword.json")
            var idLayer = GetLayerByName(GetLayerByName(doc, "TEXT"), "ID");
            var nameLayer = GetLayerByName(GetLayerByName(doc, "TEXT"), "NAME");
            var gownGroup = GetLayerByName(doc ,"GOWN");
            app.open(gownPicture[0]);
            resizeImage(2539, null);
            copyImage();
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            //app.activeDocument = templateDocument;
            var gownLayer = Paste ();
            gownLayer.move(gownGroup, ElementPlacement.PLACEATBEGINNING)
            
            SetLayerText(nameLayer, list.NAME)
            SetLayerText(idLayer, list.Section+list.ID.slice(8-11))
            
            ChangeToRGB(app.activeDocument)
            var fileName = list.Section+"#"+list.ID;
            SaveAsPSD(app.activeDocument,sourcePath+"\\"+ fileName)  
            //SaveAsJPEG(app.activeDocument, sourcePath+"\\"+list.ID+"#"+list.NAME") 
            gownLayer.remove()
        }
    }
}

function SetLayerText(layer, text){
    layer.textItem.contents = text.toString();
}

function ChangeToRGB(doc){
    doc.changeMode(ChangeMode.RGB)
}
function LoadJSON(path){
    var jsonFile = new File(path);
    jsonFile.open ('r');
    var jsonStr = jsonFile.read ();
    jsonFile.close();
    return JSON.parse(jsonStr);
}

function SaveAsJPEG(doc, path){
    var savePath = new File(path);
    var JPEGSaveOpts = new JPEGSaveOptions();
    JPEGSaveOptions.quality = 12;
    doc.saveAs(savePath, JPEGSaveOpts, true);
}

function SaveAsPSD(doc, path){
    var savePath = new File(path);
    var PSDSaveOptions = new PhotoshopSaveOptions();
    doc.saveAs(savePath, PSDSaveOptions, true);
} 

function GetLayerByName(ref, layerName){
    var layer = ref.layers.getByName(layerName);
    return layer;
}

function LoadJSON(path){
    var jsonFile = new File(path);
    jsonFile.open ('r');
    var jsonStr = jsonFile.read ();
    jsonFile.close();
    return JSON.parse(jsonStr);
}

function Paste(){
    app.activeDocument.selection.selectAll()
    return app.activeDocument.paste ()
}

function GetFolders(path){
    return Folder(path).getFiles(function(f) { return f instanceof Folder; });
}

function GetFiles(path, type){
    path = path;
    return Folder(path).getFiles(type || "*.png");
}

function copyImage(){
    app.activeDocument.activeLayer.copy ()
}

function resizeImage(width, height){
    var heightValue = height ? UnitValue(height,"px") : null;
    var widthValue = width ? UnitValue(width,"px") : null;
    app.activeDocument.resizeImage (widthValue, heightValue, null, ResampleMethod.BICUBIC)
}