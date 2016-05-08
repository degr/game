function applicationRun() {
    var weapons = [
        {name: 'knife', enable: true, max: 1, clip: 1, total: 1, current: 1},
        {name: 'pistol', enable: true, max: 40, clip: 9, total: 16, current: 6},
        {name: 'shotgun', enable: false, max: 28, clip: 7, total: 12, current: 4},
        {name: 'rifle', enable: true, max: 120, clip: 30, total: 50, current: 30},
        {name: 'sniperRifle', enable: true, max: 20, clip: 5, total: 14, current: 2},
        {name: 'minigun', enable: true, max: 480, clip: 120, total: 0, current: 0},
        {name: 'flamethrower', enable: true, max: 50, clip: 25, total: 25, current: 25},
        {name: 'grenade', enable: true, max: 4, clip: 1, total: 3, current: 1},
        {name: 'rocketLauncher', enable: true, max: 3, clip: 1, total: 1, current: 1},
    ];
    var application = document.getElementById('application');

    for(var i = 0; i < weapons.length; i++) {
        var weapon = weapons[i];
        var weaponDiv = buildWeapon(weapon);
        application.appendChild(weaponDiv);
    }

    var name = document.getElementsByClassName('name');

    function buildWeapon(weapon){

        var out = document.createElement("div");
        var amount = document.createElement("div")
        var ammoholder = document.createElement("div")
        out.innerHTML = weapon.name;
        amount.innerHTML = weapon.total;
        out.appendChild(amount);
        out.appendChild(ammoholder);
        ammoholder.className = "ammoholder"
        var percents = weapon.current*100/weapon.clip
        var now = document.createElement("div")
        ammoholder.appendChild(now)
        now.className = "now"
        now.setAttribute('style', 'width:' + percents + '%')
        if(weapon.enable){
            out.className = "weapon-black"
        } else {
            out.className = "weapon-gray"
        }


        out.onclick = function(){
            if(out.className == "weapon-black"){
                out.className = "weapon-gray"
            } else {
                out.className = "weapon-black"
            }
        }
        return out;

    }


}