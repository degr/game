package org.forweb.commandos.dao;

import org.forweb.commandos.entity.Map;
import org.forweb.database.AbstractDao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MapDao extends AbstractDao<Map> {
    Map findMapByMapHash(String hash);


    @Query(nativeQuery =  true, value = "select * from map limit :page, :size")
    List<Map> findMapsForPage(@Param("page")Integer page, @Param("size")Integer size);

    @Query(nativeQuery =  true, value = "select * from map where title like :title limit :page, :size")
    List<Map> findMapsForPage(@Param("title")String title, @Param("page")Integer page, @Param("size")Integer size);

    Map findMapByTitle(String title);

    @Query(nativeQuery = true, value ="select map.title from map where map.game_type = :game_type limit 20")
    List<String> loadMapNames(@Param("game_type") String gameType);

    @Query(nativeQuery = true, value = "select map.title from map limit 20")
    List<String> loadMapNames();

    @Query(nativeQuery = true, value = "select * from map where title = :title limit 0, 1")
    Map findMapByName(@Param("title") String title);
}
