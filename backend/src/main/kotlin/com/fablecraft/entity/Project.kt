package com.fablecraft.entity

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@Table(name = "projects")
@EntityListeners(AuditingEntityListener::class)
data class Project(
    @Id
    val id: String,
    
    @Column(nullable = false)
    var name: String,
    
    @Column(nullable = false)
    var type: String,
    
    @Column(columnDefinition = "TEXT")
    var description: String? = "",
    
    @Column(name = "genre", columnDefinition = "TEXT[]")
    var genre: Array<String> = arrayOf(),
    
    @Column(name = "manuscript_novel", columnDefinition = "TEXT")
    var manuscriptNovel: String? = "",
    
    @Column(name = "manuscript_screenplay", columnDefinition = "TEXT")
    var manuscriptScreenplay: String? = "",
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime? = null,
    
    @LastModifiedDate
    @Column(name = "last_modified")
    var lastModified: LocalDateTime? = null,
    
    // Relationships
    @OneToMany(mappedBy = "project", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var characters: MutableList<Character> = mutableListOf(),
    
    @OneToMany(mappedBy = "project", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var locations: MutableList<Location> = mutableListOf(),
    
    @OneToMany(mappedBy = "project", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var factions: MutableList<Faction> = mutableListOf(),
    
    @OneToMany(mappedBy = "project", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var items: MutableList<Item> = mutableListOf()
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as Project
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
    
    override fun toString(): String = "Project(id='$id', name='$name', type='$type')"
}