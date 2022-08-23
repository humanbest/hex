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
    private GroupRepository groupRepo;

    /**
     * 그룹 추가하기
     *
     * @param group 그룹
     * @author Rubisco
     */
    public void insertCategory(Group group) {
        groupRepo.save(group);
    };

    /**
     * 그룹 목록 가져오기
     *
     * @return 그룹 목록
     * @author Rubisco
     */
    public List<Group> getGroupList() {
        return groupRepo.findAll();
    };
    
    /**
     * 그룹 가져오기
     *
     * @param groupId 그룹 ID
     * @author Rubisco
     */
    public Group getGroup(Long groupId) {
        return groupRepo.findById(groupId).get();
    };

    /**
     * 그룹 수정하기
     *
     * @param group 그룹
     * @author Rubisco
     */
    public void updateGroup(Group group) {
        groupRepo.save(getGroup(group.getGroupId()).update(group));
    };

    /**
     * 그룹 삭제하기
     *
     * @param groupId 그룹 ID
     * @author Rubisco
     */
    public void deleteGroup(Long groupId) {
        groupRepo.deleteById(groupId);
    };
}
