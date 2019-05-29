//returns list of files under provided path
function GetFiles(path, type){
    path = path;
    return Folder(path).getFiles(type || "*.png");
}
//returns list of folders under provided path
function GetFolders(path){
    return Folder(path).getFiles(function(f) { return f instanceof Folder; });
}
//saves new changes on the same PSD
function SavePSD(doc){
    doc.save();
}
//saves the opened PSD as a JPEG image
function SaveAsJPEG(path){
    var savePath = new File(path);
    var JPEGSaveOpts = new JPEGSaveOptions();
    JPEGSaveOptions.quality = 12;
    doc.saveAs(savePath, JPEGSaveOpts, true);
}

//saves document as a new PSD
function SavePSD(destPath){
    var savePath = new File(destPath);
    var PSDSaveOptions = new PhotoshopSaveOptions();
    doc.saveAs(savePath, PSDSaveOptions, true);
}  

//Loads PSD from provided path
function LoadPSD(PSDPath){
    return app.open(PSDPath);
}

//returs the first layer with a matching name
function GetLayerByName(ref, layerName){
    var layer = ref.layers.getByName(layerName);
    return layer;
}

//changes color mode to RGB
function ChangeToRGB(doc){
    doc.changeMode(ChangeMode.RGB)
}

//returns the first layer text of the provided layer
function GetLayerText(layer){
    if(layer.kind == LayerKind.TEXT)
        return layer.textItem.contents;
    else 
        return null
}

//sets a layer with the provided text
function SetLayerText(layer, text, options){

    layer.textItem.contents = text.toString();
}

//loads and parses a JSON file into a JS object 
function LoadJSON(path){
    var jsonFile = new File(path);
    jsonFile.open ('r');
    var jsonStr = jsonFile.read ();
    jsonFile.close();
    return JSON.parse(jsonStr);
}

//pastes the content in the active layer
function Paste(){
    app.activeDocument.selection.selectAll()
    return app.activeDocument.paste ()
}

//copies the selected layer of the active document 
function copyImage(){
    app.activeDocument.activeLayer.copy ()
}

//Resizes an image to the given dimentions
function resizeImage(width, height){
    var heightValue = height ? UnitValue(height,"px") : null;
    var widthValue = width ? UnitValue(width,"px") : null;
    app.activeDocument.resizeImage (widthValue, heightValue, null, ResampleMethod.BICUBIC)
}

//move layer with specified pixels
function moveLayer(layer,targetX,targetY ){
    var Position = layer.bounds;
    Position[0] = targetX- Position[0];
    Position[1] = targetY - Position[1];

    layer.translate(-Position[0],-Position[1]);
}

function LayerExists(){
    //To-do 
}

function FileExists(){
    //To-do
}

function MoveToGroup(group, layer, placement){
    //To-do
}