package com.fablecraft.entity

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@Table(name = "factions")
@EntityListeners(AuditingEntityListener::class)
data class Faction(
    @Id
    val id: String,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    var project: Project,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    var name: String,
    
    @Column(columnDefinition = "TEXT")
    var description: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var goals: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var methods: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var history: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var leadership: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var resources: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var relationships: String? = "",
    
    @Column(columnDefinition = "TEXT[]")
    var tags: Array<String> = arrayOf(),
    
    @Column(columnDefinition = "TEXT")
    var type: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var structure: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var status: String? = "",
    
    @Column(name = "display_image_id", columnDefinition = "TEXT")
    var displayImageId: String? = null,
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    var imageUrl: String? = null,
    
    @Column(columnDefinition = "TEXT[]")
    var portraits: Array<String> = arrayOf(),
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime? = null,
    
    @LastModifiedDate
    @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null
)