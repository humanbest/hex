package kr.kro.hex.dto;

import kr.kro.hex.domain.Group;
import lombok.Data;

@Data
public class GroupDto {
    
    private Long groupId;
    private String groupName;

    public Group toEntity() {
        return Group.builder()
            .groupId(groupId)
            .groupName(groupName)
            .build();
    }

    protected GroupDto() {}

    public GroupDto(Group group) {
        groupId = group.getGroupId();
        groupName = group.getGroupName();
    }
}
