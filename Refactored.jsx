//@include "json2.js"
// var doc = app.activeDocument;
// var layer = doc.activeLayer;

// var sourcePath = doc.path
// var images = getFiles(sourcePath);
// var templateDocument = doc;

// var saveName = "";
// var destPath = sourcePath;
// var pageNumberCounter = 45;
// var sections = Folder(sourcePath).getFiles (function(f) { return f instanceof Folder; });

// for(var j=0 ; j<= 0 ; j++){

//     var folders = Folder(sections[j]).getFiles (function(f) { return f instanceof Folder; });
//     for(var i=0 ; i < folders.length ; i++){
//         var list = LoadJSON (folders[i]+ "/lastword.json")
//         var textGroup = doc.layerSets.getByName ("FIELDS")
        
//         var whiteColor = new SolidColor();
//         whiteColor.rgb.red = 255;
//         whiteColor.rgb.green = 255;
//         whiteColor.rgb.blue = 255;
        
//         populateTexts (list)
        
//         var casualPhoto = Folder(folders[i]).getFiles(/casual/)
//         var gownPhoto = Folder(folders[i]).getFiles(/gown/)
//         var babyPicture = Folder(folders[i]).getFiles(/baby/)
        
        

//         var casualGroup = doc.layerSets.getByName ("CASUAL")
//         var gownGroup = doc.layerSets.getByName ("GOWN")
//         var babyGroup = doc.layerSets.getByName ("BABY")
//         var textGroup = doc.layerSets.getByName ("FIELDS")
        
//         //var casualLayer = casualGroup.artLayers.getByName ("casual layer")
//         //var babyLayer = babyGroup.artLayers.getByName ("baby layer")
//         //var gownLayer = gownGroup.artLayers.getByName ("gown layer")
        

//         var hasBaby = false;
//         var hasCasual = false;
//         var hasGown = false;
//         var hasLastword = false;
//         //Init();
//         //-----------------------------------------------------------
//         if(casualPhoto[0]){
//             doc = app.open(casualPhoto[0]);
//             resizeImage(2539, null);
//             copyImage();
//             doc.close(SaveOptions.DONOTSAVECHANGES);
//             doc = templateDocument;
//             var casualLayer = paste();
//             //translateLayer(casualLayer, 600, 0);
//             casualLayer.move(casualGroup, ElementPlacement.PLACEATBEGINNING)
//             hasCasual= true;
//         }
//         //-----------------------------------------------------------
//          if(gownPhoto[0]){
//             doc = app.open(gownPhoto[0]);
//             // width and height
//             resizeImage(null, 677);
//             copyImage();
//             doc.close(SaveOptions.DONOTSAVECHANGES);
//             doc = templateDocument;
//             var gownLayer = paste ();
//             gownLayer.move(gownGroup.artLayers.getByName("mask"), ElementPlacement.PLACEBEFORE)
//             moveLayer(gownLayer, 1845,677);
//             hasGown = true;
//         }


//         //-----------------------------------------------------------
//         if(babyPicture[0]){
//             doc = app.open(babyPicture[0]);
//             resizeImage(330, null);
//             copyImage();
//             doc.close(SaveOptions.DONOTSAVECHANGES);
//             doc = templateDocument;
//             var babyLayer = paste ();
//             babyLayer.move(babyGroup.artLayers.getByName("mask"), ElementPlacement.PLACEBEFORE)
//             moveLayer(babyLayer, 1965, 1357)
//             hasBaby = true;
//         }
//         ChangeToRGB(app.activeDocument)
//         var ID = list.id ? list.id+"#" : "";
//         var section = list.section ? list.section+"#" : "";
//         var fullname = list.name ? list.name.split("/")[0] : "";
//         var PSDPath = sections[j]+"/"+section+ID+fullname;
        
//         SavePSD (PSDPath)
    
//         layer = templateDocument.activeLayer;
        
//         if(hasCasual) casualLayer.remove();
//         if(hasGown) gownLayer.remove();
//         if(hasBaby) babyLayer.remove();
//         pageNumberCounter++
        
//     }
// }

function GetLayerText(layer){
    try{
        if(layer.kind == LayerKind.TEXT){
            return layer.textItem.contents;
        }
        else{
            return null
        }
    }
    catch(err){
        alert(err.message)
    }   
}

function SetLayerText(layer, text){
    try{
        if(layer && layer.kind == LayerKind.TEXT){
            layer.textItem.contents = text.toString();
            return true;
        }
        else{
            return false;
        }
    }
    catch(err){
        alert(err.message)
    }    
}

function GetLayerByName(parent, layerName){
    try{
        var layer = parent.layers.getByName(layerName);     
        return layer;   
    }
    catch(err){
        alert(err.message);
    }    
}

function SavePSD(doc, path){
    try{
        var savePath = new File(path);
        if(savePath.exists){
            var PSDSaveOptions = new PhotoshopSaveOptions();
            doc.saveAs(savePath, PSDSaveOptions, true);
            return true
        }
        else{
            return false
        }

    }
    catch(err){
        alert(err.message);
    }
    
}  

function saveJPEG(doc, path){
    try{
        var savePath = new File(path);
        if(savePath.exists){
            var JPEGSaveOpts = new JPEGSaveOptions();
            JPEGSaveOptions.quality = 12;
            doc.saveAs(savePath, JPEGSaveOpts, true);
            return true;
        }
        else{
            return false;
        }        
    }
    catch(err){
        alert(err.message);
    }

}

function copyImage(){
    doc.activeLayer.copy ()
    saveName = doc.name;
}

function TranslateLayer(layer,targetX,targetY){
    try{
        var Position = layer.bounds;
        Position[0] = targetX- Position[0];
        Position[1] = targetY - Position[1];
        layer.translate(-Position[0],-Position[1]);
    }
    catch(err){
        alert(err.message)
    }
}

function ResizeImage(doc, width, height){
    try{
        var heightValue = height ? UnitValue(height,"px") : null;
        var widthValue = width ? UnitValue(width,"px") : null;
        doc.resizeImage (widthValue, heightValue, null, ResampleMethod.BICUBIC)
        return true;
    }
    catch(err){
        alert(err.message);
        return false;
    }
}

function getFiles(path, filter){
    try{
        var srcPath = new Folder(path);
        if(srcPath.exists){
            return Folder(path).getFiles(filter);
        }
        else{
            return [];
        }
    }
    catch(err){
        alert(err.message)
    }
}

function GetFolders(path){
    try{
        var srcPath = new Folder(path);
        if(srcPath.exists){
            return Folder(path).getFiles(function(f) { return f instanceof Folder; });
        }
        else{
            return [];
        }
    }
    catch(err){
        alert(err.message)
    }    
}

function paste(doc){
    try{
        doc.selection.selectAll()
        return doc.paste()
    }
    catch(err){
        alert(err.message);
    }
}

function LoadJSON(jsonFilePath){
    try{
        var jsonFile = new File(jsonFilePath)
        if(jsonFile.exists){
            jsonFile.open ('r');
            var jsonStr = jsonFile.read();
            jsonFile.close();    
            var JSONObject = JSON.parse(jsonStr);
            return JSONObject;
        }
        else{
            return [];
        }
    }
    catch(err){
        alert(err.message)
    }
    
    
}

function ChangeToRGB(doc){
    doc.changeMode(ChangeMode.RGB)
}
