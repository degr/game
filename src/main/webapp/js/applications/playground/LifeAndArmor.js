var LifeAndArmor = {
    container: null,
    lifeDom: null,
    armorDom: null,
    life: -1,
    armor: -1,
    init: function() {
        LifeAndArmor.lifeDom = Dom.el('div', {'class': 'life'}, LifeAndArmor.life);
        LifeAndArmor.armorDom = Dom.el('div', {'class': 'armor'}, LifeAndArmor.armor);
        LifeAndArmor.container = Dom.el('div', {'class':'life-and-armor'}, [
            Dom.el('div', {'class': 'label'}, "Health"),
            LifeAndArmor.lifeDom,
            Dom.el('div', {'class': 'label'}, "Armor"),
            LifeAndArmor.armorDom
        ]);
    },
    update: function(life, armor) {
        if(LifeAndArmor.life != life) {
            LifeAndArmor.life = life;
            var ld = LifeAndArmor.lifeDom;
            ld.className = 'life';
            if(life < 25) {
                Dom.addClass(ld, 'life-25');
            } else if(life < 50) {
                Dom.addClass(ld, 'life-50');
            } else if(life < 75) {
                Dom.addClass(ld, 'life-75');
            } else {
                Dom.addClass(ld, 'life-100');
            }
            ld.innerText = life;
        }
        if(LifeAndArmor.armor != armor) {
            LifeAndArmor.armor = armor;
            LifeAndArmor.armorDom.innerText = armor;
        }
    }
};