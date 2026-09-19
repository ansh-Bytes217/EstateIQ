package com.estateiq.property.service;

import com.estateiq.common.security.CurrentUserProvider;
import com.estateiq.property.entity.AuditEvent;
import com.estateiq.property.repository.AuditEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditEventService {
    private final AuditEventRepository auditEventRepository;
    private final CurrentUserProvider currentUserProvider;

    public void record(String action, String resourceType, UUID resourceId, String metadata) {
        auditEventRepository.save(AuditEvent.builder()
                .id(UUID.randomUUID())
                .actorSubject(currentUserProvider.getCurrentUserSubject().orElse("system"))
                .action(action)
                .resourceType(resourceType)
                .resourceId(resourceId.toString())
                .metadata(metadata)
                .build());
    }
}
