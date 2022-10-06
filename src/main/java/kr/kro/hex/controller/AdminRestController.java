package kr.kro.hex.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kr.kro.hex.dto.DocumentIdDto;
import kr.kro.hex.service.AdminService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AdminRestController {

    public final AdminService adminService;

    //게시글 선택 삭제
    @PostMapping("/delete")
    public ResponseEntity<DocumentIdDto> deleteBoard(@RequestBody DocumentIdDto documentIdDto){
        System.out.println(documentIdDto.getDocumentIdList()[0]);
        adminService.deleteAllInBatch(documentIdDto);
        return ResponseEntity.ok(documentIdDto);
    }
    
}
