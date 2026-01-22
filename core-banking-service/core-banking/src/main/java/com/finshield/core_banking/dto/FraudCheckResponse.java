package com.finshield.core_banking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FraudCheckResponse {

    // On force le lien avec le JSON de Python
    @JsonProperty("is_fraud")
    private boolean isFraud; // J'ai renommé en camelCase (standard Java)

    @JsonProperty("risk_score")
    private Double riskScore; // Renommé aussi pour être propre

    private String message;
}