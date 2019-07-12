 //@include "json2.js"
sourcePath = "Z:\\projects\\schools\\SOT Mekanissa & Gulelle\\Yearbook\\SoT Mekanissa\\PSD\\";
var files = GetFiles(sourcePath, "*.psd");
var counter = 1;
var list = LoadJSON(sourcePath + "lastwords.json")
for(var i=0 ; i <= files.length ; i++){
    var psd = OpenPSD(files[i])
    var firstName = GetLayerByName( GetLayerByName(app.activeDocument,"FIELDS"),"FULL NAME")
    for(var j=0 ; j < list.length ; j++){
        if(list[j].Name === GetLayerText(firstName))
        {
            if(list[j]["Full Name"]){
                SetLayerText(firstName,list[j]["Full Name"])
            }            
        }
    }
    
    SaveAndClose(app.activeDocument);    
}

function SetLayerText(layer, text){
    layer.textItem.contents = text.toString();
}

function FixCasingMistakes(element){
    if(GetLayerText(element)){
        SetLayerText(element, GetLayerText(element).replace(/ *i /g , " I "));
        SetLayerText(element, GetLayerText(element).replace(/god/g , "God"));
        SetLayerText(element, GetLayerText(element).replace(/ sot /g , " SoT "));
    }  
}

function FixSpellingMistakes(element, text){
    if(GetLayerText(element)){
        SetLayerText(element, text);
    }
}

function GetLayerText(layer){
    if(layer.kind == LayerKind.TEXT)
        return layer.textItem.contents;
    else 
        return null
}

function GetFiles(path, type){
    path = path;
    return Folder(path).getFiles(type || "*.png");
}

function GetFolders(path){
    return Folder(path).getFiles(function(f) { return f instanceof Folder; });
}

function SavePSD(doc){
    doc.save();
}

function SaveAndClose(doc){
    doc.close(SaveOptions.SAVECHANGES)
}

function OpenPSD(PSDPath){
    return app.open(PSDPath);
}

function GetLayerByName(ref, layerName){
    var layer = ref.layers.getByName(layerName);
    return layer;
}

function SaveAsJPEG(path){
    var savePath = new File(path);
    var JPEGSaveOpts = new JPEGSaveOptions();
    JPEGSaveOptions.quality = 12;
    doc.saveAs(savePath, JPEGSaveOpts, true);
}

function ChangeToRGB(doc){
    doc.changeMode(ChangeMode.RGB)
}

function MoveLayer(layer,targetX,targetY){
    var Position = layer.bounds;
    Position[0] = targetX- Position[0];
    Position[1] = targetY - Position[1];
    layer.translate(-Position[0],-Position[1]);
}

function LoadJSON(path){
    var jsonFile = new File(path);
    jsonFile.open ('r');
    var jsonStr = jsonFile.read ();
    jsonFile.close();
    return JSON.parse(jsonStr);
}