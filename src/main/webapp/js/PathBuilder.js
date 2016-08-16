Engine.define("PathBuilder", function(){
    return function (module) {
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
                return 'js/utils/' + module + '.js';
            case 'Greetings':
            case 'MapEditor':
            case 'MapList':
            case 'PlayGround':
            case 'RoomsList':
                return 'js/applications/' + module + '.js';
            case 'Dispatcher':
            case 'Context':
                return 'js/applications/routing/' + module + '.js';
            case 'Pagination':
            case 'Tabs':
                return 'js/components/' + module + '.js';
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
                return 'js/applications/playground/' + module + '.js';
            case 'CustomTiles':
                return "js/applications/map-editor/CustomTiles.js";
            case 'Text':
            case 'AbstractInput':
                return 'js/form/' + module + '.js';
            case 'RoomsChat':
                return "js/applications/rooms-list/RoomsChat.js";
            case 'Config':
                return "js/Config.js";
            default:
                throw "Unkown class - " + module;
        }
    };
});