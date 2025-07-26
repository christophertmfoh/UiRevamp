package com.fablecraft.repository

import com.fablecraft.entity.Project
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface ProjectRepository : JpaRepository<Project, String> {
    
    @Query("SELECT p FROM Project p ORDER BY p.lastModified DESC")
    fun findAllOrderByLastModified(): List<Project>
    
    @Query("SELECT p FROM Project p WHERE p.type = :type ORDER BY p.lastModified DESC")
    fun findByTypeOrderByLastModified(type: String): List<Project>
}