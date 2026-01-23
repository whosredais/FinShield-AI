package com.finshield.core_banking.controller;

import com.finshield.core_banking.entity.Transaction;
import com.finshield.core_banking.repository.TransactionRepository;
import com.finshield.core_banking.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
// ⚠️ TRES IMPORTANT : Cette ligne autorise React (port 5173) à parler à Java
@CrossOrigin(origins = "http://localhost:5173") 
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;

    // 1. Pour créer une transaction (Ce qu'on avait déjà)
    @PostMapping
    public Transaction createTransaction(@RequestBody TransactionRequest request) {
        return transactionService.processTransaction(request.amount(), request.distance());
    }

    // 2. NOUVEAU : Pour récupérer toute la liste (Historique)
    @GetMapping
    public List<Transaction> getAllTransactions() {
        // On trie par ID décroissant (les plus récents en haut)
        return transactionRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
    }

    public record TransactionRequest(Double amount, Double distance) {}
}