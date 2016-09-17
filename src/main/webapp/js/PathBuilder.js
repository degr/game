Engine.define("PathBuilder", function(){
    return function PathBuilder(module) {
        var path;
        switch (module) {
            case 'Dom':
            case 'Ajax':
            case 'Rest':
            case 'CGraphics':
            case 'SoundUtils':
            case 'ScreenUtils':
            case 'StringUtils':
            case 'UrlResolver':
            case 'DomComponents':
            case 'KeyboardUtils':
            case 'WebSocketUtils':
            case 'GeometryService':
                path = 'js/utils/' + module + '.js';
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
                path = 'js/applications/' + module + '.js';
                break;
            case 'Dispatcher':
            case 'Context':
                path = 'js/applications/routing/' + module + '.js';
                break;
            case 'Pagination':
            case 'Popup':
            case 'Modal':
            case 'Tabs':
            case 'Grid':
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
            case 'MapObject':
                path = "js/applications/map-editor/" + module + ".js";
                break;
            case 'Text':
            case 'Radio':
            case 'Password':
            case 'Checkbox':
            case 'GenericForm':
            case 'AbstractInput':
                path = 'js/form/' + module + '.js';
                break;
            case 'RoomsChat':
                path = 'js/applications/rooms-list/RoomsChat.js';
                break;
            case 'Config':
                path =  "js/Config.js";
                break;
            case 'MainMenu':
                path =  'js/project-components/' + module + ".js";
                break;
            default:
                throw 'Unkown class - ' + module;
        }
        return (path ? path + PathBuilder.seed : '');
    };
});