var Pagination = function(onOpenPage, pageNumber) {
    if(!onOpenPage || !pageNumber) {
        throw "Pagination instantiation error";
    }
    var me = this;
    this.refreshButton = Dom.el('input', {type: 'button', value: "Refresh"});
    this.refreshButton.onclick = function(e){me.refresh(e)};
    
    this.page = Dom.el('input', {type: 'text', value: pageNumber});
    this.page.onkeyup = function(e){me.onChange(e)};
    this.pageNumber = pageNumber;
    this.onOpenPage = onOpenPage;

    this.previousButton = Dom.el('input', {type: 'button', value: 'Previous page'});
    this.previousButton.onclick = function(e){me.previous(e)};
    
    this.nextButton = Dom.el('input', {type: 'button', value: 'Next page'});
    this.nextButton.onclick = function(e){me.next(e)};
    
    this.container = Dom.el(
        'form',
        {'class': 'pagination'}, 
        [this.refreshButton, this.previousButton, this.page, this.nextButton]
    );
    this.container.onsubmit = function(e){this.refresh(e)};
};
Pagination.prototype.refresh = function(e){
    if(e)e.preventDefault();
    this.openPage(this.pageNumber);
};
Pagination.prototype.previous = function (e) {
    if(e)e.preventDefault();
    this.openPage(this.pageNumber > 1 ? this.pageNumber - 1 : 1);
};
Pagination.prototype.next = function(e) {
    if(e)e.preventDefault();
    this.openPage(this.pageNumber + 1);
};
Pagination.prototype.openPage = function(page) {
    this.pageNumber = page;
    this.page.value = page;
    this.onOpenPage(page)
};
Pagination.prototype.regexp = /^\d*$/;

Pagination.prototype.onChange = function(e) {
    if(this.regexp.test(this.page.value)) {
        this.pageNumber = this.page.value;
        this.openPage(this.pageNumber);
    } else {
        this.page.value = this.pageNumber;
    }
};