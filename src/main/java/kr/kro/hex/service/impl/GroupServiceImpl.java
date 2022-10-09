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
 * @since 2022-08-20 오후 11:04
 * @version 20220823.0
 * @author Rubisco
 * @see Group 그룹 Entity
 * @see GroupRepository 그룹 레포지토리
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
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public Group insertGroup(Group group) {
        return groupRepo.save(group);
    };

    /**
     * 그룹 목록을 조회합니다.
     *
     * @return 그룹 목록
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public List<Group> getGroupList() {
        return groupRepo.findAll();
    };
    
    /**
     * 그룹을 조회합니다.
     *
     * @param group 그룹
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public Group getGroup(Group group) {
        
        if(group.getGroupId() != null) return groupRepo.findById(group.getGroupId()).get();
        else if(group.getGroupName() != null) return groupRepo.findByGroupName(group.getGroupName());

        return null;
    };

    /**
     * 그룹을 수정합니다.
     *
     * @param group 그룹
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public void updateGroup(Group group) {
        groupRepo.save(getGroup(group).update(group));
    };

    /**
     * 그룹을 삭제합니다.
     *
     * @param group 그룹
     * @since 2022-08-20 오후 11:04
     * @version 20220823.0
     * @author Rubisco
     */
    @Override
    public void deleteGroup(Group group) {
        groupRepo.deleteById(group.getGroupId());
    };
}
