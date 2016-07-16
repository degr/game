var GeometryService = {
    lineIntersectCircle: function(line, circle) {
        var pointB = line.b;
        var pointA = line.a;
        if(pointA.x == pointB.x && pointA.y == pointB.y) {
            return Math.pow(pointA.x - circle.x, 2) + Math.pow(pointA.y - circle.y, 2) == circle.radius * circle.radius?[pointA]:[];
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
            if(disc <= 1.0E-4 && disc >= -1.0E-4) {
                disc = 0;
            }

            if(disc < 0) {
                return [];
            } else {
                var tmpSqrt = Math.sqrt(disc);
                var abScalingFactor1 = -pBy2 + tmpSqrt;
                var abScalingFactor2 = -pBy2 - tmpSqrt;
                var p1 = {x: pointA.x - baX * abScalingFactor1, y: pointA.y - baY * abScalingFactor1};
                var out1 = GeometryService.getMiddle(pointA, pointB, p1);
                if(disc == 0) {
                    return out1 == p1?[p1]:[];
                } else {
                    var p2 = {x: pointA.x - baX * abScalingFactor2, y: pointA.y - baY * abScalingFactor2};
                    var out2 = GeometryService.getMiddle(pointA, pointB, p2);
                    return out1 == p1?(out2 == p2?[p1, p2]:[p1]):(out2 == p2?[p2]:[]);
                }
            }
        }
    },
    getMiddle: function(pointA, pointB, pointC) {
        var ab = GeometryService.getDistance(pointA, pointB);
        var bc = GeometryService.getDistance(pointB, pointC);
        var ca = GeometryService.getDistance(pointC, pointA);
        return ab >= bc && ab >= ca?pointC:(ca >= ab && ca >= bc?pointB:pointA);
    },
    getDistance: function(point1, point2) {
        var x1 = point1.x;
        var y1 = point1.y;
        var x2 = point2.x;
        var y2 = point2.y;
        return Math.sqrt(Math.pow(x2 - x1, 2.0) + Math.pow(y2 - y1, 2.0));
    }
};