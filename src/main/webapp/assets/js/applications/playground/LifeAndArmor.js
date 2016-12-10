Engine.define('LifeAndArmor', 'Dom', (function () {

    var Dom = Engine.require('Dom');
    
    function LifeAndArmor() {
        this.container = null;
        this.lifeDom = null;
        this.armorDom = null;
        this.life = -1;
        this.armor = -1;
        this.lifeDom = Dom.el('div', {'class': 'life'}, this.life);
        this.armorDom = Dom.el('div', {'class': 'armor'}, this.armor);
        this.container = Dom.el('div', {'class': 'life-and-armor'}, [
            Dom.el('div', {'class': 'label'}, "Health"),
            this.lifeDom,
            Dom.el('div', {'class': 'label'}, "Armor"),
            this.armorDom
        ]);
    }
    LifeAndArmor.prototype.update = function (life, armor) {
        if (this.life != life) {
            this.life = life;
            var ld = this.lifeDom;
            ld.className = 'life';
            if (life < 25) {
                Dom.addClass(ld, 'life-25');
            } else if (life < 50) {
                Dom.addClass(ld, 'life-50');
            } else if (life < 75) {
                Dom.addClass(ld, 'life-75');
            } else {
                Dom.addClass(ld, 'life-100');
            }
            ld.innerText = life;
        }
        if (this.armor != armor) {
            this.armor = armor;
            this.armorDom.innerText = armor;
        }
    };
    return LifeAndArmor
}));