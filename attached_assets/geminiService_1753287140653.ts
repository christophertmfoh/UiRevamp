
import { GoogleGenAI, Type } from "@google/genai";
import type { BrainstormResult, FleshedOutCharacter, FleshedOutItem, Character, GeneratedCharacter, Location, Faction, FleshedOutLocation, FleshedOutFaction, Project, AICoachFeedback, ProseDocument, ImportedData, OutlineNode, ImportedManuscriptData } from './types';
import { BUILT_IN_CRAFT_KNOWLEDGE } from './constants';

// Robust API Key Check
if (!process.env.API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Please follow the instructions in README.md to configure your API key.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const SYSTEM_INSTRUCTION = `You are a world-class creative writing assistant and story architect for the Mythos Weaver application. Your goal is to help users build rich, compelling narratives. Adhere to the provided craft guidelines and emulate the prose styles when requested. Your responses must always be in JSON format as specified.`;

/**
 * Retrieves the content of all craft knowledge modules enabled for a specific tool.
 * @param project The current project containing the AI configuration.
 * @param toolId The ID of the tool being used (e.g., 'character-generator').
 * @returns An array of content strings from the enabled craft knowledge modules.
 */
function getEnabledCraftContent(project: Project, toolId: string): string[] {
    const enabledBookIds = project.aiCraftConfig[toolId] || [];
    if (enabledBookIds.length === 0) return [];

    return BUILT_IN_CRAFT_KNOWLEDGE
        .filter(book => enabledBookIds.includes(book.id))
        .map(book => `[CRAFT MODULE: ${book.title}]\n${book.content}`);
}

/**
 * Builds the full prompt for the Gemini API call by prepending context
 * from enabled craft knowledge and user-provided prose documents.
 * @param prompt The specific user request for this call.
 * @param project The current project.
 * @param toolId The ID of the tool making the request.
 * @returns The fully-formed content string for the API request.
 */
function buildContentWithContext(prompt: string, project: Project, toolId: string): string {
    let fullPrompt = "";

    const craftKnowledgeContent = getEnabledCraftContent(project, toolId);
    const proseDocuments = project.proseDocuments;

    const craftContext = craftKnowledgeContent.join('\n\n---\n\n');
    const proseContext = proseDocuments.map(doc => `[PROSE STYLE EXAMPLE: ${doc.fileName}]\n${doc.content}`).join('\n\n---\n\n');

    if (craftContext) {
        fullPrompt += "### CORE WRITING PRINCIPLES\n";
        fullPrompt += `Your output MUST adhere to the following principles provided by the user:\n${craftContext}\n\n`;
    }
    
    if (proseContext) {
        fullPrompt += "### PROSE STYLE EMULATION\n";
        fullPrompt += `Your output SHOULD emulate the following prose styles:\n${proseContext}\n\n`;
    }

    fullPrompt += `### USER REQUEST\nBased on any provided context, fulfill the following request:\n\n${prompt}`;
    
    return fullPrompt;
}


export async function brainstormIdea(prompt: string, project: Project | null): Promise<BrainstormResult> {
  const toolId = 'brainstorm-generator';
  const userPrompt = `Brainstorm a story idea based on this concept: "${prompt}". Provide a title, a logline, a list of character archetypes, and some potential plot hooks.`;
  
  // A project might not exist for the initial brainstorm, so we handle that case.
  const contents = project ? buildContentWithContext(userPrompt, project, toolId) : userPrompt;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy title for the story." },
          logline: { type: Type.STRING, description: "A one-sentence summary of the story's plot." },
          characters: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key character archetypes (e.g., 'The grizzled detective', 'The femme fatale')."
          },
          plot_hooks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of intriguing plot hooks or starting points for the story."
          }
        },
        required: ["title", "logline", "characters", "plot_hooks"]
      },
    },
  });

  const jsonString = response.text;
  return JSON.parse(jsonString) as BrainstormResult;
}

export async function generateNewCharacter(concept: string, project: Project, toolId: string): Promise<GeneratedCharacter> {
    const userPrompt = `Generate a complete, new character for a story based on this high-level concept: "${concept}".
        Provide all of the following fields: a creative name, a list of aliases (can be empty), a list of one to three primary archetypes (e.g., ['The Reluctant Hero', 'The Cynical Survivor']), a story role (e.g., 'Protagonist'), a detailed physical description, a summary of their personality traits, their core motivations, their greatest fears, their key strengths, their significant flaws, a compelling backstory, a hidden secret, their primary internal conflict, a summary of their story arc, a newline-separated list of their key abilities or skills, and a brief psychological profile summarizing their core personality drivers.`;
    
    const contents = buildContentWithContext(userPrompt, project, toolId);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 },
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    aliases: { type: Type.ARRAY, items: { type: Type.STRING } },
                    archetype: { type: Type.ARRAY, items: { type: Type.STRING } },
                    role: { type: Type.STRING },
                    description: { type: Type.STRING },
                    personalityTraits: { type: Type.STRING },
                    motivations: { type: Type.STRING },
                    fears: { type: Type.STRING },
                    strengths: { type: Type.STRING },
                    flaws: { type: Type.STRING },
                    backstory: { type: Type.STRING },
                    secrets: { type: Type.STRING },
                    internalConflict: { type: Type.STRING },
                    storyArc: { type: Type.STRING },
                    abilities: { type: Type.STRING },
                    psychologicalProfile: { type: Type.STRING },
                },
                required: ["name", "aliases", "archetype", "role", "description", "personalityTraits", "motivations", "fears", "strengths", "flaws", "backstory", "secrets", "internalConflict", "storyArc", "abilities", "psychologicalProfile"]
            }
        }
    });
    const jsonString = response.text;
    return JSON.parse(jsonString) as GeneratedCharacter;
}


export async function fleshOutCharacter(character: Character, project: Project, toolId: string): Promise<FleshedOutCharacter> {
    const { archetype, ...restOfCharacter } = character;
    const charForPrompt = {
        ...restOfCharacter,
        archetypes: archetype, // rename for clarity in prompt
    };

    const existingData = JSON.stringify(
        charForPrompt, 
        (key, value) => (value === '' || (Array.isArray(value) && value.length === 0)) ? undefined : value, 
        2
    );
    
    const userPrompt = `A user is developing a character and has provided the following data: ${existingData}. 
        Their archetypes are: ${character.archetype.join(', ')}.
        Your task is to help them flesh out the character by generating content ONLY for the fields that are missing or very sparse (e.g., less than 20 characters). 
        Do not repeat or replace existing detailed information. 
        The fields to potentially fill are: description, personalityTraits, motivations, fears, strengths, flaws, backstory, secrets, internalConflict, storyArc, abilities, psychologicalProfile.
        Generate creative and compelling content for any of those fields that need it. Return JSON with only the fields you generated.`;

    const contents = buildContentWithContext(userPrompt, project, toolId);
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 },
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    personalityTraits: { type: Type.STRING },
                    motivations: { type: Type.STRING },
                    fears: { type: Type.STRING },
                    strengths: { type: Type.STRING },
                    flaws: { type: Type.STRING },
                    backstory: { type: Type.STRING },
                    secrets: { type: Type.STRING },
                    internalConflict: { type: Type.STRING },
                    storyArc: { type: Type.STRING },
                    abilities: { type: Type.STRING },
                    psychologicalProfile: { type: Type.STRING },
                },
            }
        }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as FleshedOutCharacter;
}


export async function generateCharacterImage(character: Character, stylePrompt: string, engine: 'gemini' | 'midjourney' | 'openai'): Promise<string> {
    
    let fullPrompt = '';

    if (engine === 'midjourney') {
        const details = [
            `a cinematic portrait of ${character.name}`,
            ...character.archetype,
            character.description,
            character.personalityTraits,
            ...character.strengths.split('\n'),
            ...character.flaws.split('\n')
        ].filter(d => d).join(', ');
        fullPrompt = `${details} --style ${stylePrompt || 'cinematic, detailed, realistic'} --ar 3:4`;
    } else if (engine === 'openai') {
        fullPrompt = `A digital painting of a fantasy character named ${character.name}, who is a ${character.archetype.join(', ')}. 
        Description: ${character.description}. 
        Their personality is ${character.personalityTraits}. 
        Notable features include their strengths: ${character.strengths}; and their flaws: ${character.flaws}. 
        The overall art style should be: ${stylePrompt || 'epic fantasy, detailed, cinematic'}.`;
    } else {
        fullPrompt = `Create a cinematic, realistic portrait of a character. 
        Style: ${stylePrompt || 'cinematic, detailed, realistic'}.
        Name: ${character.name}.
        Archetypes: ${character.archetype.join(', ')}.
        Description: ${character.description}.
        Key features: ${character.strengths}, ${character.flaws}.
        `;
    }
    
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '3:4',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("Image generation failed to return an image.");
    }
}

export async function fleshOutItem(concept: string, project: Project, toolId: string): Promise<FleshedOutItem> {
    const userPrompt = `Flesh out a magical or significant item for a fantasy story based on this concept: "${concept}". 
        Provide a detailed physical description, 
        a compelling history or origin story, 
        and a list of its key abilities or properties (newline-separated).`;
    
    const contents = buildContentWithContext(userPrompt, project, toolId);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING, description: "A detailed physical and aesthetic description of the item." },
                    history: { type: Type.STRING, description: "A summary of the item's origin, creator, and significant past events." },
                    abilities: { type: Type.STRING, description: "A newline-separated list of the item's key magical properties, skills, or special functions." }
                },
                required: ["description", "history", "abilities"]
            }
        }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as FleshedOutItem;
}

export async function generateItemImage(description: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `Create a cinematic, realistic still-life image of a fantasy item. Description: ${description}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("Image generation failed to return an image.");
    }
}

export async function generateLocationImage(location: Location, stylePrompt: string, engine: 'gemini' | 'midjourney' | 'openai'): Promise<string> {
    let fullPrompt = '';

    if (engine === 'midjourney') {
        const details = [
            `a cinematic landscape of ${location.name}`,
            location.type,
            location.description,
            `Key landmarks include: ${location.keyLandmarks.replace(/\n/g, ', ')}`,
            `The dominant peoples are ${location.dominantPeoples}`,
        ].filter(d => d).join(', ');
        fullPrompt = `${details} --style ${stylePrompt || 'epic fantasy, cinematic, detailed'} --ar 16:9`;
    } else if (engine === 'openai') {
        fullPrompt = `A digital painting of a fantasy location called ${location.name}, which is a ${location.type}.
        Description: ${location.description}. 
        It is known for the following landmarks: ${location.keyLandmarks}.
        The dominant peoples here are ${location.dominantPeoples}.
        The overall art style should be: ${stylePrompt || 'epic fantasy landscape, detailed, cinematic'}.`;
    } else {
        fullPrompt = `Create a cinematic, realistic landscape or architectural image of a fantasy location. 
        Style: ${stylePrompt || 'epic fantasy, cinematic, detailed'}.
        Name: ${location.name}.
        Type: ${location.type}.
        Description: ${location.description}.
        Key Landmarks: ${location.keyLandmarks}.
        `;
    }
    
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("Image generation failed to return an image.");
    }
}


export async function fleshOutLocation(concept: string, project: Project, toolId: string): Promise<FleshedOutLocation> {
    const userPrompt = `Flesh out a fantasy location based on this concept: "${concept}". 
        Provide a detailed physical description, a compelling history, a list of key landmarks (newline-separated), a summary of the impact of a recent cataclysm on it, its dominant peoples, and its system of governance.`;

    const contents = buildContentWithContext(userPrompt, project, toolId);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    history: { type: Type.STRING },
                    keyLandmarks: { type: Type.STRING },
                    postCataclysmImpact: { type: Type.STRING },
                    dominantPeoples: { type: Type.STRING },
                    governance: { type: Type.STRING },
                },
                required: ["description", "history", "keyLandmarks", "postCataclysmImpact", "dominantPeoples", "governance"]
            }
        }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as FleshedOutLocation;
}

export async function fleshOutFaction(concept: string, project: Project, toolId: string): Promise<FleshedOutFaction> {
    const userPrompt = `Flesh out a faction for a story based on this concept: "${concept}". 
        Provide a detailed description, its core ideology, information on its leadership, its common methods, its strongholds, its impact on the world, and its primary goals.`;
        
    const contents = buildContentWithContext(userPrompt, project, toolId);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    ideology: { type: Type.STRING },
                    leadership: { type: Type.STRING },
                    methods: { type: Type.STRING },
                    strongholds: { type: Type.STRING },
                    impactOnWorld: { type: Type.STRING },
                    goals: { type: Type.STRING },
                },
                required: ["description", "ideology", "leadership", "methods", "strongholds", "impactOnWorld", "goals"]
            }
        }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as FleshedOutFaction;
}

export async function getAICoachFeedback(project: Project, nodeTitle: string, userContent: string): Promise<AICoachFeedback> {
    const toolId = 'outline-coach';
    
    const userPrompt = `
        A user is writing a section of their story outline.
        This section corresponds to the '${nodeTitle}' story beat.
        The user has written the following content for this beat:
        ---
        ${userContent || "(This section is currently empty)"}
        ---

        Analyze their content based on the provided writing craft guidelines and the universal principles of this specific story beat.
        Your feedback must not use copyrighted names or phrases from specific books (e.g., instead of "Save the Cat!", say "a key story beat"). Your feedback should be original and based on principles, not direct quotes.
        
        Provide your feedback in the following structured JSON format:
        1.  **corePrincipleAnalysis**: A brief analysis of how the user's content aligns with the core principles of this story beat.
        2.  **actionableSuggestions**: A list of 2-3 concrete suggestions for strengthening the section.
        3.  **guidingQuestions**: A list of 2-3 thought-provoking questions to help the user explore the scene's purpose more deeply.
    `;

    // For the outline coach, we want to provide a default set of principles if none are selected.
    const craftContent = getEnabledCraftContent(project, toolId);
    if (craftContent.length === 0) {
        const saveTheCat = BUILT_IN_CRAFT_KNOWLEDGE.find(b => b.id === 'save-the-cat');
        if (saveTheCat) {
            craftContent.push(`[CRAFT MODULE: ${saveTheCat.title}]\n${saveTheCat.content}`);
        }
    }
    
    const contents = buildContentWithContext(userPrompt, { ...project, proseDocuments: [] }, toolId); // Use enabled craft, but ignore prose for this tool

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    corePrincipleAnalysis: {
                        type: Type.STRING,
                        description: "Analysis of how the user's content aligns with the beat's principles."
                    },
                    actionableSuggestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Concrete suggestions for improvement."
                    },
                    guidingQuestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Thought-provoking questions for the user."
                    }
                },
                required: ["corePrincipleAnalysis", "actionableSuggestions", "guidingQuestions"]
            }
        }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as AICoachFeedback;
}

export async function importAndPopulateWorldBible(documentText: string): Promise<ImportedData> {
    const userPrompt = `I am providing the text from a user's World Bible or story outline document. Analyze the entire document and extract the story's structure, characters, locations, and factions. 
    The outline should be hierarchical. Characters should include their name, any aliases, key archetypes, their role, and a description.
    Please structure your entire response as a single JSON object matching the provided schema.

    Document Text:
    ---
    ${documentText}
    ---
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    outline: {
                        type: Type.ARRAY,
                        description: "The hierarchical story outline. Each node can have nested children.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                content: { type: Type.STRING, description: "A summary of the scene or act." },
                                children: {
                                    type: Type.ARRAY,
                                    items: {
                                        $ref: "#" // Recursive definition for nested children
                                    }
                                }
                            },
                            required: ["title", "content", "children"]
                        }
                    },
                    worldBible: {
                        type: Type.OBJECT,
                        properties: {
                            characters: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        aliases: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        archetype: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        role: { type: Type.STRING },
                                        description: { type: Type.STRING }
                                    },
                                    required: ["name", "description", "archetype", "role", "aliases"]
                                }
                            },
                            locations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        type: { type: Type.STRING },
                                        description: { type: Type.STRING }
                                    },
                                    required: ["name", "type", "description"]
                                }
                            },
                            factions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        type: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        ideology: { type: Type.STRING }
                                    },
                                    required: ["name", "type", "description", "ideology"]
                                }
                            }
                        },
                        required: ["characters", "locations", "factions"]
                    }
                },
                required: ["outline", "worldBible"]
            }
        }
    });

    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString) as Omit<ImportedData, 'outline'> & { outline: any[] };

    // The Gemini schema doesn't support recursive types perfectly for ID generation yet.
    // We need to manually add unique IDs to the outline structure.
    const addIdsToOutline = (nodes: any[], parentId = 0): OutlineNode[] => {
        return nodes.map((node, index) => {
            const newNode: OutlineNode = {
                ...node,
                id: Number(`${parentId}${index}${Date.now()}`.slice(-10)), // create a semi-unique ID
                children: addIdsToOutline(node.children || [], Number(`${parentId}${index}`))
            };
            return newNode;
        });
    };

    const outlineWithIds = addIdsToOutline(parsedData.outline);

    return {
        ...parsedData,
        outline: outlineWithIds
    };
}

export async function importAndPopulateManuscript(documentText: string): Promise<ImportedManuscriptData> {
    const userPrompt = `I am providing the text from a user's manuscript. Your task is to analyze the entire document and perform two actions:
    1.  Extract the full, raw text of the manuscript.
    2.  Identify the chapter breaks and generate a hierarchical story outline. Each top-level node in the outline should be a chapter. The 'title' should be the chapter title (e.g., 'Chapter 1: The Beginning'), and the 'content' should be a concise one-paragraph summary of that chapter's key events and purpose.

    Return the result as a single JSON object matching the provided schema.

    Manuscript Text:
    ---
    ${documentText}
    ---
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    manuscriptText: {
                        type: Type.STRING,
                        description: "The full, raw text of the entire manuscript."
                    },
                    outline: {
                        type: Type.ARRAY,
                        description: "A hierarchical outline based on the manuscript's chapters. Each chapter should be a top-level node.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "The title of the chapter." },
                                content: { type: Type.STRING, description: "A concise summary of the chapter's content." },
                                children: { type: Type.ARRAY, items: { type: Type.OBJECT } } // Keep for schema consistency, but likely empty.
                            },
                            required: ["title", "content", "children"]
                        }
                    }
                },
                required: ["manuscriptText", "outline"]
            }
        }
    });

    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString) as Omit<ImportedManuscriptData, 'outline'> & { outline: any[] };

    const addIdsToOutline = (nodes: any[], parentId = 0): OutlineNode[] => {
        return nodes.map((node, index) => {
            const newNode: OutlineNode = {
                ...node,
                id: Number(`${parentId}${index}${Date.now()}`.slice(-10)),
                children: addIdsToOutline(node.children || [], Number(`${parentId}${index}`))
            };
            return newNode;
        });
    };

    const outlineWithIds = addIdsToOutline(parsedData.outline);

    return {
        ...parsedData,
        outline: outlineWithIds
    };
}
