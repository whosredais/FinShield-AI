package com.finshield.core_banking.controller;

import com.finshield.core_banking.entity.Transaction;
import com.finshield.core_banking.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public Transaction createTransaction(@RequestBody TransactionRequest request) {
        return transactionService.processTransaction(request.amount(), request.distance());
    }

    public record TransactionRequest(Double amount, Double distance) {}
}