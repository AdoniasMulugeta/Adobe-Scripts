var win = CreateWindow();
win.show();

function CreateWindow(){
    var win = new Window('palette')
    var text = win.add("statictext");
    text.text = "Hello world";
    return win;
}