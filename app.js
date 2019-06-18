const fs = require('fs');
const path = require('path');

const BASE_DIR = "Z:\\projects\\schools\\SOT Mekanissa & Gulelle\\Yearbook\\Automation";

let list = require(path.join(BASE_DIR,"SOTM-lastwords.json"));

//SortBySection(BASE_DIR);
//SelectFromList(BASE_DIR,BASE_DIR+"sorted",list,true)

//SplitJSON(list,BASE_DIR)
// RenameFromList(BASE_DIR, list)

// function MoveByID(BASE_DIR, idTemplate){
// filesAudit(BASE_DIR)
SortBySection(BASE_DIR)
// CreateFoldersFromList(list, BASE_DIR)
// MoveFilesByID(BASE_DIR)
// SortByID(BASE_DIR)
//SplitJSON(list, BASE_DIR)
// AuditFiles(BASE_DIR)

function AuditFiles(BASE_DIR){
    let result = []
    let folders = GetFolders(BASE_DIR);
    
    folders.map(folder=>{
        let files = GetFiles(folder)
        //var list = require(folder+"/lastword.json");
        let log = folder.split("#")[1]+" | ";

        if(files.filter(file => file.includes("baby")).length != 1)log += " baby"
        if(files.filter(file => file.includes("casual")).length != 1) log += " casual"
        if(files.filter(file => file.includes("gown")).length != 1) log += " gown"

        console.log(log)
    })
}

function SortByID(baseDir, regex = "(SOTM-19-)\d{3}"){
    regex = new RegExp(regex);
    let folders = GetFolders(baseDir);
    let files = GetFiles(baseDir);
    files.map(file => {
        folders.filter(folder => {
            var matching = file.match(regex)
            if(matching && matching.length && folder.includes(matching[0])){
                MoveFile(path.join(baseDir, file),path.join(folder,file))
            }
        })
});
}
function CreateFoldersFromList(list, baseDir){
    list.map(item =>{
        let folderName = `${item.id}#${item.name}`.trim()
        createFolder(path.join(baseDir, folderName))
    })
}

function RenameFromList(baseDir, list){
    let files = GetFiles(baseDir)
    files.map(file => {
        let matchingGown  = list.filter(item => file.includes(item.gown));
        let matchingCasual = list.filter(item => file.includes(item.casual));
        if(matchingGown.length){
            let renameTo = `gown#${matchingGown[0].id}#${matchingGown[0].name.trim()}${path.extname(file)}`;
            fs.rename(path.join(baseDir,file), path.join(baseDir, renameTo))
        }
        if(matchingCasual.length){
            let renameTo = `casual#${matchingCasual[0].id}#${matchingCasual[0].name.trim()}${path.extname(file)}` 
            fs.rename(path.join(baseDir,file), path.join(baseDir, renameTo))  
        }
    })
}

function MoveFilesToSeparateFolders(source, list){
    createFolder(source)
    for(let item of list){
        let itemID = item.split(5,14);
        
    }
}
function SortBySection(source){
    let folders = GetFolders(source);
    if (folders.length <=0) return;
    for(let folder of folders){
        let files = GetFiles(folder);
        if(files.includes("lastword.json")){
            let lastword = require(path.join(folder,"lastword.json"));
            switch (lastword.section) {
                case "A":
                    createFolder(path.join(source,"A"));
                    fs.rename(path.join(folder),path.join(source,"A",path.basename(folder)));
                    break;
                case "B":
                    createFolder(path.join(source,"B"));
                    fs.rename(path.join(folder),path.join(source,"B",path.basename(folder)));
                    break;
                case "C":
                    createFolder(path.join(source,"C"));
                    fs.rename(path.join(folder),path.join(source,"C",path.basename(folder)));
                    break;
                case "D":
                    createFolder(path.join(source,"D"));
                    fs.rename(path.join(folder),path.join(source,"D",path.basename(folder)));
                    break;
            }
        }
    }
}
function SplitJSON(list, baseDir){
    let folders = GetFolders(baseDir).map(folder => path.basename(folder));
    for(let item of list){
        let matching = folders.filter(folder => folder.includes(item.id))
        if(matching.length === 1){
            fs.writeFileSync(path.join(baseDir,matching[0],'lastword.json'),JSON.stringify(item),'utf8');
        }
    }
}
function InsertIdToName(baseDir, list) {
    let files = GetFiles(baseDir);
    for (let file of files){
        if(file.split("#").length > 1){
            let listMatch = list.filter(item => item["system name"] === file.split("#")[0]);
            if(listMatch.length > 0){
                fs.rename(path.join(baseDir,file),path.join(baseDir,listMatch[0].id+"#"+file))
            }
        }
    }
}
function SelectFromList(sourceDir, destinationDir, list, moveToSeparateFolder=false){
    createFolder(path.join(destinationDir.trim()));
    let files = GetFiles(sourceDir);
    for(let listItem of list){
        if(moveToSeparateFolder){
            let folderName = listItem.id +"#"+ listItem.name;
            folderName = folderName.trim()
             createFolder(path.join(destinationDir,folderName));
        }
        if(listItem.casual){ 
            let casualPhoto = listItem.casual.toString();
            let matchingFiles = files.filter(file => file.includes(casualPhoto));
            if(matchingFiles.length === 1){
                let moveSource = path.join(sourceDir,matchingFiles[0]);
                let ext = path.extname(moveSource);
                let moveDestination = moveToSeparateFolder ?
                    path.join(destinationDir,folderName,`casual#${listItem.id.trim()}#${listItem.name.trim()}${ext}`):
                    path.join(destinationDir,`casual#${listItem.id.trim()}#${listItem.name.trim()}${ext}`);
                MoveFile(moveSource, moveDestination);
            }
        }
        if(listItem.gown){
            let gownPhoto = listItem.gown.toString();
            let matchingFiles = files.filter(file => file.includes(gownPhoto));
            if(matchingFiles.length === 1){
                folderName = folderName.trim()
                let moveSource = path.join(sourceDir,matchingFiles[0]);
                let ext = path.extname(moveSource);
                let moveDestination = moveToSeparateFolder ?
                    path.join(destinationDir,folderName,`gown#${listItem.id.trim()}#${listItem.name.trim()}${ext}`):
                    path.join(destinationDir,`gown#${listItem.id.trim()}#${listItem.name.trim()}${ext}`);
                MoveFile(moveSource, moveDestination);
            }
        }
    }
}
function MoveFile(filePath, destination){
    fs.rename( filePath, destination, ( error )=> {
        if( error ) {
            console.error( "File moving error.", error );
        }
    });
}
function createFolder(folderPath) {
    if(!fs.existsSync(folderPath) && path.basename(folderPath).match(/^[a-zA-Z0-9._# -]+$/)){
        fs.mkdirSync(folderPath);
    }
    else{
        console.log("folder ",folderPath," already exists");
    }
}
function GetFiles(source, options) {
    const isDirectory = file => !fs.lstatSync(path.join(source,file)).isDirectory();
    return fs.readdirSync(source).filter(isDirectory);
}
function AuditList(path){
    var count = 0;
    var files = fs.readdirSync(path);
    for (var i in files){
        if(fs.lstatSync(path+"/"+files[i]).isDirectory()){
            var subFiles = fs.readdirSync(path+"/"+files[i]);
            if (subFiles.length !== 2) {
                count++;
                console.log(files[i]);
            }
        }
    }
    console.log(count+" Students are Missing Photos");
}
function GetFolders(source, options) {
    const isDirectory = source => fs.lstatSync(source).isDirectory();
    return fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
}
function RenameFile(filePath, baseName, prefix, postfix) {
    prefix = prefix || "";
    postfix = postfix || "";
    if(filePath.includes(prefix)) prefix = "";
    if(filePath.includes(postfix)) postfix = "";
    let dir = path.dirname(filePath);
    let newName = baseName || path.basename(filePath);
    newName = prefix + newName + postfix;
    fs.rename( filePath, path.join(dir,newName), ( error )=> {
        if( error ) {
            console.error( "File moving error.", error );
        }
    });
}
async function SortFiles(source, list){
    if (!source){console.log("No source folder provided");return}
    let destination = path.join(source,"sorted");
    createFolder(destination);
    let filesToMove = await GetFiles(source);
    filesToMove.forEach((file)=>{
        let regexResult = file.match(/.+?(?=#)/);//Regex to extract student name from filename
        if(!regexResult){console.log("couldn't create a folder from file name:",regexResult);return;}
        else if(regexResult.length !== 1){console.log("can't find student name in filename:",regexResult);return;}
        let fileName = regexResult[0];

        createFolder(path.join(destination,fileName));
        MoveFile(path.join(source,file),path.join(destination,fileName,file))
    });
}
async function MoveLastWordToSeparateFolder(source, destination) {
    if (!source){console.log("No source folder provided");return}
    let files = await GetFiles(source);
    files.forEach((file)=>{
        let folderName = file.replace(/\.[^/.]+$/, "");
        createFolder(path.join(destination,folderName));
    })
}
async function RenameFiles(baseDir, files, prefix, postfix) {
    files.map((file=>{
        RenameFile(path.join(baseDir, prefix+file+postfix))
    }));
}
async function BatchRenameFiles(folderPath, prefix, postfix){
    if (!folderPath){
        console.log("No path folder found");
        return;
    }
    let filesToRename = await GetFiles(folderPath);
    if (filesToRename.length < 1){
        console.log("No files found in folder");
        return;
    }
    filesToRename.forEach(async (file)=>{
        let ext = path.extname(file);
        file = file.replace(/\.[^/.]+$/, "");
        await fs.rename(path.join(folderPath,file+ext),prefix+path.join(folderPath,file)+postfix+ext)
    })
}
async function GetFilesInList(dir, list) {
    let files = await GetFiles(dir);
    return files.filter(file => list.includes(file));

}
