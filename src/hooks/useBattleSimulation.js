import { useState } from 'react';
import OpenAI from 'openai';
import { fal } from '@fal-ai/client';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for battle simulation
 * @returns {Object} Battle simulation state and functions
 */
const useBattleSimulation = () => {
  const { t, i18n } = useTranslation();
  const [fightText, setFightText] = useState('');
  const [fightImage, setFightImage] = useState(null);
  const [loadingBattle, setLoadingBattle] = useState(false);
  const [errorBattle, setErrorBattle] = useState(null);
  const [winnerHero, setWinnerHero] = useState(null);

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy instead
  });

  /**
   * Format hero powerstats for battle narrative
   * @param {Object} stats - Hero powerstats
   * @returns {string} Formatted stats string
   */
  const formatPowerstats = (stats) =>
    Object.entries(stats)
      .map(([key, value]) => `${key}: ${value || 'N/A'}`)
      .join(', ');

  /**
   * Determine the winner based on battle text
   * @param {string} text - Battle narrative text
   * @param {Object} hero1 - First hero
   * @param {Object} hero2 - Second hero
   * @returns {Object|null} Winner hero or null if no clear winner
   */
  const determineWinner = (text, hero1, hero2) => {
    const lowerText = text.toLowerCase();
    const hero1Name = hero1.name.toLowerCase();
    const hero2Name = hero2.name.toLowerCase();

    // Victory keywords to search for
    const victoryTerms = [
      'wins', 'won', 'winner', 'victorious', 'triumphs', 'triumphant',
      'defeated', 'bested', 'overpowered', 'emerged victorious',
      'claimed victory', 'stands tall', 'prevailed'
    ];

    // Defeat keywords to search for
    const defeatTerms = [
      'defeated', 'lost', 'falls', 'collapsed', 'surrendered',
      'knocked out', 'unconscious', 'beaten', 'bested'
    ];

    // Score system to determine winner with more confidence
    let hero1Score = 0;
    let hero2Score = 0;

    // Check for victory terms near hero names
    for (const term of victoryTerms) {
      // Check for phrases like "Batman wins" or "Batman is victorious"
      if (lowerText.includes(`${hero1Name} ${term}`) ||
          lowerText.includes(`${hero1Name} is ${term}`) ||
          lowerText.includes(`${hero1Name} has ${term}`)) {
        hero1Score += 2;
      }

      if (lowerText.includes(`${hero2Name} ${term}`) ||
          lowerText.includes(`${hero2Name} is ${term}`) ||
          lowerText.includes(`${hero2Name} has ${term}`)) {
        hero2Score += 2;
      }

      // Check for phrases where the hero name is mentioned in the same sentence as victory terms
      const hero1Sentences = lowerText.split(/[.!?]+/).filter(sentence =>
        sentence.includes(hero1Name) && sentence.includes(term)
      );

      const hero2Sentences = lowerText.split(/[.!?]+/).filter(sentence =>
        sentence.includes(hero2Name) && sentence.includes(term)
      );

      hero1Score += hero1Sentences.length;
      hero2Score += hero2Sentences.length;
    }

    // Check for defeat terms near hero names
    for (const term of defeatTerms) {
      // Check for phrases like "Batman defeated" (meaning Batman was defeated)
      if (lowerText.includes(`${hero1Name} ${term}`) && !lowerText.includes(`${hero1Name} ${term} ${hero2Name}`)) {
        hero2Score += 1; // If hero1 is defeated, hero2 gains points
      }

      if (lowerText.includes(`${hero2Name} ${term}`) && !lowerText.includes(`${hero2Name} ${term} ${hero1Name}`)) {
        hero1Score += 1; // If hero2 is defeated, hero1 gains points
      }

      // Check for phrases like "Batman defeated Superman"
      if (lowerText.includes(`${hero1Name} ${term} ${hero2Name}`)) {
        hero1Score += 2;
      }

      if (lowerText.includes(`${hero2Name} ${term} ${hero1Name}`)) {
        hero2Score += 2;
      }
    }

    // Check for the last paragraph which often contains the conclusion
    const paragraphs = text.split('\n\n');
    const lastParagraph = paragraphs[paragraphs.length - 1].toLowerCase();

    if (lastParagraph.includes(hero1Name) &&
        victoryTerms.some(term => lastParagraph.includes(term))) {
      hero1Score += 3; // Extra weight for being mentioned as victor in conclusion
    }

    if (lastParagraph.includes(hero2Name) &&
        victoryTerms.some(term => lastParagraph.includes(term))) {
      hero2Score += 3; // Extra weight for being mentioned as victor in conclusion
    }

    console.log(`Winner detection scores - ${hero1.name}: ${hero1Score}, ${hero2.name}: ${hero2Score}`);

    // Determine winner based on scores
    if (hero1Score > hero2Score + 2) { // Requiring a clear margin to declare winner
      return hero1;
    } else if (hero2Score > hero1Score + 2) {
      return hero2;
    }

    // If scores are close, fall back to simpler detection
    if (lowerText.includes(`${hero1Name} wins`) ||
        lowerText.includes(`${hero1Name} is victorious`) ||
        lowerText.includes(`${hero1Name} triumphs`)) {
      return hero1;
    }

    if (lowerText.includes(`${hero2Name} wins`) ||
        lowerText.includes(`${hero2Name} is victorious`) ||
        lowerText.includes(`${hero2Name} triumphs`)) {
      return hero2;
    }

    // If no clear winner is found
    return hero1Score >= hero2Score ? hero1 : hero2; // Default to higher score if close
  };

  /**
   * Save battle to local storage
   * @param {Object} battleData - Battle data to save
   */
  const saveBattleToJournal = (battleData) => {
    try {
      const existingEntries = JSON.parse(localStorage.getItem('combatJournal') || '[]');
      const updatedEntries = [battleData, ...existingEntries];
      localStorage.setItem('combatJournal', JSON.stringify(updatedEntries));
      console.log("✅ Battle saved to Combat Journal!");
    } catch (storageError) {
      console.error("Error saving battle to localStorage:", storageError);
    }
  };

  /**
   * Generate battle text using OpenAI
   * @param {Object} hero1 - First hero
   * @param {Object} hero2 - Second hero
   * @returns {Promise<string>} Generated battle text
   */
  const generateBattleText = async (hero1, hero2) => {
    const hero1Stats = formatPowerstats(hero1.powerstats);
    const hero2Stats = formatPowerstats(hero2.powerstats);

    const systemMessage = `You are a master comic book storyteller with deep knowledge of superhero lore and combat dynamics.

Write a vivid, engaging, multi-paragraph narrative (4-5 paragraphs) of an epic battle between the two provided superheroes.

Your narrative should include:
1. A compelling setting that fits the heroes' styles and abilities
2. Strategic use of each hero's powers and abilities based on their powerstats
3. Dynamic action sequences with cinematic descriptions
4. Realistic combat progression showing advantages shifting between combatants
5. A dramatic climax with a clear winner determined by logical application of their abilities
6. An explanation of why the winner prevailed integrated naturally into the story

Weave their key powerstats and abilities into the story naturally, showing how strength, intelligence, speed, etc. affect the battle's outcome. Use comic book storytelling techniques like onomatopoeia, dynamic scene transitions, and dramatic tension.

Respond ONLY with the battle story. Maintain a dramatic, high-stakes tone appropriate for a premium comic book publication.

Language: ${i18n.language === 'fr' ? 'French' : 'English'}.`;

    const userMessage = `Create an epic battle narrative between ${hero1.name} and ${hero2.name} in a high-stakes confrontation.

HERO 1: ${hero1.name}
Powerstats: ${hero1Stats}

HERO 2: ${hero2.name}
Powerstats: ${hero2Stats}

Consider their relative strengths and weaknesses when determining the outcome. The battle should be fair and logical based on their abilities, not random. The narrative should show how specific stats (strength, intelligence, speed, etc.) influence the fight's progression and outcome.

Focus on cinematic storytelling with vivid descriptions, incorporating their stats/abilities naturally into the action. Ensure there is a clear winner with a logical explanation for their victory woven into the narrative.`;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 800, // Increased token limit for more detailed responses
    });

    if (gptResponse?.choices?.[0]?.message?.content) {
      return gptResponse.choices[0].message.content.trim();
    }

    throw new Error("Unexpected OpenAI response structure");
  };

  /**
   * Extract key battle moment from battle text
   * @param {string} battleText - The full battle narrative
   * @returns {string} Key moment description
   */
  const extractKeyBattleMoment = (battleText) => {
    // Split into paragraphs
    const paragraphs = battleText.split('\n\n');

    // If we have at least 3 paragraphs, use the climactic paragraph (usually the second-to-last)
    if (paragraphs.length >= 3) {
      return paragraphs[paragraphs.length - 2];
    }

    // Otherwise use the last paragraph which often contains the climax
    return paragraphs[paragraphs.length - 1];
  };

  /**
   * Generate battle image using Fal.ai
   * @param {Object} hero1 - First hero
   * @param {Object} hero2 - Second hero
   * @param {string} battleText - The battle narrative
   * @returns {Promise<string>} Image URL
   */
  const generateBattleImage = async (hero1, hero2, battleText) => {
    // Extract a key moment from the battle text
    const keyMoment = extractKeyBattleMoment(battleText);

    // Create a more specific prompt based on the battle narrative
    const imagePrompt = `Epic comic book art style illustration with dynamic composition:
${hero1.name} versus ${hero2.name} in this specific battle scene: "${keyMoment.substring(0, 300)}".
Dramatic lighting, action poses, energy effects, detailed superhero costumes, cinematic angle,
high contrast, vibrant colors, comic book panel style. Show both heroes in dynamic action poses.`;

    console.log("Image generation prompt:", imagePrompt);

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: imagePrompt,
        negative_prompt: "deformed, ugly, bad anatomy, blurry, pixelated, low quality, text, watermark, signature, speech bubbles, words"
      },
    });

    if (result?.data?.images?.[0]?.url) {
      return result.data.images[0].url;
    }

    return null;
  };

  /**
   * Simulate a battle between two heroes
   * @param {Object} hero1 - First hero
   * @param {Object} hero2 - Second hero
   */
  const simulateBattle = async (hero1, hero2) => {
    if (!hero1 || !hero2) return;

    setLoadingBattle(true);
    setErrorBattle(null);
    setFightText('');
    setFightImage(null);
    setWinnerHero(null);

    let generatedText = '';
    let imageUrl = null;

    // Step 1: Generate battle text
    try {
      generatedText = await generateBattleText(hero1, hero2);
      setFightText(generatedText);

      // Determine winner
      const winner = determineWinner(generatedText, hero1, hero2);
      setWinnerHero(winner);
    } catch (error) {
      console.error("Error generating battle text:", error);
      setErrorBattle(t('errorGeneratingBattleText'));
    }

    // Step 2: Generate battle image (only if we have battle text)
    if (generatedText) {
      try {
        imageUrl = await generateBattleImage(hero1, hero2, generatedText);
        if (imageUrl) {
          setFightImage(imageUrl);
        }
      } catch (error) {
        console.error("Error generating battle image:", error);
        // Don't set error state here to allow the battle to continue with just text
      }
    }

    // Step 3: Save battle to journal if text was generated
    if (generatedText && hero1 && hero2) {
      // Use a better message for draws
      let winnerNameText;
      if (winnerHero) {
        winnerNameText = winnerHero.name;
      } else {
        // Use translation for draw
        winnerNameText = t('draw') || "Draw";
      }

      const battleData = {
        id: `battle-${Date.now()}`,
        hero1Name: hero1.name,
        hero1Image: hero1.image.url,
        hero2Name: hero2.name,
        hero2Image: hero2.image.url,
        battleText: generatedText,
        battleImage: imageUrl,
        winnerName: winnerNameText,
        timestamp: new Date().toISOString(),
      };

      saveBattleToJournal(battleData);
    }

    setLoadingBattle(false);
  };

  /**
   * Reset battle state
   */
  const resetBattle = () => {
    setFightText('');
    setFightImage(null);
    setErrorBattle(null);
    setWinnerHero(null);
  };

  return {
    fightText,
    fightImage,
    loadingBattle,
    errorBattle,
    winnerHero,
    simulateBattle,
    resetBattle
  };
};

export default useBattleSimulation;
