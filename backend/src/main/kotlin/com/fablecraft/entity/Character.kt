package com.fablecraft.entity

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@Table(name = "characters")
@EntityListeners(AuditingEntityListener::class)
data class Character(
    @Id
    val id: String,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    var project: Project,
    
    // Basic Information
    @Column(columnDefinition = "TEXT")
    var name: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var title: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var role: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var race: String? = "",
    
    @Column(name = "class", columnDefinition = "TEXT")
    var characterClass: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var age: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var species: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var nicknames: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var aliases: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var ethnicity: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var profession: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var occupation: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var birthdate: String? = "",
    
    @Column(name = "zodiac_sign", columnDefinition = "TEXT")
    var zodiacSign: String? = "",
    
    // Physical Description
    @Column(name = "physical_description", columnDefinition = "TEXT")
    var physicalDescription: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var height: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var weight: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var build: String? = "",
    
    @Column(name = "body_type", columnDefinition = "TEXT")
    var bodyType: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var eyes: String? = "",
    
    @Column(name = "eye_color", columnDefinition = "TEXT")
    var eyeColor: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var hair: String? = "",
    
    @Column(name = "hair_color", columnDefinition = "TEXT")
    var hairColor: String? = "",
    
    @Column(name = "hair_style", columnDefinition = "TEXT")
    var hairStyle: String? = "",
    
    @Column(name = "facial_hair", columnDefinition = "TEXT")
    var facialHair: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var skin: String? = "",
    
    @Column(name = "skin_tone", columnDefinition = "TEXT")
    var skinTone: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var complexion: String? = "",
    
    @Column(name = "facial_features", columnDefinition = "TEXT")
    var facialFeatures: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var attire: String? = "",
    
    @Column(name = "clothing_style", columnDefinition = "TEXT")
    var clothingStyle: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var accessories: String? = "",
    
    @Column(name = "distinguishing_marks", columnDefinition = "TEXT")
    var distinguishingMarks: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var scars: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var tattoos: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var piercings: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var birthmarks: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var posture: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var gait: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var gestures: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var mannerisms: String? = "",
    
    // Personality & Psychology
    @Column(columnDefinition = "TEXT")
    var description: String? = "",
    
    @Column(name = "character_summary", columnDefinition = "TEXT")
    var characterSummary: String? = "",
    
    @Column(name = "one_line", columnDefinition = "TEXT")
    var oneLine: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var personality: String? = "",
    
    @Column(name = "personality_traits", columnDefinition = "TEXT[]")
    var personalityTraits: Array<String> = arrayOf(),
    
    @Column(columnDefinition = "TEXT")
    var temperament: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var disposition: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var worldview: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var beliefs: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var values: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var principles: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var morals: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var ethics: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var virtues: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var vices: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var habits: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var quirks: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var idiosyncrasies: String? = "",
    
    @Column(name = "pet_peeves", columnDefinition = "TEXT")
    var petPeeves: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var likes: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var dislikes: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var hobbies: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var interests: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var passions: String? = "",
    
    // Background & History
    @Column(columnDefinition = "TEXT")
    var backstory: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var background: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var origin: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var upbringing: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var childhood: String? = "",
    
    @Column(name = "family_history", columnDefinition = "TEXT")
    var familyHistory: String? = "",
    
    @Column(name = "social_class", columnDefinition = "TEXT")
    var socialClass: String? = "",
    
    @Column(name = "economic_status", columnDefinition = "TEXT")
    var economicStatus: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var education: String? = "",
    
    @Column(name = "academic_history", columnDefinition = "TEXT")
    var academicHistory: String? = "",
    
    @Column(name = "formative_events", columnDefinition = "TEXT")
    var formativeEvents: String? = "",
    
    @Column(name = "life_changing_moments", columnDefinition = "TEXT")
    var lifeChangingMoments: String? = "",
    
    @Column(name = "personal_struggle", columnDefinition = "TEXT")
    var personalStruggle: String? = "",
    
    // Abilities & Skills
    @Column(columnDefinition = "TEXT[]")
    var abilities: Array<String> = arrayOf(),
    
    @Column(columnDefinition = "TEXT[]")
    var skills: Array<String> = arrayOf(),
    
    @Column(columnDefinition = "TEXT[]")
    var talents: Array<String> = arrayOf(),
    
    @Column(columnDefinition = "TEXT[]")
    var expertise: Array<String> = arrayOf(),
    
    @Column(name = "special_abilities", columnDefinition = "TEXT")
    var specialAbilities: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var powers: String? = "",
    
    @Column(name = "magical_abilities", columnDefinition = "TEXT")
    var magicalAbilities: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var superpowers: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var strengths: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var weaknesses: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var competencies: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var training: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var experience: String? = "",
    
    // Story & Motivation
    @Column(columnDefinition = "TEXT")
    var motivations: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var goals: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var objectives: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var wants: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var desires: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var needs: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var drives: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var ambitions: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var fears: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var phobias: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var anxieties: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var insecurities: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var secrets: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var shame: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var guilt: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var regrets: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var trauma: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var wounds: String? = "",
    
    @Column(name = "coping_mechanisms", columnDefinition = "TEXT")
    var copingMechanisms: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var defenses: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var vulnerabilities: String? = "",
    
    @Column(name = "blind_spots", columnDefinition = "TEXT")
    var blindSpots: String? = "",
    
    // Story Function
    @Column(columnDefinition = "TEXT")
    var obstacles: String? = "",
    
    @Column(name = "conflict_sources", columnDefinition = "TEXT")
    var conflictSources: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var conflicts: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var stakes: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var consequences: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var arc: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var journey: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var transformation: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var growth: String? = "",
    
    @Column(name = "narrative_role", columnDefinition = "TEXT")
    var narrativeRole: String? = "",
    
    @Column(name = "story_function", columnDefinition = "TEXT")
    var storyFunction: String? = "",
    
    @Column(name = "plot_relevance", columnDefinition = "TEXT")
    var plotRelevance: String? = "",
    
    @Column(name = "connection_to_events", columnDefinition = "TEXT")
    var connectionToEvents: String? = "",
    
    // Relationships
    @Column(columnDefinition = "TEXT")
    var relationships: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var family: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var parents: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var siblings: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var spouse: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var children: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var friends: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var allies: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var enemies: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var mentors: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var rivals: String? = "",
    
    @Column(name = "social_circle", columnDefinition = "TEXT")
    var socialCircle: String? = "",
    
    // Language & Communication
    @Column(columnDefinition = "TEXT[]")
    var languages: Array<String> = arrayOf(),
    
    @Column(name = "native_language", columnDefinition = "TEXT")
    var nativeLanguage: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var accent: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var dialect: String? = "",
    
    @Column(name = "speech_patterns", columnDefinition = "TEXT")
    var speechPatterns: String? = "",
    
    @Column(name = "voice_description", columnDefinition = "TEXT")
    var voiceDescription: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var vocabulary: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var catchphrases: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var slang: String? = "",
    
    @Column(name = "communication_style", columnDefinition = "TEXT")
    var communicationStyle: String? = "",
    
    @Column(name = "prose_vibe", columnDefinition = "TEXT")
    var proseVibe: String? = "",
    
    // Meta Information
    @Column(columnDefinition = "TEXT[]")
    var archetypes: Array<String> = arrayOf(),
    
    @Column(columnDefinition = "TEXT[]")
    var tropes: Array<String> = arrayOf(),
    
    @Column(columnDefinition = "TEXT[]")
    var tags: Array<String> = arrayOf(),
    
    @Column(columnDefinition = "TEXT")
    var inspiration: String? = "",
    
    @Column(name = "based_on", columnDefinition = "TEXT")
    var basedOn: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var genre: String? = "",
    
    @Column(name = "character_type", columnDefinition = "TEXT")
    var characterType: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var importance: String? = "",
    
    @Column(name = "screen_time", columnDefinition = "TEXT")
    var screenTime: String? = "",
    
    @Column(name = "first_appearance", columnDefinition = "TEXT")
    var firstAppearance: String? = "",
    
    @Column(name = "last_appearance", columnDefinition = "TEXT")
    var lastAppearance: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var notes: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var development: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var evolution: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var alternatives: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var unused: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var research: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var references: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var mood: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var theme: String? = "",
    
    @Column(columnDefinition = "TEXT")
    var symbolism: String? = "",
    
    // Magic & Fantasy
    @Column(name = "magic_type", columnDefinition = "TEXT")
    var magicType: String? = "",
    
    @Column(name = "magic_source", columnDefinition = "TEXT")
    var magicSource: String? = "",
    
    @Column(name = "magic_limitations", columnDefinition = "TEXT")
    var magicLimitations: String? = "",
    
    // Technical Fields
    @Column(name = "is_model_trained")
    var isModelTrained: Boolean = false,
    
    @Column(name = "display_image_id")
    var displayImageId: Int? = null,
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    var imageUrl: String? = "",
    
    @Column(columnDefinition = "JSON")
    var portraits: String = "[]",
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: LocalDateTime? = null,
    
    @LastModifiedDate
    @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as Character
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
    
    override fun toString(): String = "Character(id='$id', name='$name', role='$role')"
}