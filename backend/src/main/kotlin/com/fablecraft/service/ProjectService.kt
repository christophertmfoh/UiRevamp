package com.fablecraft.service

import com.fablecraft.entity.Project
import com.fablecraft.repository.ProjectRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class ProjectService(
    private val projectRepository: ProjectRepository
) {
    
    fun getAllProjects(): List<Project> = projectRepository.findAllOrderByLastModified()
    
    fun getProjectById(id: String): Project? = projectRepository.findById(id).orElse(null)
    
    fun createProject(project: Project): Project {
        val now = LocalDateTime.now()
        project.createdAt = now
        project.lastModified = now
        return projectRepository.save(project)
    }
    
    fun updateProject(id: String, updates: Project): Project? {
        return projectRepository.findById(id).map { existingProject ->
            existingProject.apply {
                name = updates.name
                type = updates.type
                description = updates.description
                genre = updates.genre
                manuscriptNovel = updates.manuscriptNovel
                manuscriptScreenplay = updates.manuscriptScreenplay
                lastModified = LocalDateTime.now()
            }
            projectRepository.save(existingProject)
        }.orElse(null)
    }
    
    fun deleteProject(id: String): Boolean {
        return if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id)
            true
        } else {
            false
        }
    }
    
    fun getProjectsByType(type: String): List<Project> = 
        projectRepository.findByTypeOrderByLastModified(type)
}