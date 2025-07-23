

import {
    LayoutList, BookOpen, Users, MapPin, Clapperboard, Music, Video, Library, Sparkles, Scroll, Shield, Bug, Languages, Globe, FileText, Sword, Eye, Binary, CalendarDays, Building, History, Castle, DraftingCompass
} from 'lucide-react';
import type { SidebarItem, Project, WorldBible, OutlineNode, AICraftConfig } from './types';
import { deepCopy } from './utils';

export const iconMap: { [key: string]: React.ElementType } = {
    LayoutList, BookOpen, Users, MapPin, Clapperboard, Music, Video, Library, Sparkles, Scroll, Shield, Bug, Languages, Globe, FileText, Sword, Eye, Binary, CalendarDays, History, Building, Castle, DraftingCompass
};

export const defaultSidebarConfig: SidebarItem[] = [
    { 
        id: 'world-bible', 
        toolId: 'world-bible',
        label: 'World Bible', 
        icon: 'Library', 
        children: [
            { id: 'characters', toolId: 'characters', label: 'Characters', icon: 'Users', isVisible: true },
            { id: 'locations', toolId: 'locations', label: 'Locations', icon: 'MapPin', isVisible: true },
            { id: 'factions', toolId: 'factions', label: 'Factions', icon: 'Shield', isVisible: true },
            { id: 'organizations', toolId: 'organizations', label: 'Organizations', icon: 'Building', isVisible: true },
            { id: 'items', toolId: 'items', label: 'Items', icon: 'Sword', isVisible: true },
            { id: 'magic', toolId: 'magic', label: 'Magic & Lore', icon: 'Sparkles', isVisible: true },
            { id: 'timeline', toolId: 'timeline', label: 'Timeline', icon: 'History', isVisible: true },
            { id: 'bestiary', toolId: 'bestiary', label: 'Bestiary', icon: 'Bug', isVisible: true },
            { id: 'languages', toolId: 'languages', label: 'Languages', icon: 'Languages', isVisible: true },
            { id: 'cultures', toolId: 'cultures', label: 'Cultures', icon: 'Globe', isVisible: true },
            { id: 'prophecies', toolId: 'prophecies', label: 'Prophecies', icon: 'Eye', isVisible: true },
            { id: 'themes', toolId: 'themes', label: 'Themes', icon: 'Binary', isVisible: true },
        ]
    },
    { id: 'outline', toolId: 'outline', label: 'Outline', icon: 'LayoutList' },
    { id: 'manuscript', toolId: 'manuscript', label: 'Manuscript', icon: 'BookOpen' },
    { id: 'storyboard', toolId: 'storyboard', label: 'Storyboard', icon: 'Clapperboard' },
    { id: 'previs', toolId: 'previs', label: 'Pre-Vis', icon: 'Video' },
    { id: 'scoring', toolId: 'scoring', label: 'Scoring', icon: 'Music' },
];

export const genres = [
  "Action", "Action-Adventure", "Action-Comedy", "Action-Horror", "Adventure", "Afrofuturism", "Alien Invasion", "Alternate History", "Animation", "Anthology", "Anthropomorphic Fantasy", "Bizarro Fiction", "Black Comedy / Dark Comedy", "Body Horror", "Chase Film/Fiction", "Children's Fiction", "Classic Western", "Cli-Fi (Climate Fiction)", "Comedy", "Comedy of Manners", "Comedy-Drama (Dramedy)", "Comic Book", "Coming-of-Age Story (Bildungsroman)", "Conspiracy Thriller", "Contemporary Romance", "Cosmic Horror / Lovecraftian Horror", "Cozy Fantasy", "Cozy Mystery", "Creature Feature", "Crime", "Crime Drama", "Cyberpunk", "Dark Fantasy", "Dark/Grimdark Fantasy", "Dating Show", "Detective Fiction", "Disaster Film/Fiction", "Docudrama", "Docusoap/Lifestyle", "Documentary", "Drama", "Dramedy", "Dystopian", "Early Reader", "Electronic Literature (E-lit)", "Epistolary Novel", "Erotic Romance/Erotica", "Erotic Thriller", "Espionage", "Experimental/Avant-Garde", "Exploration Adventure", "Fable", "Fairy Tale", "Fairy Tale/Retellings", "Family Saga", "Fan Fiction", "Fantasy", "Fantasy Romance (Romantasy)", "Fantasy-Comedy", "First Contact", "Fish Out of Water", "Folk Horror", "Folklore", "Found Footage", "Gangster", "Gaslamp Fantasy", "Gothic Horror", "Graphic Novel / Comic Book", "Grimdark", "Hardboiled", "Hardboiled Detective Fiction", "Heist/Caper", "High Fantasy / Epic Fantasy", "Historical Drama / Period Piece", "Historical Fantasy", "Historical Fiction", "Historical Mystery", "Hopepunk", "Horror", "Horror-Comedy", "Humor/Comedy", "Hypertext Fiction", "Inspirational/Religious", "Inspirational/Religious Romance", "Interactive Fiction (IF)", "Inverted Detective Story", "Isekai", "Josei", "Kaiju", "Kodomomuke", "Legal Drama", "Legal Thriller", "Legal/Courtroom Drama", "Legend", "LitRPG (Literary Role-Playing Game)", "Literary Fiction", "LGBTQ+ Romance", "Locked-Room Mystery", "Lost World Fiction", "Low Fantasy", "Magical Girl", "Magical Realism", "Mainstream Fiction", "Martial Arts / Wuxia", "Medical Drama", "Medical Thriller", "Melodrama", "Meta-Genres", "Middle Grade (MG)", "Military Action", "Military Sci-Fi", "Mockumentary", "Monster", "Musical", "Mystery", "Myth", "Mythic Fantasy", "Mythic Fiction / Mythopoeia", "Nautical/Pirate Fiction", "Neo-Noir", "Neo-Slave Narrative", "New Adult (NA)", "New Weird", "Noir", "Paranormal/Supernatural Horror", "Paranormal Romance", "Parody/Spoof", "Period/Historical Drama", "Picture Book", "Plantation Tradition", "Police Procedural", "Political Drama", "Political/Conspiracy Thriller", "Portal Fantasy / Isekai", "Post-Apocalyptic", "Prestige Drama", "Procedural", "Psychological Horror", "Psychological Thriller", "Quest Narrative", "Reality Television", "Regency Romance", "Revenge / Vigilante", "Revisionist Western", "Romance", "Romantic Comedy (Rom-Com)", "Romantic Suspense", "Romantasy", "Satire", "Science Fantasy", "Science Fiction", "Science Fiction (Sci-Fi)", "Sci-Fi Comedy", "Sci-Fi Horror", "Sci-Fi Western", "Scoring", "Screwball Comedy", "Seinen", "Serial", "Shōjo", "Shōnen", "Sitcom (Situational Comedy)", "Slapstick", "Slasher", "Slice of Life", "Slipstream", "Soap Opera/Telenovela", "Soft/Social Sci-Fi", "Solarpunk", "Space Opera", "Space Western", "Spaghetti Western", "Speculative Fiction", "Splatterpunk / Extreme Horror", "Spy Fiction/Espionage", "Spy/Espionage", "Steampunk", "Stoner Comedy", "Superhero", "Superhero Fiction", "Supernatural Horror", "Supernatural/Paranormal Horror", "Surrealism", "Survival Fiction", "Swashbuckler", "Sword and Sorcery", "Tall Tale", "Tech-Noir", "Techno-Thriller", "Thriller / Suspense", "Time Travel", "Time Travel Fiction", "Tragedy", "Treasure Hunt", "True Crime", "Urban Fantasy", "Utopian", "War Film", "Web Fiction / Web Serials", "Webcomic / Web Series", "Weird West", "Western", "Whodunit", "Women's Fiction", "YA Romance", "Young Adult (YA)", "Zombie Apocalypse"
];

export const emptyWorldBible: WorldBible = {
    characters: [], locations: [], factions: [], items: [], magicSystems: [], creatures: [], cultures: [], languages: [], lore: [], timeline: [], prophecies: [], themes: [], organizations: []
};

export const AI_CONFIGURABLE_TOOLS = [
    { id: 'brainstorm-generator', label: 'Idea Brainstorming' },
    { id: 'character-generator', label: 'Character Generation' },
    { id: 'character-flesher', label: 'Character Flesh-Out' },
    { id: 'item-flesher', label: 'Item Flesh-Out' },
    { id: 'location-flesher', label: 'Location Flesh-Out' },
    { id: 'faction-flesher', label: 'Faction Flesh-Out' },
    { id: 'outline-coach', label: 'Outline Writing Coach' },
];

export const BUILT_IN_CRAFT_KNOWLEDGE = [
    {
        id: 'save-the-cat',
        title: "The Save the Cat! Method",
        description: "Focuses on plot structure and story beats to create a commercially successful and emotionally resonant narrative. Ideal for outlining and ensuring your story hits all the right moments.",
        content: `
### The Holy Trinity of Story
Plot, structure, and character transformation are the three essential building blocks of every great story. A story is about an imperfect hero who undergoes a transformation.

### The Story-Worthy Hero
A hero is defined by three things:
1.  **A PROBLEM (or Flaw)**: The hero must be flawed. They have a psychological wound (a 'shard of glass') that manifests in external problems. Readers don't like perfect heroes.
2.  **A WANT**: A tangible, external goal that the hero is actively pursuing. This is what the hero *thinks* will fix their life. It drives the A Story (the plot).
3.  **A NEED**: An internal life lesson the hero must learn to overcome their flaw and achieve true transformation. This is what the hero *actually* needs. It drives the B Story (the theme). A hero's journey is about realizing their 'want' is not their 'need'.

### The Save the Cat! 15-Beat Sheet

**ACT 1: The Thesis World (The "Before" - Approx. 20%)**
*   **1. Opening Image (1%)**: A "before" snapshot of the hero and their flawed world. A single-scene beat that sets the tone and style.
*   **2. Theme Stated (5%)**: A character (usually not the hero) poses a question or makes a statement that hints at the hero's "need" or life lesson. The hero will ignore it. This is the story's core argument.
*   **3. Setup (1-10%)**: A multi-scene exploration of the hero's status quo life, showcasing their flaws, wants, and the "things that need fixing." We meet the A Story characters. It establishes the stakes and the "stasis = death" moment—a sense that change is vital.
*   **4. Catalyst (10%)**: The inciting incident. A life-changing event that happens *to* the hero, disrupting their world and creating a clear problem. It must be big enough to break the status quo.
*   **5. Debate (10-20%)**: The hero's reaction to the Catalyst. A multi-scene sequence where they show resistance to change, ask questions (Should I go? What now?), and prepare for the journey ahead.

**ACT 2: The Antithesis World (The Upside-Down World - Approx. 60%)**
*   **6. Break into 2 (20%)**: The hero makes a proactive decision to leave their old world behind and enter a new one. This is a single-scene beat. They are often fixing things the "wrong way" (chasing their want, not their need).
*   **7. B Story (22%)**: Introduction of a new character (or characters) who will help the hero learn the theme. This could be a love interest, mentor, nemesis, etc. They represent the new, upside-down world of Act 2.
*   **8. Fun and Games (20-50%)**: The "promise of the premise." A multi-scene beat where the hero explores the new world. This is a "bouncing ball" narrative of successes and failures, on either an upward or downward path.
*   **9. Midpoint (50%)**: A single-scene beat that is either a **false victory** or a **false defeat**. The stakes are raised, time clocks may appear, and the A and B stories intersect. The hero's focus shifts from want to need.
*   **10. Bad Guys Close In (50-75%)**: A multi-scene beat. The path reverses from the Midpoint. If it was a false victory, things now get worse. If a false defeat, things get better. The hero's internal flaws ("internal bad guys") are the real enemy closing in.
*   **11. All Is Lost (75%)**: The lowest point of the novel. A single-scene beat with a "whiff of death" (literal or metaphorical). The hero loses everything they gained in Act 2. It's often their fault, a result of their core flaw.
*   **12. Dark Night of the Soul (75-80%)**: A multi-scene reaction beat. The hero wallows in despair. It's the moment before the epiphany. They often "return to the familiar" only to realize they've changed. Here, they synthesize the lesson they've been learning.

**ACT 3: The Synthesis World (The "After" - Approx. 20%)**
*   **13. Break into 3 (80%)**: The "aha!" moment. A single-scene beat where the hero realizes the solution—they know what they must do to fix both the external problem and their internal flaw. They have learned the theme.
*   **14. Finale (80-99%)**: A multi-scene beat where the hero enacts the new plan, applying the lesson learned. It's often structured as a **Five-Point Finale**:
    1.  *Gathering the Team*: The hero makes amends and prepares.
    2.  *Executing the Plan*: The hero storms the castle.
    3.  *High Tower Surprise*: The plan goes wrong; another twist.
    4.  *Dig Deep Down*: The hero must use their newfound lesson/need to find a new solution.
    5.  *Execution of the New Plan*: The hero triumphs by truly changing.
*   **15. Final Image (99-100%)**: A single-scene beat. A mirror to the Opening Image, showing the hero in their new, transformed world.

### The 10 Story Genres
These are not traditional genres (like sci-fi or romance) but categories based on the hero's journey and transformation.
1.  **Whydunit**: A detective (pro or amateur) uncovers a dark secret about human nature. (e.g., *The Girl on the Train*)
2.  **Rites of Passage**: A hero endures the pain of a universal life problem (death, puberty, divorce) and grows up. (e.g., *The Kite Runner*)
3.  **Institutionalized**: A hero enters a group or institution and must decide whether to join, escape, or destroy it. (e.g., *The Help*)
4.  **Superhero**: An extraordinary person in an ordinary world must come to terms with being special and having a great destiny. (e.g., *Harry Potter*)
5.  **Dude with a Problem**: An ordinary person finds themselves in extraordinary circumstances and must rise to the challenge. (e.g., *Misery*)
6.  **Fool Triumphant**: An underestimated underdog is pitted against an establishment and proves their hidden worth. (e.g., *Bridget Jones's Diary*)
7.  **Buddy Love**: A hero is transformed by meeting someone else (a friend, lover, or even a pet). (e.g., *Me Before You*)
8.  **Out of the Bottle**: An ordinary hero is temporarily "touched by magic" (a wish, a curse) and learns an important lesson about reality. (e.g., *Twenties Girl*)
9.  **Golden Fleece**: A hero (or group) goes on a "road trip" in search of a prize, but discovers their true self instead. (e.g., *Ready Player One*)
10. **Monster in the House**: A hero is trapped in an enclosed space with a monster, and a sin they've committed is the reason the monster is there. (e.g., *Frankenstein*)
`
    },
    {
        id: 'compelling-characters',
        title: "Compelling Characters: The Swain Method",
        description: "Based on the principles of Dwight V. Swain, this focuses on creating dynamic, memorable characters through clear motivation, distinct impressions, and emotional depth.",
        content: `
### The Core of Character: Caring
The one key element any major character must have is the ability to care about something. This gives them purpose and drives their actions. It doesn't matter if the object of their care is noble or trivial; what matters is that they care.

### The Process of Character Building
1.  **Find the Character Who Turns You On**: You must have an authentic connection to your characters. They should be born from your own fantasies, feelings, and observations.
2.  **Rationalize Their Presence**: Give them plausible reasons for their actions and behaviors. Understand *why* they do what they do, even if it's based on flawed logic.
3.  **Conceive People in Context**: Character is inextricably linked to situation. A character's role, goals, and conflicts arise from the world they inhabit.

### Key Tools for Characterization
*   **Dominant Impression**: A memorable first impression based on two key elements:
    1.  **Vocation (Noun)**: Their role in society (e.g., cop, housewife, drifter).
    2.  **Manner (Adjective)**: Their personal bearing and style (e.g., surly, friendly, worried). This is the most crucial element as it reveals their inner state.
*   **Tags**: Limited, specialized labels to help readers distinguish characters. These can be:
    *   **Appearance**: A unique physical feature (a scar, a specific item of clothing, a physical tic).
    *   **Speech**: A distinctive pattern, accent, or catchphrase.
    *   **Mannerism**: A repeated physical action (coin-flipping, rubbing chin).
*   **Traits**: A character's habitual modes of response to situations (e.g., cautious, reckless, brave, cowardly). Show these through action; don't just tell.
*   **Relationships**: Define characters by how they interact with others, especially in terms of attraction (like attracts like, or opposites attract) and conflict.

### The World Within: Motivation
A character's actions are driven by their internal world.
*   **Happiness as the Universal Goal**: Characters are motivated by a desire to move from a state of unhappiness to happiness.
*   **Goal vs. Direction**:
    *   **Direction**: A character's general tendency to lead the kind of life they enjoy, an unstated "dream of happiness."
    *   **Goal**: A specific, tangible objective born out of dissatisfaction with their current situation. A story requires a clear goal.
*   **Drive**: The inner pressure and intensity with which a character pursues their goal. Ask: "Does the character really give a hoot?" If not, they are useless in a story.
*   **Attitude**: A character's "hangup" or consistent feeling about a subject. It's their habitual, often irrational, way of reacting. A character's dominant attitude is their collective pattern of reactions.
*   **Motive vs. Purpose**:
    *   **Purpose**: Is *what* a character wants to do (external, action-oriented).
    *   **Motive**: Is *why* a character wants to do it (internal, often a rationalization).

### The Breath of Life: Emotion
Emotion is what brings a character to life.
*   **Emotion Creates Direction**: Feeling good or bad about something is what gives a character direction. They seek pleasure and avoid pain.
*   **Stress Reveals Character**: A character's most revealing moments are when they experience stress and are forced to react emotionally.
*   **Use Significant Details**: Don't just tell the reader a character is angry. Show it through specific, sensory details that evoke the desired feeling. Describe what the *character* notices.

### Background: Bent Twigs
A character's past shapes their present.
*   **Tie Attitudes to Formative Events**: To make a character's core attitudes and irrational behaviors believable, connect them to a single, memorable past event (a "sensory snapshot").
*   **Background Elements**: Consider a character's background through four lenses:
    1.  **Body**: Heredity, physical attributes, health, age, sex.
    2.  **Environment**: Their social and physical world (milieu).
    3.  **Experience**: Key life events, especially shock impacts.
    4.  **Ideas**: The beliefs and philosophies that shape their worldview.
`
    },
    {
        id: 'first-you-write-a-sentence',
        title: "First You Write a Sentence: The Moran Method",
        description: "Focuses on the art of the sentence itself—its rhythm, structure, and ability to convey meaning with clarity and style. Ideal for refining prose at a granular level.",
        content: `
### Core Philosophy: The Sentence is the Foundational Unit
Writing is a craft focused on the sentence. If the sentence is right, the story will be right. This involves seeing the sentence not just as a vessel for meaning, but as an object with rhythm, sound, and texture. A sentence is a gift to the reader.

### The Toolbox for a Good Sentence
*   **Listen, Read, Write**: Train your ear for how a sentence sounds in your head. Read voraciously to internalize good sentence patterns. Write consistently to practice the craft.
*   **Mimic Speech, But Don't Copy It**: Sentences should have the naturalness and rhythm of speech, but be wrought with the precision of writing. They should ring in the head.
*   **Short Words are Best**: Use short, Anglo-Saxon words for clarity, impact, and "chewy vowels." An occasional long, Latinate word can draw just the right amount of attention to itself.
*   **Verbal Economy is a Virtue, but an Overprized One**: Words are precious, but they need to be spent. Use as many words as you need, but no more. Every word must earn its keep.
*   **Love the Full Stop**: The full stop is the goal. It offers clarity, rhythm, and relief. A good sentence, like a good life, needs a good death.

### Key Principles of Sentence Construction
*   **The Bones: Noun and Verb**: Put the right nouns and verbs in the right slots, and the other words will fall into place.
    *   **Nouns vs. Verbs**: Nouns keep a sentence still; verbs make it move. Good writing is alive with verbs.
    *   **Avoid Nominalizations**: Do not turn verbs into static nouns (e.g., 'the implementation of the plan' vs. 'they implemented the plan'). It deadens the prose.
    *   **Use Strong Verbs**: Replace weak verbs (especially forms of 'to be') with strong, active, transitive verbs that show an agent acting on an object.
*   **Rhythm and Structure**:
    *   **Vary Sentence Length**: Alternate short, percussive sentences with long, flowing ones to create life and music.
    *   **The Cumulative Sentence**: The most natural form for English. Start with a main clause (subject-verb-object) and then add modifying phrases that add detail and texture. Example: 'He sat by the window, watching the rain fall, thinking of the past.' This structure moves forward naturally.
    *   **The Periodic Sentence**: Withhold the main clause until the end. This builds suspense but can feel unnatural if overused. Save the most important information for the end of the sentence, where the stress falls.
*   **Cohesion and Flow**:
    *   **Join Sentences with Invisible Thread**: Link sentences through suggestive arrangement, not coercive connection. Avoid overusing clunky signposting adverbs like \`Therefore,\` \`However,\` or \`Thus.\` Trust the reader to make the leap.
    *   **Repetition is Musical**: Intentional repetition of words and syntactical forms (parallelism) is musical and meaningful. Accidental repetition is clunky and careless.
    *   **Paragraphs are Emotional**: A paragraph is a unit of sound as much as sense, made by sentences rubbing up against each other. Shorten paragraphs and use white space to make your writing welcoming.
`
    },
    {
        id: 'hooked-on-beginnings',
        title: "Hooked: The Edgerton Method for Gripping Beginnings",
        description: "Focuses on the critical opening of a story. Teaches how to grab readers from the first page by starting with trouble, defining the story's core problems, and avoiding common pitfalls.",
        content: `
### Core Philosophy: The Story Begins with Trouble
The single biggest reason manuscripts are rejected is because they begin in the wrong place. The story does not exist until the trouble begins. Everything before that moment is backstory. The goal is to evoke an emotional response that hooks the reader.

### The Modern Story Structure: Start with the Inciting Incident
*   **Cut the Preamble**: The old model of establishing a character's stable life before introducing trouble is archaic. Today's readers expect to be plunged directly into the action.
*   **The Opening is a Scene**: The inciting incident must be a dramatic scene, not a summary or internal monologue. The reader must live through it with the protagonist. Show, don't tell.
*   **Drama over Melodrama**: True drama is about intense wanting and internal conflict. It is not about shrieking or over-the-top external action. A quiet, devastating choice is more dramatic than a car chase. Lower the volume, don't turn it up.

### The Two Core Problems
Every story is driven by two connected problems, both of which must be introduced or hinted at in the opening scene.
1.  **The Initial Surface Problem**: This is the external, plot-based problem created by the inciting incident. It's the immediate, tangible goal the character must now pursue (e.g., escape a killer, find a lost artifact, clear their name). It's what the character *thinks* the story is about.
2.  **The Story-Worthy Problem**: This is the deeper, internal, psychological problem inside the protagonist (e.g., a lifelong coward must find courage; a selfish person must learn to sacrifice). The surface problem is the vehicle that forces the character to confront this deeper flaw. The character is often unaware of this problem at the start, but the author must know it.

### The Four Goals of a Good Opening
1.  **Introduce the Story-Worthy Problem**: This is the most important goal. It's the heart and soul of the story.
2.  **Hook the Reader**: Create a mystery or a question that demands an answer. Plunging the character into immediate trouble is the most effective hook.
3.  **Establish the Story's Rules**: The tone, genre, and voice must be consistent from the very beginning. Don't trick the reader (e.g., with a dream opening).
4.  **Forecast the Ending**: The seeds of the resolution should be subtly planted in the beginning. The answer to the story's end lies in its opening.

### Key Components of an Opening Scene
*   **Primary Components**: The inciting incident, the story-worthy problem, the initial surface problem, and the setup.
*   **Secondary Components**: Backstory, a stellar opening sentence, language, character, setting, and foreshadowing.
*   **Backstory**: Use it sparingly. Weave it into the present action of the scene ("active backstory") rather than delivering it in a passive chunk ("windowpane description"). Trust the reader's intelligence to infer details.

### Red Flag Openings to AVOID
*   **Red Flag 1: The Dream**: Never begin with an action sequence that is then revealed to be a dream. It's a cliché that breaks reader trust.
*   **Red Flag 2: The Alarm Clock**: Do not open with the protagonist waking up. It signals a slow, mundane start.
*   **Red Flag 3: Being Unintentionally Funny**: Avoid clichés and awkward phrasing that pull the reader out of the story.
*   **Red Flag 4: Too Little Dialogue**: Long, dense blocks of prose are visually intimidating and suggest a story that tells rather than shows. White space is your friend.
*   **Red Flag 5: Opening With Dialogue (Carelessly)**: Starting with dialogue is dangerous because the reader lacks context. If you do it, the who, what, and where must become clear almost instantly.
`
    },
    {
        id: 'on-writing-king',
        title: "On Writing: The Stephen King Method",
        description: "A practical approach to the craft, focusing on discipline, honesty, and the writer's toolbox. Read a lot, write a lot, and tell the truth.",
        content: `
### Core Philosophy: Read a lot and write a lot.
This is the Great Commandment. There are no shortcuts.
*   **Reading**: Read constantly, both good and bad prose. Reading teaches what works and what doesn't. It creates an intimacy with the craft and fills your creative well. It is the creative center of a writer's life.
*   **Writing**: Write consistently, ideally every day. A dedicated space and a closed door are essential. The goal is to produce a first draft in a single season (about three months). A daily word count (e.g., 1,000-2,000 words) builds discipline and momentum, which helps you outrun self-doubt.

### The Writer's Toolbox
Every writer must have a toolbox. The tools should be simple and practical.
*   **Top Layer: Vocabulary & Grammar**
    *   **Vocabulary**: Your main job is to say what you mean. Use the first word that comes to your mind if it is appropriate and colorful. Don't dress up your vocabulary to seem smarter; it's like putting a tuxedo on a household pet. Plain and direct language is best.
    *   **Grammar**: Grammar is not just rules; it's the pole you grab to get your thoughts up on their feet and walking. A sentence is the basic unit: a subject (noun) and a predicate (verb). Master this simple structure.
*   **Second Layer: Elements of Style**
    *   **Avoid the Passive Voice**: The passive voice is for timid writers. It is weak, circuitous, and often tortuous. Instead of 'The body was carried from the kitchen,' write 'Freddy and Myra carried the body from the kitchen.' It's direct, active, and clear about who is doing what.
    *   **The Adverb is Not Your Friend**: The road to hell is paved with adverbs (especially -ly adverbs). They are often a sign that your verb isn't strong enough. Instead of 'He closed the door firmly,' write 'He slammed the door.' They are especially bad in dialogue attribution.
    *   **Dialogue Attribution**: The best attribution is \`said\`. Period. 'He said,' 'she said.' It is invisible to the reader. Let the dialogue itself carry the emotion and the character's voice.
*   **Third Layer: Paragraphs and Pacing**
    *   The paragraph is the basic unit of coherence, where words and sentences come together to form a rhythm. It's the 'beat' of the story. Paragraphs are best learned by reading and developing an instinct for when a break is needed. Writing is seduction, and good talk is part of seduction.

### On Story, Plot, and Theme
*   **Story is a Fossil**: Story is a found object, like a fossil in the ground. It is not created. The writer's job is to excavate this pre-existing story as carefully as possible, using the tools in their toolbox.
*   **Situation Over Plot**: Plot is the 'good writer's last resort and the dullard's first choice.' It feels artificial and mechanical. Instead, start with a situation: put a group of characters in a predicament and watch them try to work their way out.
*   **The 'What If' Question**: Most stories start with a simple 'What if?' (e.g., 'What if vampires invaded a small New England village?'). The story is the excavation of that question.
*   **Honesty is Key**: The writer's primary job is to tell the truth about how characters behave within that situation. If you're honest, the story will work. Write what you know, but interpret that as broadly as possible. The heart and imagination know things, too.
*   **Symbolism and Theme**: These are not things you add in. They are part of the fossil you are excavating. You often won't see them until the second draft. Your job is to identify them and bring them out more clearly. Good fiction always begins with story and progresses to theme.

### The Writing & Revision Process
1.  **First Draft (Door Closed)**: Write for yourself. The goal is to get the story down on paper as fast as you can, without interference or outside opinions. This is you telling yourself the story.
2.  **The Cooling-Off Period**: After finishing the first draft, put the manuscript away for a **minimum of six weeks**. This is crucial. It gives you the distance needed to read your work objectively.
3.  **Second Draft (Door Open)**: Rewrite for your Ideal Reader (a specific person you trust). This is where you fix the story.
    *   Read the entire manuscript through in one or two sittings. Make notes on big-picture problems: coherence, character motivation, plot holes, resonance.
    *   **The Rewrite Formula**: \`2nd Draft = 1st Draft - 10%\`. Cutting is the most important part of rewriting. Omit needless words. If you can't cut 10% from your manuscript, you're not trying hard enough. This tightening will make the story more energetic and focused. "Murder your darlings."
    *   Focus on making the underlying themes clearer and strengthening the story's resonance. This is where you polish the fossil.
`
    },
    {
        id: 'she-sat-he-stood',
        title: "She Sat, He Stood: The Hanson Method",
        description: "Enhances dialogue by integrating setting, props, and body language to create three-dimensional scenes. Based on the work of Ginger Hanson.",
        content: `
### Core Philosophy: What Characters Do While They Talk
Dialogue is not just words; it's action, subtext, and emotion. Only 7% of communication is verbal. The other 93% is body language (55%) and tone of voice (38%). To write sparkling dialogue, you must show what characters are *doing* and *feeling*, not just what they are saying. This is achieved by treating the scene like a director, prop master, and actor.

### Setting: The Foundation of the Scene
The setting is the time and place of the action. It's not just a backdrop; it's a tool for storytelling.
*   **Anchor the Reader**: Establish the setting immediately to ground the reader. Use two or three vivid details. Your reader has never been there; build a bridge for them from the familiar to the unfamiliar.
*   **Use the Sensory World**: Engage all five senses. What does the place look, sound, smell, feel, and taste like? These details fuel character reactions and enrich dialogue.
*   **Subjective World**: The setting is perceived through a focal character. Their internal state (mood, background, physical condition) colors their perception of the world. A cold room feels different to a person who is happy versus one who is depressed.
*   **Setting as a Mental Image**: Utilize physical surroundings, the environment (heat, smog, a breeze), and the mood (gloomy, cheerful) to influence the scene.

### Props: Objects for Interaction
Props are objects used by an actor in a scene. They are essential for grounding dialogue in physical reality and revealing character.
*   **Give Characters Business**: People rarely just talk. They interact with objects. Let them drink from a teacup, scribble notes, light a lamp, or handle a weapon. This action enriches the scene and makes it more visually interesting.
*   **Props Reveal Character**: The props a character chooses to interact with, and how they do it, reveal their personality and emotional state. A character nervously shredding a napkin says more than "she was nervous."
*   **Props Carry Weight**: Some props (like the letters of transit in *Casablanca*) become central to the plot. They are not just background dressing but active elements in the story.
*   **Mental Storyboarding**: Before writing a scene, visualize the space. List potential props. Sketch the layout. Know what's in the room so your characters can interact with it naturally.

### Body Language: The Unspoken Dialogue
Body language is nonverbal communication. It's how characters reveal their true feelings, often in contradiction to their words.
*   **The Trio of Factors**: Every emotional reaction consists of three parts:
    1.  **An Event**: A trigger (internal or external).
    2.  **Bodily Changes**: Heart rate, muscle tension, blushing, etc.
    3.  **Thoughts**: The character's internal response.
*   **Show, Don't Tell Emotion**: Instead of saying a character is anxious, show the mucus forming in their throat, the tightening of their vocal cords, the slight pitch increase in their voice.
*   **Conflicting Messages**: The most powerful use of body language is when it contradicts the dialogue. "Of course not!" he said, as he crushed the beer can in his right hand. This creates subtext and reveals the character's true feelings.
*   **Giveaway Tells**: Small, often unconscious gestures that reveal a character's state of mind (nervousness, lying, etc.). A rubbed ear, a tap of the fingers, a refusal to make eye contact.
*   **Proxemics (The Use of Space)**: The distance between characters is a powerful indicator of their relationship and intimacy.
    *   **Intimate distance (0-1 ft)**: Whispering, embracing.
    *   **Personal distance (2-4 ft)**: Friends, family.
    *   **Social distance (4-10 ft)**: Business associates.
    *   **Public distance (12+ ft)**: Public speaking.
    A character invading another's space is an immediate source of tension.

### Beats: Weaving Action and Dialogue
Beats are descriptive sentences of action or thought inserted into dialogue. They replace dialogue tags like "he said" and serve several key functions:
1.  **Tie Dialogue to Setting**: They ground the conversation in a physical space. "Sallie gave the mule's bridle one last tug as she yelled, 'Lula Mae, I'm gonna leave you...'"
2.  **Vary Rhythm**: A short beat quickens the pace; a longer beat slows it down. Varying beat length creates a musical tempo.
3.  **Reveal Personality and Emotion**: A gesture or action can reveal more than a page of narration. "The moment Lord Ashton turned, Mona Shepperton screwed up her face and stuck out her tongue."
**Caveats for Using Beats**:
*   Don't overuse them; it leeches tension.
*   Don't separate the beat from the dialogue of the character performing the action.
*   The right balance is key. Don't let beats overwhelm the dialogue or vice versa.
`
    },
    {
        id: 'story-mckee',
        title: "Story: The Robert McKee Method",
        description: "A deep dive into the substance, structure, and style of storytelling. Focuses on the core principles of narrative design, from the 'gap' in reality to the 5-part story structure.",
        content: `
### Core Philosophy: Story as a Metaphor for Life
A story is an instrument by which you create epiphanies at will, a phenomenon known as aesthetic emotion—the simultaneous encounter of thought and feeling. Story is about principles, not rules. It's about eternal, universal forms, not formulas. A great story is a metaphor that says, "Life is like this."

### The Substance of Story: The Gap
Story is born in the gap between a character's subjective expectation and the objective, often brutal, result of their actions.
1.  A character takes an action expecting a certain reaction from their world.
2.  The world reacts unexpectedly, creating a gap between expectation and reality.
3.  This gap forces the character to confront the true nature of their world and themselves.
4.  To bridge this gap, the character must take a new, often riskier, action.
This is the source of all story energy.

### The Five-Part Story Design
Every story is a design in five parts, progressing from the Inciting Incident to the Climax.
1.  **Inciting Incident**: The first major event that radically upsets the balance of forces in the protagonist's life. It launches them on a quest to restore balance. This event must happen *on screen*.
2.  **Progressive Complications**: The story's main body. The protagonist faces escalating forces of antagonism, passing a series of "points of no return" that make life increasingly difficult. Nothing moves forward except through conflict.
3.  **Crisis**: The obligatory scene. The protagonist faces the ultimate dilemma—a choice between irreconcilable goods or the lesser of two evils. This is a choice, not just an action.
4.  **Climax**: The action the protagonist takes based on their crisis decision. This creates an absolute, irreversible change in the story's core value. A great climax is both inevitable and unexpected.
5.  **Resolution**: Any material after the climax, used to show the aftermath, climax subplots, or provide a "slow curtain" for the audience.

### Character vs. Characterization
*   **Characterization**: The sum of all observable qualities (age, IQ, style, values, etc.). It's the mask.
*   **True Character**: Revealed in the choices a human being makes under pressure. The greater the pressure, the deeper the revelation. A character is defined by their choices in a true dilemma.
*   **Character Dimension**: Created by contradictions, either within the character (e.g., a guilty ambition) or between characterization and true character (e.g., a charming thief).

### The Principles of Antagonism
A story is only as compelling as the forces of antagonism that oppose the protagonist.
*   **Forces of Antagonism**: The sum total of all forces opposing the character's desires, coming from three levels:
    1.  **Inner Conflict**: Mind, body, emotions.
    2.  **Personal Conflict**: Relationships with family, friends, lovers.
    3.  **Extra-Personal Conflict**: Society, institutions, and the physical environment.
*   **The Negative Side**: To build a powerful story, you must build the negative side. Progress the conflict through the **Contrary**, the **Contradictory**, and finally the **Negation of the Negation**—a force that is doubly negative, representing the limit of the dark powers of human nature (e.g., Justice -> Unfairness -> Injustice -> Tyranny).

### The Story Triangle: Forms of Design
1.  **Archplot (Classical Design)**: An active protagonist struggles against primarily external forces of antagonism through continuous time within a consistent, causally connected reality to a closed ending of absolute, irreversible change.
2.  **Miniplot (Minimalism)**: Focuses on internal conflict, features a passive protagonist, and often has an open ending.
3.  **Antiplot**: Reverses classical principles, using coincidence, nonlinear time, and inconsistent realities to reflect a sense of absurdity.

### The Controlling Idea
Every story has a core meaning, the "Controlling Idea," which can be expressed in a single sentence that combines two components:
1.  **Value**: The primary value in its positive or negative state at the story's climax.
2.  **Cause**: The chief reason why this value has changed to its final state.
(e.g., "Justice triumphs because the protagonist is more violent than the criminals.")
The story progresses through a dialectical debate between the Controlling Idea and its **Counter-Idea**.

### On Exposition: Show, Don't Tell
Exposition is the facts the audience needs to know. The key is to make it invisible.
*   **Convert Exposition to Ammunition**: Characters should use what they know as weapons in their conflicts, revealing information indirectly.
*   **Reveal Only What's Necessary**: Withhold information until the audience needs and wants to know it. Create curiosity.
*   **Save the Best for Last**: Use powerful revelations from the backstory to create major Turning Points, especially at climaxes.
`
    },
    {
        id: 'emotional-craft-maass',
        title: "The Emotional Craft of Fiction: The Donald Maass Method",
        description: "Focuses on creating a powerful emotional journey for the reader by exploring the story *beneath* the surface. Teaches how to use subtext, moral stakes, and character transformation to evoke deep feelings.",
        content: `
### Core Philosophy: The Reader's Emotional Journey
The goal is not to report what characters feel, but to induce a unique emotional journey *in the reader*. Emotional impact is not an extra; it's the fundamental purpose of fiction and the basis of voice, character arcs, and plot. The reader's experience is paramount.

### The Emotional Plot: Key Milestones
*   **Emotional Hook (Opening)**: A great opening needs both an intrigue hook (a plot question) and an emotional hook. The emotional hook is a simple, immediate reason to care about the protagonist (e.g., we see them care for someone, they express a passion, they show a core heart value like compassion or courage).
*   **The Emotional Midpoint**: This isn't just a plot twist. It's a "mirror moment" where the protagonist is utterly alone with themselves, suspended between their past and future, defined only by hope or dread. It is an inner turning point and a point of no return for their emotional journey.
*   **Failure and Defeat**: True emotional impact in moments of failure comes not from the external event, but from the loss of an *intangible* thing (e.g., a child's faith in their parent, a loss of self-identity). The scene should focus on the personal meaning of the defeat.
*   **Catalyst and Catharsis**: A catalyst event forces a protagonist's simmering inner conflicts to boil over. The resulting emotional explosion (catharsis) releases pent-up truth, clears the air, and makes genuine change possible.
*   **The True Ending**: A story is truly over not just when the plot resolves, but when the protagonist has transformed and begins to "heal the world." This means extending their newfound wholeness and peace to others, showing that personal growth leads to positive action in the community.

### Techniques for Stirring Reader Emotions
*   **Inner vs. Outer Modes**:
    *   **Showing (Outer Mode)**: Use external action, subtext, and setting to provoke feelings. This is most effective for extreme or painful character emotions (insanity, deep grief) as it creates a "safety zone" for the reader to process their *own* response.
    *   **Telling (Inner Mode)**: To make direct emotional statements effective, go beyond the obvious. Use **Third-Level Emotions**: Dig deeper than the primary feeling (e.g., fear) to find a more surprising, specific one (e.g., shame). Explore this deeper emotion with analogies, moral judgments, and justifications to make it fresh and resonant.
*   **Me-Centered Narration**: A character's narration should do more than report events. It should reveal their inner world in a way that raises questions. Use "I am" declarations to hint at underlying insecurity, and "I am not" declarations to make the reader question who the character truly is.
*   **Moral Stakes & Higher Emotions**: Reader involvement is deepest when a character is in a moral struggle. We root for a character whom we *want* to be good. Inspire "moral elevation" in the reader by showing characters acting virtuously—with courage, generosity, forgiveness, and decency—especially when it's difficult.
*   **Connecting Inner & Outer Journeys**: A character's inner state (a feeling, a decision) should be the catalyst for external action. Conversely, plot events must be processed internally, forcing the character to reflect and change. The inner and outer journeys must be fastened together like a pin connection in architecture.
*   **Symbols & Emotional Language**: Use recurring symbols to add subliminal meaning. Employ rhetorical patterns (repetition, parallels, reversals) and strong, simple words to give your prose an emotional rhythm that works on the reader unconsciously.
`
    },
    {
        id: 'vivid-scenes-soule',
        title: "The Writer's Guide to Vivid Scenes: The Soule Method",
        description: "A practical thesaurus and guide for crafting immersive descriptions of characters and settings. Emphasizes the 'show, don't tell' principle, using the five senses, and avoiding clichés to create a visceral connection for the reader.",
        content: `
### Core Philosophy: Show, Don't Tell Through Sensory Experience
The goal of description is to establish a visceral, emotional connection between the character and the reader. This is achieved by showing instead of telling, using a Deep POV (Point-of-View) to create vibrant and dramatic images in the reader's mind.

### The Five Senses: The Foundation of Description
Engage the five senses to help readers connect more closely with the character's experience.
*   **Sight**: Describe the setting through the character's eyes. Use specific, concrete details for colors, shapes, and images.
*   **Hearing**: Incorporate the sounds that surround your character. A scene with auditory details is more likely to induce an emotional reaction.
*   **Smell**: This sense is intimately linked to memory and emotion. Use scents and aromas to trigger intense memories and moods.
*   **Touch**: Allow the reader to feel the textures of the character's surroundings—the cold slap of wind, the rough bark of a tree. This prevents narrative distance.
*   **Taste**: Depict the tastes of the character's world, from the tartness of a lime to the acrid taste of whiskey.

### Key Principles for Vivid Writing
1.  **Eliminate Filter Words**: Remove words that state the narrator's mode of perception, as they create narrative distance.
    *   **SHALLOW**: "She noticed that Brock had black hair." "She felt the rough bark."
    *   **SHOWING**: "Brock's black hair hung loose." "Her hand stroked the rough bark."
    *   **Avoid**: *saw, heard, felt, noticed, thought, knew, seemed, appeared*. Instead, describe the sensory detail directly.

2.  **Use Specific Details & Strong Verbs**: Replace vague descriptions with specific, concrete words.
    *   **SHALLOW**: "I got into my car."
    *   **SHOWING**: "I hopped into my convertible BMW."
    *   **SHALLOW**: "She slipped on a blouse."
    *   **SHOWING**: "She slipped on a white, ribbed tank."
    *   Use strong, evocative verbs instead of weak verbs modified by adverbs. "Vaughn sauntered into the restaurant" is stronger than "Vaughn walked slowly into the restaurant."

3.  **Avoid Overworked Clichés**: Clichés convey a lack of originality. Instead of "skin as white as snow" or "pearl-white teeth," find unique and creative phrases.
    *   **SHALLOW**: "Her pearl-white teeth lit up her long face."
    *   **SHOWING**: "When the woman caught sight of her husband, she widely smiled, displaying straight teeth."

4.  **Describe Characters Dynamically**:
    *   Blend description with movement, introspection, and emotional reaction.
    *   Focus on distinctive characteristics that highlight unique personality (a physical tic, a specific clothing style).
    *   Weave in physical attributes throughout dialogue and action to avoid "info-dumps."
    *   Be careful not to mention a physical trait too many times unless it has plot significance.

5.  **Build Atmosphere in Settings**:
    *   A setting is more than a backdrop; it saturates the story with mood and meaning.
    *   Use weather, time of day, and sensory details to create atmosphere. A foggy night feels different from a sunny morning.
    *   Make the landscape active by having characters interact with it.
    *   Use color to add depth and create associations. Instead of "red blouse," try "ruby blouse." Instead of "blue sky," try "a vast sea of cobalt."
`
    },
    {
        id: 'vivid-dialogue-hall',
        title: "Writing Vivid Dialogue: The Rayne Hall Method",
        description: "A professional's toolbox for writing fast-paced, exciting, and sizzling dialogue. Focuses on techniques to characterize the speaker, carry the plot forward, and entertain the reader.",
        content: `
### Core Philosophy: Create an Illusion of Reality
Dialogue should sound real, but it is not a recreation of real-life conversation. Real-life speech is often rambling, repetitive, and dull. Fictional dialogue is a crafted illusion that is pithy, sizzling, and tight. Its purpose is to characterize, advance the plot, and entertain.

### Making Dialogue Pithy and Tight
*   **Leave Out the Boring Bits**: Ruthlessly cut greetings, courtesies, and ritualized small talk. Condense several to-and-fro exchanges into a single, meaningful one.
*   **Don't Repeat**: Say everything just once, in the snappiest way possible. Repetition bores the reader.
*   **Leave Out Unnecessary Words**: Cut superfluous filler words (e.g., quite, rather, really, very, completely, totally) to make dialogue snappier.
*   **Use Short Sentences**: Dialogue should be in shorter sentences than the narrative prose. Break sentences longer than twelve words into two or more shorter ones. Use contractions (can't, won't) for a natural flavor.
*   **Create Zingers**: Craft pithy, succinct, evocative one-liners that express a whole world of meaning and attitude. Prune an impactful line down to its bare essence and replace dull words with vivid ones.

### Building Tension and Interest
*   **Ask Questions**: Turn statements into questions to rouse the reader's interest and create undercurrents.
*   **Withhold Answers**: When one character asks a question, have the other character evade, ask a question back, change the subject, or delay the answer. This creates immediate tension and hints at secrets.
*   **Give Every Character an Agenda**: Every character, even a walk-on, should have a goal in the scene. This agenda, whether open or hidden, adds vibrancy and conflict to every line.

### Character Voice and Style
*   **Unique Voice**: Give each character a unique voice based on their key personality traits (e.g., resentful, forgiving, ambitious, cynical). Their personality should shine through in *what* they say (content) and *how* they say it (style).
*   **Speech Patterns**:
    *   **Self-centered**: Begins sentences with "I," uses "me," "my," "mine."
    *   **Timid/Insecure**: Uses qualifiers ("rather," "quite," "maybe") and prefaces statements with apologies.
    *   **Pompous**: Uses multi-syllabic words.
    *   **Bossy**: Phrases sentences as commands.
    *   **Gushing**: Talks in superlatives ("the best," "the worst," "absolutely").

### Mechanics and Subtext
*   **Avoid Needless Tags**: Use actions, body language, facial expressions, and tone of voice as "beats" to attribute dialogue. Beats are more vivid and reveal more about the character.
    *   **Gesture**: e.g., *She pointed to the orchard. "I saw him there."*
    *   **Posture**: e.g., *He locked his arms across his chest. "No way."*
    *   **Facial Expression**: e.g., *Her eyes narrowed. "You expect me to believe this?"*
    *   **Tone of Voice**: e.g., *"We will stand together in this." His voice was deep and resonant.*
*   **Body Language Contradicts Words**: The most advanced technique for showing subtext and hinting at lies or secrets. e.g., *“No need to hurry.” Mary drummed her fingers on the table.*
*   **Cure for 'Talking Heads'**: Give characters something to do (a mundane task, a plot-relevant action) and by weaving in setting details through their interactions with the environment.

### Advanced Techniques & Special Cases
*   **Arguments**: Keep them short and tight. Characters should interrupt each other. Use angry body language as beats.
*   **Flirtatious Banter**: The thrill stems from uncertainty. Characters phrase things in two ways—an innocuous courtesy and a personal invitation. This allows for probing and testing the ground.
*   **Internal Dialogue**: Keep thoughts short and use them sparingly. Contrast what a character *thinks* with what they *say* or *do*.
*   **Historical/Foreign Dialogue**: Write in modern English but sprinkle in a few period or foreign terms to create flavor. Avoid modern jargon. To show an accent, use a beat to describe it rather than writing phonetically.
*   **Back-loading**: Arrange sentences so the most dramatic, impactful word (love, death, truth, lies) comes at the very end.
*   **Threesomes**: Lists of three items create drama, excitement, and emotion. Arrange the list so the most shocking item comes last.
`
    },
    {
        id: 'writers-journey-vogler',
        title: "The Writer's Journey: The Vogler Method",
        description: "A deep dive into mythic structure, using archetypes and the 12 stages of the Hero's Journey to craft powerful, universally resonant stories. Based on the work of Christopher Vogler.",
        content: `
### Core Philosophy: A Practical Guide to Mythic Structure
The Writer's Journey is an adaptation of Joseph Campbell's work on the "monomyth," tailored for modern storytellers. It is not a rigid formula, but a flexible form and a practical guide to the universal patterns found in all great stories. These patterns resonate because they reflect the deep structures of the human psyche and the universal journey of life itself. The journey is a map of transformation.

### The Archetypes: Masks of Character
Archetypes are recurring character types or energies that are universally understood. They are not fixed roles but functions that characters can perform temporarily, like wearing a mask, to advance the story.
*   **HERO**: Represents the ego's search for identity and wholeness. The audience identifies with the Hero, who undergoes the most change. The Hero's core quality is a willingness to sacrifice for others.
*   **MENTOR (Wise Old Man or Woman)**: Represents the Self, the divine part of the personality. Provides motivation, training, and gifts to the Hero. Can be a positive or dark force.
*   **THRESHOLD GUARDIAN**: Tests the Hero at the gateways to new worlds. Represents the obstacles we face, including our internal neuroses and self-limitations.
*   **HERALD**: Issues a challenge and announces the coming of significant change. Delivers the Call to Adventure and gets the story rolling. Can be a person, an event, or a piece of information.
*   **SHAPESHIFTER**: Expresses the energy of the anima (the female element in the male unconscious) and animus (the male element in the female unconscious). Brings doubt, suspense, and sizzle to the story. Their loyalty is always in question. Often the love interest.
*   **SHADOW**: Represents the dark side, the unexpressed, rejected aspects of the personality. It is the energy of the villain or antagonist. Its function is to challenge the Hero and provide a worthy opponent to struggle against.
*   **ALLY**: A companion who assists the Hero and provides a sounding board. Humanizes the Hero by allowing them to express their feelings.
*   **TRICKSTER**: Embodies the energies of mischief and desire for change. Provides comic relief, challenges the status quo, and cuts big egos down to size.

### The 12 Stages of the Hero's Journey

**ACT I: Departure and Separation**
*   **1. The Ordinary World**: The Hero's normal, everyday life is established. We see their flaws, their community, and the world that needs changing, creating a vivid contrast for the Special World to come.
*   **2. The Call to Adventure**: The Hero is presented with a problem, challenge, or adventure to undertake. This inciting incident disrupts the Ordinary World and presents a quest.
*   **3. Refusal of the Call**: The Hero is reluctant or expresses fear. They balk at the threshold of adventure, signaling that the journey is risky and the stakes are high.
*   **4. Meeting with the Mentor**: The Hero encounters a Mentor figure who prepares them for the journey by providing training, guidance, or a magical gift.
*   **5. Crossing the First Threshold**: The Hero fully commits to the adventure and enters the Special World of Act Two. There's no turning back.

**ACT II: Descent, Initiation, Penetration**
*   **6. Tests, Allies, and Enemies**: The Hero learns the rules of the Special World. They are tested, make friends, and identify their enemies. This stage is for character development as the Hero reacts under stress.
*   **7. Approach to the Inmost Cave**: The Hero comes to the edge of a dangerous place, the headquarters of their greatest enemy. The Hero makes preparations for the central ordeal they are about to face.
*   **8. The Ordeal**: The central crisis. The Hero faces their greatest fear in a direct confrontation with death. The Hero must metaphorically die so they can be reborn, a critical source of the myth's magic. Their fortunes hit bottom.
*   **9. Reward (Seizing the Sword)**: Having survived death, the Hero takes possession of the treasure they came for—a physical object, knowledge, experience, or reconciliation. The Hero and audience have a moment to celebrate.

**ACT III: Return**
*   **10. The Road Back**: The Hero deals with the consequences of confronting the dark forces of the Ordeal and commits to returning to the Ordinary World. Often involves a chase scene as vengeful forces pursue them.
*   **11. The Resurrection**: The Hero faces a final, climactic ordeal of death and rebirth before returning home. It's a final exam to see if they have truly learned the lessons of the Ordeal. They are purified and reborn.
*   **12. Return with the Elixir**: The Hero returns to the Ordinary World, but the journey is meaningless unless they bring back an "Elixir"—a treasure, love, freedom, wisdom, or knowledge that can be shared with their community to heal a wounded land.
`
    },
    {
        id: 'thrill-me-percy',
        title: "Thrill Me: The Benjamin Percy Method",
        description: "Fuses genre-fueled plotting with literary craft. Focuses on creating narrative urgency, designing iconic 'set-piece' scenes, activating settings, and modulating rhythm to maximize emotional impact.",
        content: `
### Core Philosophy: Thrill Me
The goal of fiction is to merge the best of two worlds: the propulsive, page-turning quality of genre fiction and the exquisite sentences, deep characters, and subterranean themes of literary fiction. A story must be both a work of art and a thrilling experience. It must answer the reader's fundamental question: "What happens next?"

### 1. Urgency: The Engine of Narrative
*   **Establish a Clear Narrative Goal**: The story needs a "whale to kill" or a "ring to destroy." This is the high-level, external goal that gives the narrative its main propulsive arc.
*   **Create Human Urgency**: The external goal must be paired with an internal, emotional arc. The character must have a personal, compelling motivation—stakes (financial, professional, emotional, physical, spiritual) that give them, and the reader, a reason to follow the journey.
*   **Obstacles Ramp Up Tension**: Every goal must be met with obstacles. The more obstacles, the higher the tension. The journey should be a series of failures leading toward the biggest failure of all (from which redemption is possible).
*   **Lower-Order Goals**: Drive individual scenes with "micro finish lines." Give characters something to *do* while they talk. This technique, called triangulation, prevents static scenes by layering dialogue over an immediate, physical goal (e.g., gutting a fish, building a model, escaping a room).
*   **Ticking Clock**: Introduce a deadline. The hero must act before time runs out. This is one of the most effective ways to create suspense and urgency.
*   **Delay Gratification**: Prizes are shiniest before they're won; monsters are scariest before they're seen. Withhold information. Build up a character's mythology offstage before they appear. Every answer should open the door to another, more compelling question.

### 2. Set Pieces & Modulation: The Art of the Reversal
A story's rhythm must be modulated, mixing high-volume moments of action with low-volume scenes of repose to maximize emotional impact.
*   **Moments Make Movies (MMM)**: Every great story is defined by a few indelible, iconic "set-piece" scenes. These are the "crescendos"—moments of spectacle, horror, joy, or profound empathy that the reader will never forget. Build your story around 3-5 of these moments.
*   **Amplify Language and Detail**: During set pieces, the writing should intensify. Sentences can grow longer, more complex, or shorter and more frantic to match the material. Linger on the details when something is interesting.
*   **The Art of the Reversal**: The most powerful moments occur when you reverse the reader's expectations. Lull the audience with laughter and camaraderie, then hit them with sudden, shocking terror (e.g., the USS Indianapolis monologue in *Jaws*). A shift from light to dark (or vice versa) makes both states more powerful.

### 3. Activating Setting: Move Mountains
Setting is not a passive backdrop; it must be an active force in the story.
*   **Place Matters**: Anchor your story in a specific, tangible place. Abstraction is the enemy. Write about your own backyard; claim your own forty acres.
*   **Setting Through a Character's Lens**: Never give a generic description. Filter the setting through the specific point of view and mood of your character. A sunset looks different to a lover than to a man on the run.
*   **Make it Active**: Don't just describe a room; make things *happen* in it. A breeze blows curtains, floorboards creak, a picture groans on the wall. The space itself can become a character.
*   **Setting Serves Mood and Theme**: The external landscape should reflect the internal landscape of the characters. A dangerous setting can foreshadow a dangerous encounter. A cluttered room can represent a cluttered mind.

### 4. Style and Voice: Sounds Like Writing
The style of your sentences should replicate the content of the scene.
*   **Musicality**: The rhythm of your words—halting, flowing, staccato, legato—should match the scene's emotional and physical action. Use punctuation as a musical score.
*   **Point of View Determines Style**: The character's job, background, and emotional state determine the story's voice and descriptive choices. A trucker doesn't see the world the same way a kindergarten teacher does.
*   **Don't Show Off**: Your ultimate goal is to sweep the reader away. If your prose "sounds like writing," the reader becomes aware they are reading, and the dream dissolves. Pretty sentences exist only in the service of the story.

### 5. On Violence and Backstory
*   **Earn Your Violence**: Violence must be a transformative device, a catalyst for change. It should be earned through character and plot development, not used for shock value ("gorenography").
*   **The Power of the Obscene**: Sometimes, what happens off-stage is more powerful than what is shown. By closing the door, you open the reader's mind to invent the horror, making them a participant.
*   **Don't Look Back**: Use backstory sparingly. Stories are about forward movement. When you must use it, embed it in the present action rather than delivering it in static info-dumps.
`
    },
    {
        id: 'wired-for-story-cron',
        title: "Wired for Story: The Lisa Cron Method",
        description: "A neuroscience-based approach to storytelling. Focuses on how the brain is 'wired' for story and how to leverage cognitive secrets to hook readers by focusing on the protagonist's internal struggle.",
        content: `
### Core Philosophy: Story is an Internal Journey
Story, as it turns out, was crucial to our evolution. We are hardwired to turn to story to teach us the way of the world. A story is not about the plot or what happens; it is about how what happens affects a protagonist who is trying to achieve a difficult goal, and how they *change* as a result. The external plot is a vehicle to force the protagonist to confront an internal misbelief.

### Cognitive Secret 1: We think in story to envision the future.
*   **Story Secret**: From the very first sentence, the reader must want to know what happens next. A story must grab the reader's attention immediately by signaling that something out of the ordinary is happening, a crucial juncture in someone's life.

### Cognitive Secret 2: The brain filters out unnecessary information.
*   **Story Secret**: To hold the brain's attention, everything in a story must be there on a need-to-know basis. The story must have a single, overarching question it is designed to answer. Every plot point, every character, every image must move the reader closer to that answer. This creates FOCUS. The three elements of focus are:
    1.  **The Protagonist's Issue**: An internal flaw/misbelief that they must overcome.
    2.  **The Theme**: What the story says about human nature.
    3.  **The Plot**: The external events that force the protagonist to confront their issue.

### Cognitive Secret 3: Emotion determines the meaning of everything.
*   **Story Secret**: All story is emotion-based. If we're not feeling, we're not reading. The reader experiences the story by climbing into the protagonist's skin and feeling what they feel. Every event gets its emotional weight based on what it *means* to the protagonist.

### Cognitive Secret 4: We are all goal-directed.
*   **Story Secret**: A protagonist without a clear goal has nothing to figure out and nowhere to go. The goal must be external and tangible, but it must be driven by an internal, emotional need. The story is about the conflict between the external goal and the internal issue.

### Cognitive Secret 5: We see the world as we believe it to be, not as it is.
*   **Story Secret**: You must know precisely when, and why, your protagonist's worldview was knocked out of alignment. Their internal issue is a misbelief about the world born from a specific past event. The story's plot will force them to confront this misbelief.

### Cognitive Secret 6: We think in specific images, not abstractions.
*   **Story Secret**: Anything conceptual, abstract, or general must be made tangible in the protagonist's specific struggle. The story is in the specifics. Don't tell us about "sadness"; show us a specific, personal event that makes the protagonist sad and what that sadness *means* to them.

### Cognitive Secret 7: The brain stubbornly resists change.
*   **Story Secret**: Story is about change, which results only from unavoidable conflict. The plot's job is to create escalating conflict that forces the protagonist to change against their will.

### Cognitive Secret 8: The brain's primary goal is to make causal connections.
*   **Story Secret**: A story follows a cause-and-effect trajectory from start to finish. It's a logic of "if, then, therefore." Every scene is the result of the decision made in the prior scene and triggers the action of the next. There are two levels:
    1.  **Plot-wise cause and effect (External)**: Event A causes Event B.
    2.  **Story-wise cause and effect (Internal)**: The *why*. Why the character's reaction to Event A causes Event B. This internal logic is what the story is truly about.

### Cognitive Secret 9: The brain uses stories to simulate difficult situations.
*   **Story Secret**: A story’s job is to put the protagonist through tests they don't think they can pass. What can go wrong, must go wrong. The goal is to force the protagonist to confront their inner issue by making their external situation increasingly difficult.

### Cognitive Secret 10: The brain abhors randomness and seeks patterns.
*   **Story Secret**: Readers are always on the lookout for patterns. Everything in your story is either a setup, a payoff, or the road in between. A setup implies future action; a payoff must be both believable and earned.

### Cognitive Secret 11: The brain summons past memories to make sense of the present.
*   **Story Secret**: Foreshadowing, flashbacks, and subplots must instantly give readers insight into what’s happening in the main storyline. They are not digressions. A flashback must be triggered by a specific need in the present and must provide information that is immediately relevant to the current action.

### Cognitive Secret 12: It takes long-term effort to hone a skill into intuition.
*   **Story Secret**: There’s no writing; there’s only rewriting. The goal of a first draft is to discover the story. The goal of rewriting is to excavate that story, ensuring every element serves the protagonist's internal struggle according to the brain's hardwired expectations.
`
    },
    {
        id: 'writing-mysteries-mwa',
        title: "Writing Mysteries: The MWA Method",
        description: "A comprehensive handbook from the Mystery Writers of America, featuring collected wisdom from top authors on mystery structure, characterization, plotting, clues, red herrings, and suspense.",
        content: `
### Core Philosophy: A Multi-faceted Guide to the Mystery Genre
This is a collection of essays from various masters of the mystery genre, offering diverse but complementary advice on every aspect of the craft. While methods differ, the core principles of mystery writing—a compelling puzzle, believable characters, and a satisfying resolution—are paramount.

### The Rules & How to Bend Them (Jeremiah Healy)
*   **Core Idea**: Understand the reason behind a rule before you decide to bend or break it.
*   **1. The Plot Is Everything**: The plot must be paramount. Readers come to mysteries for a story with resolution and punishment for the guilty. Don't bend this rule.
*   **2. The Hero**: Traditionally male, but now can be anyone as long as they are credible. The same applies to the "heterosexual rogue" stereotype—it's outdated. Character depth trumps tropes.
*   **3. The Setting**: Doesn't have to be L.A. Choose a setting that provides a suitable backdrop and a diverse cast.
*   **4. Violence**: Some violence is required to test the hero's courage, but it must be rational and advance the plot. At least one death-by-criminal-act is necessary.
*   **5. The Hero Cannot Be the Culprit**: In first-person PI novels, this is a betrayal of reader trust. The reader identifies with the narrator.
*   **6. The Culprit Must Appear Early**: Introduce the culprit within the first third of the novel. This is about fairness to the reader, who is trying to solve the puzzle.
*   **7. Authenticity is Required**: You must be authentic when you are trying to be authentic. Do your research to avoid offending knowledgeable readers.

### Characterization & Villains (Michael Connelly, Sandra Scoppettone, Margaret Maron)
*   **Character is the Central Plate**: Character is the most important element. A good plot is empty unless filled with the blood of character.
*   **Character is Conflict**: Everyone must want something on every page. A character is defined by how they face and overcome obstacles. A detective's personal turmoil should parallel the main case.
*   **Telling Details**: Use specific, nuanced details that reveal a character's true world and interior state (e.g., teeth marks on an earpiece).
*   **Vivid Villains**: The villain needs to be worth the finding. Understand their pathology and, most importantly, their motivation. They must be believable and not purely evil; give them humanizing qualities to make them more interesting.
*   **Rounding Up Your Cast**: Differentiate characters with unique mannerisms, speech patterns, and reactions to the world around them. Give them flaws and virtues.

### Plotting, Pacing, and Structure
*   **Finding the Idea (Marilyn Wallace)**: Ideas come from everywhere—emotions, news, observations. A "trick ending" idea is suited for a short story; a moral dilemma or relationship is better for a novel.
*   **Outlining vs. No Outline (Robert Campbell, Tony Hillerman)**:
    *   **No Blueprints (Hillerman)**: Some writers discover the story as they write. An outline can feel restrictive. Being "in the scene" allows for creative solutions that planning can't predict.
    *   **Flexible Outlining (Campbell)**: Use an outline as a flexible guide, not a rigid blueprint. Create documents for chronology, characters, and agendas to keep track of details while allowing for discovery.
*   **The Ending is the Beginning (John Lutz)**: Know your ending before you start. This ensures every clue and bit of foreshadowing leads to an inevitable, yet surprising, conclusion.
*   **Pacing and Suspense (Phyllis A. Whitney)**: A story needs peaks and valleys. Constant high tension is exhausting. Suspense comes from a character's desperate need, facing high stakes. Use secrets, the unexpected, and cliffhangers at chapter ends to maintain momentum.

### Clues, Red Herrings, and Plot Devices (P.M. Carlson)
*   **The Hunt**: The detective is a hunting dog, and the reader is the pack. The plot is the trail.
*   **Red Herring**: A powerful, attractive distraction dragged across the true trail to mislead the hounds (the readers). It must be a compelling story in itself.
*   **Clues**: Provide the eventual explanation of the crime. They must be logical and fairly placed. Clues can be physical objects, false statements, or insights from a character's special knowledge.
*   **Foreshadowing**: Creates a sense of inevitability. It should register more on the reader's subconscious than their conscious mind—more emotion than fact.
`
    }
];

const allCraftKnowledgeIds = BUILT_IN_CRAFT_KNOWLEDGE.map(book => book.id);

export const ALL_ON_AI_CRAFT_CONFIG: AICraftConfig = AI_CONFIGURABLE_TOOLS.reduce((acc, tool) => {
    acc[tool.id] = [...allCraftKnowledgeIds];
    return acc;
}, {} as AICraftConfig);

export const ALL_OFF_AI_CRAFT_CONFIG: AICraftConfig = AI_CONFIGURABLE_TOOLS.reduce((acc, tool) => {
    acc[tool.id] = [];
    return acc;
}, {} as AICraftConfig);


export const CLASSIC_15_BEAT_STORY_STRUCTURE: OutlineNode[] = [
    { id: 1, title: "1. Opening Image (0-1%)", description: "A 'before' snapshot of your hero and their world. Sets the tone, style, and mood.", content: "", children: [] },
    { id: 2, title: "2. Theme Stated (5%)", description: "A statement made by a character (usually not the hero) that hints at the hero's arc or life lesson.", content: "", children: [] },
    { id: 3, title: "3. Setup (1-10%)", description: "Explore the hero's status quo life and all its flaws. Show why the hero needs to change.", content: "", children: [] },
    { id: 4, title: "4. Catalyst (10%)", description: "An inciting incident that catapults the hero into a new world or way of thinking.", content: "", children: [] },
    { id: 5, title: "5. Debate (10-20%)", description: "The hero debates what to do next, showing their reluctance to change.", content: "", children: [] },
    { id: 6, title: "6. Break into Act 2 (20%)", description: "The hero decides to accept the call to action, leaving their comfort zone.", content: "", children: [] },
    { id: 7, title: "7. B Story (22%)", description: "Introduction of a new character or relationship that will help the hero learn the theme.", content: "", children: [] },
    { id: 8, title: "8. Fun and Games (20-50%)", description: "The 'promise of the premise.' The hero explores the new world, either succeeding or floundering.", content: "", children: [] },
    { id: 9, title: "9. Midpoint (50%)", description: "A false victory or false defeat that raises the stakes and pushes the hero toward real change.", content: "", children: [] },
    { id: 10, title: "10. Bad Guys Close In (50-75%)", description: "The hero's internal and external flaws/enemies are closing in.", content: "", children: [] },
    { id: 11, title: "11. All Is Lost (75%)", description: "The lowest point of the novel. A moment that pushes the hero to rock bottom.", content: "", children: [] },
    { id: 12, title: "12. Dark Night of the Soul (75-80%)", description: "The hero processes their lowest point, just before the 'aha!' moment.", content: "", children: [] },
    { id: 13, title: "13. Break into Act 3 (80%)", description: "The 'aha!' moment. The hero realizes what they must do to fix themselves and the problem.", content: "", children: [] },
    { id: 14, title: "14. Finale (80-99%)", description: "The hero enacts their plan, proving they have learned the theme and transformed.", content: "", children: [] },
    { id: 15, title: "15. Final Image (99-100%)", description: "An 'after' snapshot of the hero and their world, mirroring the Opening Image to show transformation.", content: "", children: [] }
];

export const THREE_ACT_STRUCTURE: OutlineNode[] = [
  { id: 1, title: "Act I: The Setup", description: "Introduce the characters, the world, and the inciting incident that kicks off the story.", content: "", children: [] },
  { id: 2, title: "Act II: The Confrontation", description: "The protagonist faces rising stakes and obstacles, leading to a midpoint crisis and a low point.", content: "", children: [] },
  { id: 3, title: "Act III: The Resolution", description: "The protagonist confronts the final conflict, reaches a climax, and the story concludes, showing the aftermath and character change.", content: "", children: [] },
];

export const characterArchetypes = [
  "Ally / Sidekick", "Amazon", "Anima / Animus", "Anti-Hero", "Artist", "Beast", "Bully", "Byronic Hero", "Caregiver", "Child", "Chosen One", "Classic Hero", "Computer Geek / Hacker", "Corrupted", "Crone", "Cynical Survivor", "Damsel in Distress", "Dark Lord / Overlord", "Divine Child", "Everyman / Everywoman", "Explorer", "Father Figure", "Femme Fatale / Homme Fatale", "Final Girl", "Fool", "Friendly Beast", "Great Mother", "Harbinger", "Hardboiled Detective", "Haunted Detective", "Henchman / The Brute", "Herald", "Hero", "Hermit / The Recluse", "Honorable Paladin", "Innocent / The Ingénue", "Jester", "Jester / The Fool", "Knight-Errant", "Lover", "Loyal Retainer", "Mad Scientist", "Magician", "Manic Pixie Dream Girl", "Mastermind / Evil Genius", "Mentor", "Mother Figure", "Noble Savage", "Orphan", "Outcast", "Outlaw", "Parental Figure", "Persona", "Platonic Ideal", "Pragmatic Mystic", "Prophet", "Rebel", "Reluctant Hero", "Reluctant Villain", "Rogue A.I.", "Ruler", "Sage", "Sassy Best Friend", "Scapegoat", "Seductress", "Self", "Shadow", "Shapeshifter", "Sidekick", "Star-Crossed Lovers", "The Father", "Threshold Guardian", "Tragic Hero", "Trickster", "Trickster Villain", "Tyrant", "Underdog", "Unwilling Oracle", "Wanderer", "Warrior", "Well-Intentioned Extremist", "Wise Old Man/Woman"
];

export const initialProjects: Project[] = [
    { 
        id: 1, 
        name: "Weep Not The Veil", 
        type: 'Novel', 
        genres: ['Supernatural Noir'],
        subGenres: [],
        manuscript: {
            novel: "",
            screenplay: ""
        },
        worldBible: deepCopy(emptyWorldBible),
        outline: [],
        sidebarConfig: deepCopy(defaultSidebarConfig),
        proseDocuments: [],
        aiCraftConfig: deepCopy(ALL_ON_AI_CRAFT_CONFIG),
    },
];