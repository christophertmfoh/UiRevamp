package com.fablecraft.controller

import com.fablecraft.entity.Character
import com.fablecraft.service.CharacterService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:5173"])
class CharacterController(
    private val characterService: CharacterService
) {
    
    @GetMapping("/projects/{projectId}/characters")
    fun getCharactersByProjectId(@PathVariable projectId: String): ResponseEntity<List<Character>> {
        val characters = characterService.getCharactersByProjectId(projectId)
        return ResponseEntity.ok(characters)
    }
    
    @GetMapping("/characters/{id}")
    fun getCharacterById(@PathVariable id: String): ResponseEntity<Character> {
        return characterService.getCharacterById(id)?.let { character ->
            ResponseEntity.ok(character)
        } ?: ResponseEntity.notFound().build()
    }
    
    @PostMapping("/projects/{projectId}/characters")
    fun createCharacter(
        @PathVariable projectId: String,
        @RequestBody character: Character
    ): ResponseEntity<Character> {
        return characterService.createCharacter(projectId, character)?.let { createdCharacter ->
            ResponseEntity.status(HttpStatus.CREATED).body(createdCharacter)
        } ?: ResponseEntity.badRequest().build()
    }
    
    @PutMapping("/characters/{id}")
    fun updateCharacter(
        @PathVariable id: String,
        @RequestBody character: Character
    ): ResponseEntity<Character> {
        return characterService.updateCharacter(id, character)?.let { updatedCharacter ->
            ResponseEntity.ok(updatedCharacter)
        } ?: ResponseEntity.notFound().build()
    }
    
    @DeleteMapping("/characters/{id}")
    fun deleteCharacter(@PathVariable id: String): ResponseEntity<Void> {
        return if (characterService.deleteCharacter(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/projects/{projectId}/characters/search")
    fun searchCharacters(
        @PathVariable projectId: String,
        @RequestParam name: String
    ): ResponseEntity<List<Character>> {
        val characters = characterService.searchCharacters(projectId, name)
        return ResponseEntity.ok(characters)
    }
    
    @GetMapping("/projects/{projectId}/characters/count")
    fun getCharacterCount(@PathVariable projectId: String): ResponseEntity<Map<String, Long>> {
        val count = characterService.getCharacterCount(projectId)
        return ResponseEntity.ok(mapOf("count" to count))
    }
}