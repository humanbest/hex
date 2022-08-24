package kr.kro.hex.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.kro.hex.domain.Group;
import kr.kro.hex.persistance.GroupRepository;
import kr.kro.hex.service.GroupService;
import lombok.RequiredArgsConstructor;

/**
 * 그룹 서비스의 구현체
 *
 * @see Group 그룹 Entity
 * @see GroupRepository 그룹 레포지토리
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-23 오후 11:06
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GroupServiceImpl implements GroupService {

    /** 그룹 레포지토리 */
    private final GroupRepository groupRepo;

    /**
     * 그룹을 등록합니다.
     *
     * @param group 그룹
     * @author Rubisco
     */
    public void insertCategory(Group group) {
        groupRepo.save(group);
    };

    /**
     * 그룹 목록을 조회합니다.
     *
     * @return 그룹 목록
     * @author Rubisco
     */
    public List<Group> getGroupList() {
        return groupRepo.findAll();
    };
    
    /**
     * groupId에 해당하는 그룹을 조회합니다.
     *
     * @param group 그룹
     * @author Rubisco
     */
    public Group getGroup(Group group) {
        return groupRepo.findById(group.getGroupId()).get();
    };

    /**
     * 그룹을 수정합니다.
     *
     * @param group 그룹
     * @author Rubisco
     */
    public void updateGroup(Group group) {
        groupRepo.save(getGroup(group).update(group));
    };

    /**
     * groupId에 해당하는 그룹을 삭제합니다.
     *
     * @param group 그룹
     * @author Rubisco
     */
    public void deleteGroup(Group group) {
        groupRepo.deleteById(group.getGroupId());
    };
}
