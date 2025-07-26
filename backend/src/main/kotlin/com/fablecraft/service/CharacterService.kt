package com.fablecraft.service

import com.fablecraft.entity.Character
import com.fablecraft.entity.Project
import com.fablecraft.repository.CharacterRepository
import com.fablecraft.repository.ProjectRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class CharacterService(
    private val characterRepository: CharacterRepository,
    private val projectRepository: ProjectRepository
) {
    
    fun getCharactersByProjectId(projectId: String): List<Character> = 
        characterRepository.findByProjectIdOrderByCreatedAt(projectId)
    
    fun getCharacterById(id: String): Character? = 
        characterRepository.findById(id).orElse(null)
    
    fun createCharacter(projectId: String, character: Character): Character? {
        return projectRepository.findById(projectId).map { project ->
            character.project = project
            character.createdAt = LocalDateTime.now()
            character.updatedAt = LocalDateTime.now()
            characterRepository.save(character)
        }.orElse(null)
    }
    
    fun updateCharacter(id: String, updates: Character): Character? {
        return characterRepository.findById(id).map { existingCharacter ->
            existingCharacter.apply {
                // Update all fields from the updates object
                name = updates.name
                title = updates.title
                role = updates.role
                race = updates.race
                characterClass = updates.characterClass
                age = updates.age
                species = updates.species
                description = updates.description
                personality = updates.personality
                backstory = updates.backstory
                motivations = updates.motivations
                goals = updates.goals
                fears = updates.fears
                secrets = updates.secrets
                personalityTraits = updates.personalityTraits
                abilities = updates.abilities
                skills = updates.skills
                talents = updates.talents
                archetypes = updates.archetypes
                tags = updates.tags
                physicalDescription = updates.physicalDescription
                // ... (include other fields as needed)
                updatedAt = LocalDateTime.now()
            }
            characterRepository.save(existingCharacter)
        }.orElse(null)
    }
    
    fun deleteCharacter(id: String): Boolean {
        return if (characterRepository.existsById(id)) {
            characterRepository.deleteById(id)
            true
        } else {
            false
        }
    }
    
    fun searchCharacters(projectId: String, name: String): List<Character> = 
        characterRepository.findByProjectIdAndNameContainingIgnoreCase(projectId, name)
    
    fun getCharacterCount(projectId: String): Long = 
        characterRepository.countByProjectId(projectId)
}