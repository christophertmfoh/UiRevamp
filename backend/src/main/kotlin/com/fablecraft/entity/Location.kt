package com.fablecraft.entity

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@Table(name = "locations")
@EntityListeners(AuditingEntityListener::class)
data class Location(
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
    var history: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var significance: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var atmosphere: String? = "",
    
    @Column(columnDefinition = "TEXT[]")
    var tags: Array<String> = arrayOf(),
    
    @Column(name = "display_image_id", columnDefinition = "TEXT")
    var displayImageId: String? = null,
    
    @Column(name = "image_gallery", columnDefinition = "JSON")
    var imageGallery: String = "[]",
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime? = null
)