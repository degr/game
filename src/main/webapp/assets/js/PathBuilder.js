Engine.define("PathBuilder", function(){
    return function PathBuilder(module) {
        var path;
        switch (module) {
            case 'CGraphics':
            case 'SoundUtils':
            case 'UrlResolver':
            case 'DomComponents':
            case 'KeyboardUtils':
            case 'WebSocketUtils':
            case 'GeometryService':
                path = 'utils/' + module + '.js';
                break;
            case 'Maps':
            case 'Users':
            case 'Tiles':
            case 'Logout':
            case 'Account':
            case 'MapList':
            case 'Greetings':
            case 'MapEditor':
            case 'RoomsList':
            case 'PlayGround':
            case 'AbstractOverview':
                path = 'applications/' + module + '.js';
                break;
            case 'Pagination':
            case 'Popup':
            case 'Modal':
            case 'Tabs':
            case 'Grid':
                path = 'components/' + module + '.js';
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
                path = 'applications/playground/' + module + '.js';
                break;
            case 'CustomTiles':
            case 'ControlButton':
            case 'MapObject':
                path = "applications/map-editor/" + module + ".js";
                break;
            case 'RoomsChat':
                path = 'applications/rooms-list/RoomsChat.js';
                break;
            case 'Config':
                path =  "Config.js";
                break;
            case 'MainMenu':
                path =  'project-components/' + module + ".js";
                break;
            default:
                throw 'Unkown class - ' + module;
        }
        return (path ? 'assets/js/' + path + PathBuilder.seed : '');
    };
});