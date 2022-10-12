package kr.kro.hex.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import groovyjarjarpicocli.CommandLine.Model;
import kr.kro.hex.domain.Board;
import kr.kro.hex.dto.AdminBoardSearchDto;
import kr.kro.hex.dto.BoardDto;
import kr.kro.hex.dto.DocumentIdDto;
import kr.kro.hex.dto.GroupDto;
import kr.kro.hex.service.AdminService;
import kr.kro.hex.service.BoardService;
import kr.kro.hex.service.GroupService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path="/api/admin")
public class AdminRestController {

    private final AdminService adminService;
    private final BoardService boardService;
    private final GroupService groupService;

    //게시글 선택 삭제
    @PostMapping("/delete")
    public ResponseEntity<DocumentIdDto> deleteBoard(@RequestBody DocumentIdDto documentIdDto){
        adminService.deleteAllInBatch(documentIdDto);
        return ResponseEntity.ok(documentIdDto);
    }

    @ResponseBody
    @PostMapping("/api/admin")
    private ResponseEntity<List<BoardDto>> getSearchList(
        Pageable pageable,
        @RequestBody AdminBoardSearchDto adminBoardSearchDto,
        Model model
    ) throws Exception{
        Page<Board> boardPageList = boardService.findByKeyword(adminBoardSearchDto, pageable);
        List<BoardDto> boardList = new ArrayList<>();
        for(Board board :boardPageList.getContent()) {
            boardList.add(new BoardDto().entityToDto(board));
        }
            return ResponseEntity.ok(boardList);
    }

    @PostMapping("/group")
    private @ResponseBody ResponseEntity<GroupDto> insertGroup(@RequestBody GroupDto groupDto) {
        return ResponseEntity.ok(new GroupDto(groupService.insertGroup(groupDto.toEntity())));
    }

    @PatchMapping("/group")
    private @ResponseBody ResponseEntity<GroupDto> updateGroup(@RequestBody GroupDto groupDto) {
        groupService.updateGroup(groupDto.toEntity());
        return ResponseEntity.ok(groupDto);
    }

    @DeleteMapping("/group")
    private @ResponseBody ResponseEntity<GroupDto> deleteGroup(@RequestBody GroupDto groupDto) {
        groupService.deleteGroup(groupDto.toEntity());
        return ResponseEntity.ok(groupDto);
    }

    
}
