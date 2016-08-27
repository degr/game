Engine.define("PathBuilder", function(){
    return function PathBuilder(module) {
        var path;
        switch (module) {
            case 'Ajax':
            case 'CGraphics':
            case 'Dom':
            case 'DomComponents':
            case 'GeometryService':
            case 'KeyboardUtils':
            case 'Rest':
            case 'ScreenUtils':
            case 'SoundUtils':
            case 'StringUtils':
            case 'WebSocketUtils':
                path = 'js/utils/' + module + '.js';
                break;
            case 'Greetings':
            case 'MapEditor':
            case 'MapList':
            case 'PlayGround':
            case 'RoomsList':
                path = 'js/applications/' + module + '.js';
                break;
            case 'Dispatcher':
            case 'Context':
                path = 'js/applications/routing/' + module + '.js';
                break;
            case 'Pagination':
            case 'Tabs':
                path = 'js/components/' + module + '.js';
                break;
            case 'Weapons':
            case 'Controls':
            case 'WeaponControl':
            case 'BloodActions':
            case 'PersonTracker':
            case 'WeaponActions':
            case 'LifeAndArmor':
            case 'ScoreOverview':
            case 'TeamControl':
            case 'GameStats':
            case 'ZoneActions':
            case 'Person':
            case 'Score':
            case 'PersonActions':
            case 'ProjectilesActions':
            case 'KeyboardSetup':
            case 'Chat':
                path = 'js/applications/playground/' + module + '.js';
                break;
            case 'CustomTiles':
            case 'ControlButton':
                path = "js/applications/map-editor/" + module + ".js";
                break;
            case 'Text':
            case 'Checkbox':
            case 'AbstractInput':
                path = 'js/form/' + module + '.js';
                break;
            case 'RoomsChat':
                path = "js/applications/rooms-list/RoomsChat.js";
                break;
            case 'Config':
                path =  "js/Config.js";
                break;
            default:
                throw "Unkown class - " + module;
        }
        return (path ? path + PathBuilder.seed : '');
    };
});