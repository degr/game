Engine.define('GeometryService', (function () {
    var GeometryService = {
        lineIntersectCircle: function (line, circle) {
            var pointB = line.pointB;
            var pointA = line.pointA;
            if (pointA.x == pointB.x && pointA.y == pointB.y) {
                return Math.pow(pointA.x - circle.x, 2) + Math.pow(pointA.y - circle.y, 2) == circle.radius * circle.radius ? [pointA] : [];
            } else {
                var baX = pointB.x - pointA.x;
                var baY = pointB.y - pointA.y;
                var caX = circle.x - pointA.x;
                var caY = circle.y - pointA.y;
                var a = baX * baX + baY * baY;
                var bBy2 = baX * caX + baY * caY;
                var c = caX * caX + caY * caY - circle.radius * circle.radius;
                var pBy2 = bBy2 / a;
                var q = c / a;
                var disc = pBy2 * pBy2 - q;
                if (disc <= 1.0E-4 && disc >= -1.0E-4) {
                    disc = 0;
                }

                if (disc < 0) {
                    return [];
                } else {
                    var tmpSqrt = Math.sqrt(disc);
                    var abScalingFactor1 = -pBy2 + tmpSqrt;
                    var abScalingFactor2 = -pBy2 - tmpSqrt;
                    var p1 = {x: pointA.x - baX * abScalingFactor1, y: pointA.y - baY * abScalingFactor1};
                    var out1 = GeometryService.getMiddle(pointA, pointB, p1);
                    if (disc == 0) {
                        return out1 == p1 ? [p1] : [];
                    } else {
                        var p2 = {x: pointA.x - baX * abScalingFactor2, y: pointA.y - baY * abScalingFactor2};
                        var out2 = GeometryService.getMiddle(pointA, pointB, p2);
                        return out1 == p1 ? (out2 == p2 ? [p1, p2] : [p1]) : (out2 == p2 ? [p2] : []);
                    }
                }
            }
        },
        canStand: function (zones, circle) {
            for(var i = 0; i < zones.length; i++) {
                var zone = zones[i];
                var center;
                var angle = zone.angle || 0;
                if (zone.angle === 0) {
                    center = null;
                } else {
                    center = {x: zone.x + zone.width / 2, y: zone.y + zone.height / 2};
                }
                var points = [
                    GeometryService.translate(center, {x: zone.x, y: zone.y}, angle),
                    GeometryService.translate(center, {x: zone.x + zone.width, y: zone.y}, angle),
                    GeometryService.translate(center, {x: zone.x + zone.width, y: zone.y + zone.height}, angle),
                    GeometryService.translate(center, {x: zone.x, y: zone.y + zone.height}, angle),
                ];
                var line = {pointA: points[0], pointB: points[1]};
                if (GeometryService.lineIntersectCircle(line, circle).length === 0) {
                    line = {pointA: points[1], pointB: points[2]};
                    if (GeometryService.lineIntersectCircle(line, circle).length === 0) {
                        line = {pointA: points[2], pointB: points[3]};
                        if (GeometryService.lineIntersectCircle(line, circle).length === 0) {
                            line = {pointA: points[3], pointB: points[0]};
                            if (GeometryService.lineIntersectCircle(line, circle).length !== 0) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            return true;
        },
        translate: function (rotationCenter, point, angle) {
            if (angle === 0) {
                return point;
            }
            var x = (Math.cos(angle) * (point.x - rotationCenter.x)) -
                (Math.sin(angle) * (point.y - rotationCenter.y)) +
                rotationCenter.x;
            var y = (Math.sin(angle) * (point.x - rotationCenter.x)) +
                (Math.cos(angle) * (point.y - rotationCenter.y)) +
                rotationCenter.y;
            return {x: x, y: y};
        },
        getMiddle: function (pointA, pointB, pointC) {
            var ab = GeometryService.getDistance(pointA, pointB);
            var bc = GeometryService.getDistance(pointB, pointC);
            var ca = GeometryService.getDistance(pointC, pointA);
            return ab >= bc && ab >= ca ? pointC : (ca >= ab && ca >= bc ? pointB : pointA);
        },
        getDistance: function (point1, point2) {
            var x1 = point1.x;
            var y1 = point1.y;
            var x2 = point2.x;
            var y2 = point2.y;
            return Math.sqrt(Math.pow(x2 - x1, 2.0) + Math.pow(y2 - y1, 2.0));
        }
    };
    return GeometryService
}));