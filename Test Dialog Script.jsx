// Global variables
var sourcePath, destPath, templatePath = ""
var checkBoxCasual, checkBoxGown, checkBoxBaby, checkBoxLastword, checkBoxPageNumber;
var window = new Window('dialog', "Yearbook Automation");
window.preferredSize = [600, 500];
RenderMainWindow()
if(window.show() === 1){
    window.close()
    var window_2 = new Window('dialog', "Layer Mapping Window")
    RenderLayerMappingWindow();
}

function RenderMainWindow(){
    // Render source path browsing elements
    var groupSourcePath = window.add("group")
    groupSourcePath.alignment = "left";
    groupSourcePath.add("statictext", undefined, FixedLength("Source Folder",26));
    var txtSourcePath = groupSourcePath.add("edittext");
    txtSourcePath.characters = 30
    var btnBrowse_1 = groupSourcePath.add("button", undefined, "Browse");
    btnBrowse_1.onClick =  function(){
        sourcePath = Folder.selectDialog("Select Source Folder");
        if(sourcePath){
            txtSourcePath.text = sourcePath;
        }
    }

    // Render destination path browsing elements
    var groupDestPath = window.add("group")
    groupDestPath.alignment = "left";
    groupDestPath.add("statictext", undefined, FixedLength("Destination Folder",18));
    var txtDestinationPath = groupDestPath.add("edittext");
    txtDestinationPath.characters = 30
    var btnBrowse_2 = groupDestPath.add("button", undefined, "Browse");
    btnBrowse_2.onClick = function(){
        destPath = Folder.selectDialog("Select Destination Folder");
        if(destPath){
            txtDestinationPath.text = destPath;
        }
    }

    //Prepare checkbox elements
    var groupCheckBox = window.add('group');
    groupCheckBox.alignment = "left";
    groupCheckBox.add("statictext", undefined, FixedLength("Yearbook Contents",25));

    checkBoxCasual = groupCheckBox.add("checkbox", undefined, "Has casual");
    checkBoxGown = groupCheckBox.add("checkbox", undefined, "Has gown" );
    checkBoxBaby = groupCheckBox.add("checkbox", undefined, "Has baby");
    checkBoxLastword = groupCheckBox.add("checkbox", undefined, "Has Lastwords");
    checkBoxPageNumber = groupCheckBox.add("checkbox", undefined, "Has Page Number");

    checkBoxCasual.value = true;
    checkBoxGown.value = true;
    checkBoxBaby.value = true;
    checkBoxLastword.value = true;
    checkBoxPageNumber.value = true;


    // Create a group for the ok and cancel buttons at the bottom
    var groupButtons = window.add("group");
    groupButtons.orientation = "row"
    groupButtons.alignment = "right";
    groupButtons.add("button", undefined, "Next",{Name : "OK"});
    groupButtons.add("button", undefined, "Cancel", {Name : "Cancel"});

}
function RenderLayerMappingWindow(){
    if(checkBoxCasual){
        
    }
    window_2.add()
}
function FixedLength(string, length){
    if(string.length < length){
        for(var i = 0 ; i <= length - string.length ; i++){
            string += " ";
        }
    }
    return string;
}
