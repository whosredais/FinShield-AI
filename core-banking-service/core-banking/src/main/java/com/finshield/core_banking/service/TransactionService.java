package com.finshield.core_banking.service;

import com.finshield.core_banking.dto.FraudCheckResponse;
import com.finshield.core_banking.entity.Transaction;
import com.finshield.core_banking.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    // On injecte l'URL depuis application.properties
    // Si on est dans Docker, on pourra écraser cette valeur facilement !
    @org.springframework.beans.factory.annotation.Value("${fraud.api.url}")
    private String fraudApiUrl;

    public Transaction processTransaction(Double amount, Double distance) {
        RestTemplate restTemplate = new RestTemplate();
        FraudRequest request = new FraudRequest(amount, distance);

        // On utilise la variable dynamique 'fraudApiUrl'
        FraudCheckResponse fraudResponse = restTemplate.postForObject(
                fraudApiUrl, 
                request, 
                FraudCheckResponse.class
        );

        Transaction transaction = Transaction.builder()
                .amount(amount)
                .distance(distance)
                .timestamp(LocalDateTime.now())
                .isFraud(fraudResponse.isFraud()) // <-- Nouveau nom (sans tiret)
                .fraudProbability(fraudResponse.getRiskScore()) // <-- Nouveau nom
                .status(fraudResponse.isFraud() ? "REJECTED_FRAUD" : "APPROVED")
                .build();

        return transactionRepository.save(transaction);
    }

    public record FraudRequest(Double amount, Double distance) {}
}