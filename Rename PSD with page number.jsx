//@include "lib.jsx"  
var sourcePath = Folder.selectDialog("Select Folder");
var files = GetFiles(sourcePath,"*.psd");
var prevPageNumber = 0;
var essentialsCounter = 0;
var pageNumberCounter = 1;

// create destination folder, if it dosen't exist
var destFolder = new Folder(sourcePath +"\\Renamed\\")
if(!destFolder.exists){
    destFolder.create();
}
for(var i=0 ; i < files.length ; i++){
    var psd = OpenPSD(files[i])
    var doc = app.activeDocument

    var fieldsLayer =  GetLayerByName(doc,"FIELDS");
    var pageNumberLayer = GetLayerByName(fieldsLayer,"PAGE NUMBER");
    var nameLayer = GetLayerByName(fieldsLayer,"NAME");
    var txtPageNumber, txtName = ""

    if(pageNumberLayer){
        SetLayerText(pageNumberLayer,pageNumberCounter)
        txtPageNumber  = pageNumberCounter++
        prevPageNumber = txtPageNumber;
        essentialsCounter = 0;
    }
    else{
        essentialsCounter++;
        txtPageNumber = prevPageNumber + "." + essentialsCounter;
    } 
    if(nameLayer){
        txtName = GetLayerText(nameLayer).split("/").join("");
        txtName = "#" + txtName
    }
    
    var destPath = destFolder+"/" + txtPageNumber + txtName + ".psd"
    SavePSD(destPath);
    app.activeDocument.close(SaveOptions.SAVECHANGES)
}

function SortByName(a,b){
    alert(a)
    a = a.split("/")[6]
    alert(a)
    return a - b
}