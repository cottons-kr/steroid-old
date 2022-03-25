function editList(listName: string, content: jsObject, type: string) {
    const list: Array<jsObject> = JSON.parse(localStorage["playlist"])[listName]
    if (typeof list == undefined) { return }

    if (type == "add") { list.push({"name": content["name"], "path": content["path"]}) }
    if (type == "delete") { list.splice(list.findIndex(data => data["name"] == content["name"] && data["path"] == content["path"])) }
}