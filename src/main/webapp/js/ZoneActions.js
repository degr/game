var ZoneActions = {
    drawZone: function(zone, context) {
        context.beginPath();
        switch (zone.type) {
            case 'respawn':
                context.fillStyle = '#3dbe2f';
                context.fillRect(zone.x, zone.y, zone.width, zone.height);
                context.stroke();
                break;
            case 'item':
                switch (zone.item) {
                    case "assault":
                    case "sniper":
                    case "minigun":
                    case "rocket":
                    case "flame":
                        context.strokeStyle = '#000000';
                        context.rect(zone.x, zone.y, zone.width, zone.height);
                        context.strokeText(zone.item, zone.x, zone.y);
                        context.stroke();
                        break;
                    //items
                    case "medkit":
                    case "armor":
                    case "helm":
                        context.strokeStyle = '#000000';
                        context.rect(zone.x, zone.y, zone.width, zone.height);
                        context.strokeText(zone.item, zone.x, zone.y);
                        context.stroke();
                        break;
                    default:
                        console.log('undefined item: ', zone);
                }
                break;
            default:
                context.strokeStyle = '#000000';
                context.rect(zone.x, zone.y, zone.width, zone.height);
                context.stroke();
        }

    }
};