package kr.kro.hex.service;

import java.util.List;

import kr.kro.hex.domain.Group;

/**
 * 그룹 서비스의 인터페이스
 *
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-23 오후 11:06
 */

public interface GroupService {

    /**
     * 그룹 추가하기
     *
     * @param group 그룹
     * @author Rubisco
     */
    void insertCategory(Group group);

    /**
     * 그룹 목록 가져오기
     *
     * @return 그룹 목록
     * @author Rubisco
     */
    List<Group> getGroupList();
    
    /**
     * 그룹 가져오기
     *
     * @param group 그룹
     * @author Rubisco
     */
    Group getGroup(Group group);

    /**
     * 그룹 수정하기
     *
     * @param group 그룹
     * @author Rubisco
     */
    void updateGroup(Group group);

    /**
     * 그룹 삭제하기
     *
     * @param group 그룹
     * @author Rubisco
     */
    void deleteGroup(Group group);
}