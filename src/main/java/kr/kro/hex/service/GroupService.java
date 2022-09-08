package kr.kro.hex.service;

import java.util.List;

import kr.kro.hex.domain.Group;

/**
 * 그룹 서비스의 인터페이스
 *
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 */

public interface GroupService {

    /**
     * 그룹을 등록합니다.
     *
     * @param group 그룹
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void insertGroup(Group group);

    /**
     * 그룹 목록을 조회합니다.
     *
     * @return 그룹 목록
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    List<Group> getGroupList();
    
    /**
     * 그룹을 조회합니다.
     *
     * @param group 그룹
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    Group getGroup(Group group);

    /**
     * 그룹을 수정합니다.
     *
     * @param group 그룹
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void updateGroup(Group group);

    /**
     * 그룹을 삭제합니다.
     *
     * @param group 그룹
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    void deleteGroup(Group group);
}