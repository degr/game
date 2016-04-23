var ZoneActions = {
    drawZone: function(zone, context) {
        context.beginPath();
        if(zone.type === 'respawn') {
            context.fillStyle = '#3dbe2f';
            context.fillRect(zone.x, zone.y, zone.width, zone.height);
            context.stroke();
        } else {
            context.strokeStyle = '#000000';
            context.rect(zone.x, zone.y, zone.width, zone.height);
            context.stroke();
        }

    }
};