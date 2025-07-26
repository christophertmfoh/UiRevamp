package com.fablecraft.repository

import com.fablecraft.entity.Character
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface CharacterRepository : JpaRepository<Character, String> {
    
    @Query("SELECT c FROM Character c WHERE c.project.id = :projectId ORDER BY c.createdAt DESC")
    fun findByProjectIdOrderByCreatedAt(@Param("projectId") projectId: String): List<Character>
    
    @Query("SELECT c FROM Character c WHERE c.project.id = :projectId AND c.name ILIKE %:name%")
    fun findByProjectIdAndNameContainingIgnoreCase(
        @Param("projectId") projectId: String, 
        @Param("name") name: String
    ): List<Character>
    
    @Query("SELECT COUNT(c) FROM Character c WHERE c.project.id = :projectId")
    fun countByProjectId(@Param("projectId") projectId: String): Long
}