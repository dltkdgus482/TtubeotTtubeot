package com.user.userttubeot.ttubeot.domain.repository;

import com.user.userttubeot.ttubeot.domain.model.Ttubeot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TtubeotRepository extends JpaRepository<Ttubeot, Integer> {

    // 특정 타입의 모든 뚜벗 목록을 반환
    List<Ttubeot> findAllByTtubeotType(int type);

}
