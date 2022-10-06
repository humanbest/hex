package kr.kro.hex.service;

import kr.kro.hex.dto.DocumentIdDto;

public interface AdminService {
    void deleteAllInBatch(DocumentIdDto documentIdDto);
}
