sourcePath = "C:\\Users\\adonias\\Desktop\\SOT Bole";
var sections = GetFolders(sourcePath);

for(var i=0 ; i < sections.length ; i++){
    var psdFiles = GetFiles(sections[i],"*.PSD");
    for(var j=0 ; j < psdFiles.length ; j++){
        var doc = OpenPSD(psdFiles[j]);
        var fieldsGroup = GetLayerByName(doc, "FIELDS");
        var textLayers = fieldsGroup.layers;
        for(var k=0 ; k < textLayers.length ; k++){
            FixCasingMistakes(textLayers[k]); 
         }
        doc.close(SaveOptions.SAVECHANGES)
    }
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

function ChangeMode(doc, mode){
    switch(mode){
        case "RGB" :
            doc.changeMode(ChangeMode.RGB);
            break;
        case "CMYK":
            doc.changeMode(ChangeMode.CMYK);
        default:
    }
}