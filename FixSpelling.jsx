var doc = app.activeDocument;
var sourcePath, destinationPath = doc.path;
alert("Hello")

function getFiles(path, type){
    return Folder(path).getFiles(type || "*.png");
}

function getFolders(path){
    return Folder(path).getFiles(function(f) { return f instanceof Folder; });
}

