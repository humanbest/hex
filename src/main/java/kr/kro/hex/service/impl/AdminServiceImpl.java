package kr.kro.hex.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import kr.kro.hex.domain.Board;
import kr.kro.hex.dto.DocumentIdDto;
import kr.kro.hex.persistance.BoardRepository;
import kr.kro.hex.service.AdminService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{

    private final BoardRepository boardRepo;

    @Override
    public void deleteAllInBatch(DocumentIdDto documentIdDto) {
        
        List<Board> boardList = new ArrayList<>();
        
        for (long id : documentIdDto.getDocumentIdList()) {
            boardList.add(Board.builder().documentId(id).build());
        }
        boardRepo.deleteAllInBatch(boardList);
    }
    
}
