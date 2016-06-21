var DomComponents = {
    doModal: function (element) {
        var transportable = {
            mouseX: 0,
            mouseY: 0,
            offsetX: 0,
            offsetY: 0,
            dragStart: false
        };
        Dom.update(element, {draggable: true});
        document.addEventListener("dragover", function(e){
            if(transportable.dragStart) {
                transportable.mouseX = e.clientX;
                transportable.mouseY = e.clientY;
            }
        }, false);
        element.style.position = 'fixed';
        element.addEventListener('dragstart', function(e){DomComponents.handleDragStart(e, element, transportable)}, false);
        element.addEventListener('dragenter', function(e){DomComponents.handleDragEnter(e, element)}, false);
        element.addEventListener('dragover', function(e){DomComponents.handleDragOver(e, transportable)}, false);
        element.addEventListener('dragleave', function(e){DomComponents.handleDragLeave(e, element)}, false);
        element.addEventListener('drop',  function(e){DomComponents.handleDrop(e)}, false);
        element.addEventListener('dragend', function(e){DomComponents.handleDragEnd(e, element, transportable)}, false);
    },
    handleDragEnd: function (e, element, transportable) {
        Dom.removeClass(element, 'over');
        element.style.opacity = null;
        element.style.left =  (transportable.mouseX - transportable.offsetX) + 'px';
        element.style.top =  (transportable.mouseY - transportable.offsetY) + 'px';
        console.log(transportable);
        transportable.dragStart = false;
    },
    handleDrop: function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        return false;
    },
    handleDragStart: function (e, element, transportable) {
        if(document.activeElement && ['input', 'textarea', 'select'].indexOf(document.activeElement.tagName.toLowerCase()) > -1) {
            e.preventDefault();
            return false;
        }
        element.style.opacity = '0.4';
        var offset  = Dom.calculateOffset(element);
        transportable.offsetX = e.clientX - offset.left;
        transportable.offsetY = e.clientY - offset.top;
        element.style.left = (e.clientX - transportable.offsetX) + "px";
        element.style.top = (e.clientY - transportable.offsetY) + "px";
        element.style.right = 'initial';
        element.style.bottom = 'initial';
        transportable.dragStart = true;
    },
    handleDragOver: function (e, transportable) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    },

    handleDragEnter: function (e, element) {
        Dom.addClass(element, 'over');
    },

    handleDragLeave: function (e, element) {
        Dom.addClass(element, 'over');
    }
};