package websocket.service;

import websocket.entity.ammo.Projectile;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ProjectileService {
    private static ProjectileService projectileService = new ProjectileService();
    private ProjectileService() {
    }
    public static ProjectileService getInstance(){
        return projectileService;
    }

    public void onProjectileLifecicle(ConcurrentHashMap<Integer, Projectile> projectiles) {
        Long now = System.currentTimeMillis();
        for(Map.Entry<Integer, Projectile> entry : projectiles.entrySet()) {
            Projectile projectile = entry.getValue();
            if(projectile.isInstant()) {
                if(projectile.getCreationTime() + projectile.getLifeTime() < now) {
                    projectiles.remove(entry.getKey());
                }
            } else {
                
            }
        }
    }
}
