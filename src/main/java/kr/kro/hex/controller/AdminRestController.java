package kr.kro.hex.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import groovyjarjarpicocli.CommandLine.Model;
import kr.kro.hex.domain.Board;
import kr.kro.hex.dto.AdminBoardSearchDto;
import kr.kro.hex.dto.BoardDto;
import kr.kro.hex.dto.DocumentIdDto;
import kr.kro.hex.service.AdminService;
import kr.kro.hex.service.BoardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AdminRestController {

    public final AdminService adminService;
    public final BoardService boardService;

    //게시글 선택 삭제
    @PostMapping("/delete")
    public ResponseEntity<DocumentIdDto> deleteBoard(@RequestBody DocumentIdDto documentIdDto){
        adminService.deleteAllInBatch(documentIdDto);
        return ResponseEntity.ok(documentIdDto);
    }

    @PostMapping("/getSearchList")
    @ResponseBody
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
    
}
