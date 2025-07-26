package com.fablecraft.controller

import com.fablecraft.entity.Project
import com.fablecraft.service.ProjectService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:5173"])
class ProjectController(
    private val projectService: ProjectService
) {
    
    @GetMapping
    fun getAllProjects(): ResponseEntity<List<Project>> {
        val projects = projectService.getAllProjects()
        return ResponseEntity.ok(projects)
    }
    
    @GetMapping("/{id}")
    fun getProjectById(@PathVariable id: String): ResponseEntity<Project> {
        return projectService.getProjectById(id)?.let { project ->
            ResponseEntity.ok(project)
        } ?: ResponseEntity.notFound().build()
    }
    
    @PostMapping
    fun createProject(@RequestBody project: Project): ResponseEntity<Project> {
        val createdProject = projectService.createProject(project)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject)
    }
    
    @PutMapping("/{id}")
    fun updateProject(
        @PathVariable id: String,
        @RequestBody project: Project
    ): ResponseEntity<Project> {
        return projectService.updateProject(id, project)?.let { updatedProject ->
            ResponseEntity.ok(updatedProject)
        } ?: ResponseEntity.notFound().build()
    }
    
    @DeleteMapping("/{id}")
    fun deleteProject(@PathVariable id: String): ResponseEntity<Void> {
        return if (projectService.deleteProject(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/by-type/{type}")
    fun getProjectsByType(@PathVariable type: String): ResponseEntity<List<Project>> {
        val projects = projectService.getProjectsByType(type)
        return ResponseEntity.ok(projects)
    }
}