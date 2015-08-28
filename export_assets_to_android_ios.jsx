/**
 * Author: austynmahoney (https://github.com/austynmahoney)
 */
var selectedArtboardsOptions = {};
var selectedExportOptions = {};
var androidExportOptions = [
    {
        name: "mdpi",
        scaleFactor: 50,
        type: "android"
    },
    {
        name: "hdpi",
        scaleFactor: 75,
        type: "android"
    },
    {
        name: "xhdpi",
        scaleFactor: 100,
        type: "android"
    },
    {
        name: "xxhdpi",
        scaleFactor: 150,
        type: "android"
    },
    {
        name: "xxxhdpi",
        scaleFactor: 200,
        type: "android"
    }
];
var iosExportOptions = [
    {
        name: "",
        scaleFactor: 50,
        type: "ios"
    },
    {
        name: "@2x",
        scaleFactor: 100,
        type: "ios"
    },
    {
        name: "@3x",
        scaleFactor: 150,
        type: "ios"
    }
];
var folder = Folder.selectDialog("Select export directory");
var document = app.activeDocument;

if (document && folder) {
    var dialog = new Window("dialog", "Select export sizes");
    var optionsGroup = dialog.add("group");

    var artboardCheckboxes = createSelectionPanel("Artboards", document.artboards, optionsGroup, selectedArtboardsOptions);
    var androidCheckboxes = createSelectionPanel("Android", androidExportOptions, optionsGroup, selectedExportOptions);
    var iosCheckboxes = createSelectionPanel("iOS", iosExportOptions, optionsGroup, selectedExportOptions);

    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "Export");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    okButton.onClick = function () {
        for (var key in selectedExportOptions) {
            if (selectedExportOptions.hasOwnProperty(key)) {
                var item = selectedExportOptions[key];
                exportToFile(item.scaleFactor, item.name, item.type);
            }
        }
        this.parent.parent.close();
    };

    cancelButton.onClick = function () {
        this.parent.parent.close();
    };

    dialog.show();
}

function exportToFile(scaleFactor, resIdentifier, os) {
    var ab, file, options, expFolder;
    if (os === "android")
        expFolder = new Folder(folder.fsName + "/drawable-" + resIdentifier);
    else if (os === "ios")
        expFolder = new Folder(folder.fsName + "/iOS");

    if (!expFolder.exists) {
        expFolder.create();
    }

    for (var abName in selectedArtboardsOptions) {
        if (!selectedArtboardsOptions.hasOwnProperty(abName)) {
            continue;
        }
        ab = selectedArtboardsOptions[abName];
        document.artboards.setActiveArtboardIndex(ab.index);

        if (os === "android")
            file = new File(expFolder.fsName + "/" + ab.name + ".png");
        else if (os === "ios")
            file = new File(expFolder.fsName + "/" + ab.name + resIdentifier + ".png");

        options = new ExportOptionsPNG24();
        options.transparency = true;
        options.artBoardClipping = true;
        options.antiAliasing = true;
        options.verticalScale = scaleFactor;
        options.horizontalScale = scaleFactor;

        document.exportFile(file, ExportType.PNG24, options);
    }
}

function createSelectionPanel(name, array, parent, options) {
    var panel = parent.add("panel", undefined, name);
    panel.alignChildren = "left";
    for (var i = 0; i < array.length; i++) {
        var cb = panel.add("checkbox", undefined, "\u00A0" + array[i].name);
        cb.item = array[i];
        cb.item.index = i;  // save the index, to be used later in setActiveArtboardIndex
        cb.onClick = function () {
            if (this.value) {
                options[this.item.name] = this.item;
                //alert("added: " + this.item.name + ", index: " + this.item.index);
            } else {
                delete options[this.item.name];
                //alert("deleted: " + this.item.name + ", index: " + this.item.index);
            }
        };
    }
}

