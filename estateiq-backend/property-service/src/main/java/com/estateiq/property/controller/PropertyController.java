package com.estateiq.property.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/properties")
public class PropertyController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "Property Service is running"));
    }
    
    // Future Phase 2 endpoints:
    // @GetMapping("/{id}")
    // @PostMapping
    // @PutMapping("/{id}")
    // @DeleteMapping("/{id}")
}
