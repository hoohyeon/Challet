package com.challet.kbbankservice.domain.controller;

import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.kbbankservice.domain.service.KbBankService;
import com.challet.kbbankservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/kb-bank")
@RequiredArgsConstructor
@Tag(name = "ChalletController", description = "KB은행 컨트롤러")
public class KbBankController {

    private final KbBankService kbBankService;

    @GetMapping()
    @Operation(summary = "국민은행 조회", description = "전화번호를 이용하여 국민은행 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<AccountInfoResponseListDTO> getAccountInfo(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        AccountInfoResponseListDTO accounts = kbBankService.getAccountsByPhoneNumber(tokenHeader);
        if (accounts.accountCount() == 0) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(accounts);
    }

    @GetMapping("/account")
    @Operation(summary = "국민은행 계좌거래내역 조회", description = "계좌 ID를 통해 계좌내역 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<TransactionResponseListDTO> getAccountTransactions(
        @RequestHeader("AccountId") Long accountId) {
        TransactionResponseListDTO transactionList = kbBankService.getAccountTransactionList(
            accountId);
        return ResponseEntity.status(HttpStatus.OK).body(transactionList);
    }

    @GetMapping("/details")
    @Operation(summary = "극민은행 상세 거래 내역 조회", description = "거래내역 ID를 통해 상세 거래 내역 조회 내역")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 상세 거래내역 조회 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 상세 거래내역 조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<TransactionDetailResponseDTO> getAccountTransactionDetails(
        @RequestHeader("TransactionId") Long transactionId) {
        TransactionDetailResponseDTO transaction = kbBankService.getTransactionInfo(transactionId);
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }

    @PostMapping("/mydata-connect")
    @Operation(summary = "극민은행 계좌 마이데이터 연결", description = "전화번호를 통해 계좌 연결")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 연결 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 연결 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<AccountInfoResponseListDTO> connectMyDataAccount(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        kbBankService.connectMyDataAccount(tokenHeader);
        AccountInfoResponseListDTO myDataAccounts = kbBankService.getAccountsByPhoneNumber(
            tokenHeader);
        return ResponseEntity.status(HttpStatus.OK).body(myDataAccounts);
    }

    @GetMapping("/search")
    @Operation(summary = "극민은행 계좌 거래 내역 검색", description = "keyword, category를 통해 거래 내역 검색")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "검색 성공"),
        @ApiResponse(responseCode = "400", description = "검색 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<TransactionResponseListDTO> searchAccountTransactions(
        @RequestParam String keyword,
        @RequestParam String category) {
        return null;
    }

}
