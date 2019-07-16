/**
 *  Written by Adonias Mulugeta
 *  July 2019
 *  mulugeta.adonias@gmail.com
 *  Yearbook Automation Script
 *  lib.jsx
 */

/**
 * returns list of files under the provided path
 * @param   {String}    path    the path for the files 
 * @param   {String}    type    filter for the type of files
 * @return  {[String]}          the list of files in that path
 */
function GetFiles(path, type){
    path = path;
    return Folder(path).getFiles(type || "*.*");
}

/**
 * returns list of folders under provided path 
 * @param {String} path the path for the files 
 * @return {[String]}   the list of folders in that path
 */
function GetFolders(path){
    return Folder(path).getFiles(function(f) { return f instanceof Folder; });
}

/**
 * saves changes of the document (updates the files not create new)
 * @param {String} doc the document to save
 */
function Save(doc){
    doc.save();
}

/**
 * saves the Document as a JPEG image
 * @param {String} path the path to save the new JPEG file to
 */
function SaveAsJPEG(path){
    var savePath = new File(path);
    var JPEGSaveOpts = new JPEGSaveOptions();
    JPEGSaveOptions.quality = 12;
    doc.saveAs(savePath, JPEGSaveOpts, true);
}

/**
 * saves document as a new PSD
 * @param {String} destPath the path to save the new PSD file to
 */
function SaveAsPSD(destPath){
    var savePath = new File(destPath);
    var PSDSaveOptions = new PhotoshopSaveOptions();
    doc.saveAs(savePath, PSDSaveOptions, true);
}  

/**
 * Loads PSD file from the provided path
 * @param {Stirng} PSDPath the path for the PSD file to open
 * @return {Document}      a reference to the new opened document
 */
function OpenPSD(PSDPath){
    var psd = null;
    if(FileExists(PSDPath)){
        psd = app.open(PSDPath);
    }
    return psd;
}

/**
 * returs the first layer to be found with a matching name
 * @param {layer} ref a reference to an artLayer to search the layer in
 * @param {String} layerName the name of the layer as it is showing in photoshop
 * @return {layer}           a reference to the layer if found , null if not found.
 */
function GetLayerByName(ref, layerName){
    var layer = null
    try{
        if(ref && layerName){
            layer  = ref.layers.getByName(layerName);
            if(layer === "No such element"){
                layer = null;
            }
        }    
    }
    catch(e){
        layer = null;
    }
    finally{
        return layer;
    }
}
/**
 * changes color mode to RGB
 * @param {Document} doc a reference to the document to change mode of
 */
function ChangeToRGB(doc){
    if(IsDocument(doc)){
        doc.changeMode(ChangeMode.RGB)
    }
}
/**
 * returns the text contents of the layer given
 * @param {layer} layer a reference to the layer to extract the text outof
 * @return {String}     the string contents of the layer if it has one , or null if it doesn't
 */
function GetLayerText(layer){
    if(layer.kind == LayerKind.TEXT)
        return layer.textItem.contents;
    else 
        return null
}
/**
 * sets the layer with the text
 * @param {layer} layer a reference to the layer  
 * @param {*} text the text you want to set the layer contents to
 * @param {*} options 
 */
function SetLayerText(layer, text, options){
    if(LayerExists(layer) && IsTextLayer(layer)){
        layer.textItem.contents = text.toString();
    }
    
}
/**
 * loads and parses a JSON file to a JS object 
 * @param {String} path path to the JSON File
 * @returns {[Object]}  array of JS Objects or null if parse failed
 */
function ParseJSON(path){
    var parsedJSON = null;
    try{
        var jsonFile = new File(path);
        jsonFile.open ('r');
        var jsonStr = jsonFile.read ();
        jsonFile.close();
        parsedJSON = JSON.parse(jsonStr);
    }
    catch(e){
        alert("Error Parsing JSON File!", e.message || "Error Parsing JSON");
    }
    finally{
        return parsedJSON;
    }
}

/**
 * pastes content in clipboard on to the active layer
 * @returns {layer} returns the layer where the new content was pasted into
 */
function Paste(){
    app.activeDocument.selection.selectAll()
    return app.activeDocument.paste ()
}

/**
 * copies the selected layer of the active document 
 */
function copyImage(){
    app.activeDocument.activeLayer.copy ()
}


function InsertToActiveLayer(file){
    // =======avoid bug in cs2 and maybe CS4 =================  
    var idslct = charIDToTypeID( "slct" );  
    var desc5 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
    var ref3 = new ActionReference();  
    var idChnl = charIDToTypeID( "Chnl" );  
    var idChnl = charIDToTypeID( "Chnl" );  
    var idRGB = charIDToTypeID( "RGB " );  
    ref3.putEnumerated( idChnl, idChnl, idRGB );  
    desc5.putReference( idnull, ref3 );  
    var idMkVs = charIDToTypeID( "MkVs" );  
    desc5.putBoolean( idMkVs, false );  
    executeAction( idslct, desc5, DialogModes.NO );  
        
    // Place in the file  
    var idPlc = charIDToTypeID( "Plc " );  
    var desc5 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
    desc5.putPath( idnull, new File( file ) );  
    var idFTcs = charIDToTypeID( "FTcs" );  
    var idQCSt = charIDToTypeID( "QCSt" );  
    var idQcsa = charIDToTypeID( "Qcsa" );  
    desc5.putEnumerated( idFTcs, idQCSt, idQcsa );  
    var idOfst = charIDToTypeID( "Ofst" );  
    var desc6 = new ActionDescriptor();  
    var idHrzn = charIDToTypeID( "Hrzn" );  
    var idPxl = charIDToTypeID( "#Pxl" ); 
    desc6.putUnitDouble( idHrzn, idPxl, 0.000000 );  
    var idVrtc = charIDToTypeID( "Vrtc" );  
    var idPxl = charIDToTypeID( "#Pxl" );  
    desc6.putUnitDouble( idVrtc, idPxl, 0.000000 );  
    var idOfst = charIDToTypeID( "Ofst" );  
    desc5.putObject( idOfst, idOfst, desc6 );  
    executeAction( idPlc, desc5, DialogModes.NO );  
        
    // because can't get the scale of a smart object, reset to 100%  
    activeDocument.activeLayer.resize(100 ,100,AnchorPosition.MIDDLECENTER);  
        
    return app.activeDocument.activeLayer;  
}

/**
 * Resizes an image to a specific dimention
 * @param {Number} width width to resize to image to (in pixels) 
 * @param {Number} height height to resize image to (in pixels)
 */
function resizeImage(width, height){
    var heightValue = height ? UnitValue(height,"px") : null;
    var widthValue = width ? UnitValue(width,"px") : null;
    app.activeDocument.resizeImage (widthValue, heightValue, null, ResampleMethod.BICUBIC)
}

/**
 * move layer to specific pixel coordinates
 * @param {layer} layer a reference to the layer moved 
 * @param {*} targetX the target x coordinate in pixels
 * @param {*} targetY the target y coordinate in pixels
 */
function moveLayer(layer,targetX,targetY ){
    var Position = layer.bounds;
    Position[0] = targetX- Position[0];
    Position[1] = targetY - Position[1];
    layer.translate(-Position[0],-Position[1]);
}
/**
 * checks wheather a layer with name exists
 * @param {artLayers} ref a collection of layers to search in
 * @param {String} layerName the name of the layer to search by
 * @returns {layer} returns true if a layer exists with that name and false otherwise
 */
function LayerExists(ref, layerName){
    try{
        if(ref && layer){
            layer  = ref.layers.getByName(layerName);
            if(layer === "No such element"){
                layer = null;
            }
        }    
    }
    catch(e){
        layer = null;
    }
}

function FileExists(filePath){
    // TODO 
    return true;
}

function MoveLayerToGroup(layer, group, placement){
    layer.move(group,placement);
}

function IsDocument(doc){
    // TODO 
    return true
}
/**
 * checks if a layer is type of text-layer (text layers hold text content)
 * @param {layer} layer 
 * @returns {boolean} returns true if layer is type of textLayer and false if not
 */
function IsTextLayer(layer){
    if(layer && layer.kind == LayerKind.TEXT){
        return true;
    }
    else{
        return false;
    }
}

