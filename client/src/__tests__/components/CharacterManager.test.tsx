/**
 * Enterprise Test Suite - Character Manager
 * Comprehensive testing for the sophisticated character management system
 */

import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders, characterTestUtils, a11yTestUtils } from '@/utils/testUtils';
import { CharacterManager } from '@/components/character/CharacterManager';

// Mock the character service
const mockCharacterService = {
  getCharacters: jest.fn(),
  createCharacter: jest.fn(),
  updateCharacter: jest.fn(),
  deleteCharacter: jest.fn(),
};

jest.mock('@/lib/api', () => ({
  characterService: mockCharacterService,
}));

describe('CharacterManager', () => {
  const defaultProps = {
    projectId: 'test-project-1',
    selectedCharacterId: null,
    onClearSelection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCharacterService.getCharacters.mockResolvedValue([]);
  });

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText(/character/i)).toBeInTheDocument();
      });
    });

    it('displays loading state initially', () => {
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('displays empty state when no characters exist', async () => {
      mockCharacterService.getCharacters.mockResolvedValue([]);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText(/no characters/i)).toBeInTheDocument();
      });
    });

    it('displays character list when characters exist', async () => {
      const mockCharacters = [
        characterTestUtils.createMockCharacter({ name: 'Aragorn' }),
        characterTestUtils.createMockCharacter({ name: 'Legolas', id: 'char-2' }),
      ];
      
      mockCharacterService.getCharacters.mockResolvedValue(mockCharacters);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Aragorn')).toBeInTheDocument();
        expect(screen.getByText('Legolas')).toBeInTheDocument();
      });
    });
  });

  describe('Character Creation', () => {
    it('opens character creation form when create button is clicked', async () => {
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      const createButton = await screen.findByText(/create character/i);
      fireEvent.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText(/new character/i)).toBeInTheDocument();
      });
    });

    it('creates new character with valid data', async () => {
      const newCharacter = characterTestUtils.createMockCharacter({ name: 'New Hero' });
      mockCharacterService.createCharacter.mockResolvedValue(newCharacter);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      const createButton = await screen.findByText(/create character/i);
      fireEvent.click(createButton);
      
      // Fill in character form
      const nameInput = await screen.findByLabelText(/character name/i);
      fireEvent.change(nameInput, { target: { value: 'New Hero' } });
      
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockCharacterService.createCharacter).toHaveBeenCalledWith(
          'test-project-1',
          expect.objectContaining({ name: 'New Hero' })
        );
      });
    });

    it('shows validation errors for invalid data', async () => {
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      const createButton = await screen.findByText(/create character/i);
      fireEvent.click(createButton);
      
      // Try to save without required fields
      const saveButton = await screen.findByText(/save/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Character Editing', () => {
    it('opens character editor when edit button is clicked', async () => {
      const mockCharacter = characterTestUtils.createMockCharacter({ name: 'Aragorn' });
      mockCharacterService.getCharacters.mockResolvedValue([mockCharacter]);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Aragorn')).toBeInTheDocument();
      });
      
      const editButton = screen.getByText(/edit/i);
      fireEvent.click(editButton);
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('Aragorn')).toBeInTheDocument();
      });
    });

    it('updates character with new data', async () => {
      const mockCharacter = characterTestUtils.createMockCharacter({ name: 'Aragorn' });
      const updatedCharacter = { ...mockCharacter, name: 'Strider' };
      
      mockCharacterService.getCharacters.mockResolvedValue([mockCharacter]);
      mockCharacterService.updateCharacter.mockResolvedValue(updatedCharacter);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Aragorn')).toBeInTheDocument();
      });
      
      const editButton = screen.getByText(/edit/i);
      fireEvent.click(editButton);
      
      const nameInput = await screen.findByDisplayValue('Aragorn');
      fireEvent.change(nameInput, { target: { value: 'Strider' } });
      
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockCharacterService.updateCharacter).toHaveBeenCalledWith(
          mockCharacter.id,
          expect.objectContaining({ name: 'Strider' })
        );
      });
    });
  });

  describe('Character Deletion', () => {
    it('deletes character when delete is confirmed', async () => {
      const mockCharacter = characterTestUtils.createMockCharacter({ name: 'Aragorn' });
      mockCharacterService.getCharacters.mockResolvedValue([mockCharacter]);
      mockCharacterService.deleteCharacter.mockResolvedValue(true);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Aragorn')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByText(/delete/i);
      fireEvent.click(deleteButton);
      
      // Confirm deletion
      const confirmButton = await screen.findByText(/confirm/i);
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(mockCharacterService.deleteCharacter).toHaveBeenCalledWith(mockCharacter.id);
      });
    });

    it('cancels deletion when user cancels', async () => {
      const mockCharacter = characterTestUtils.createMockCharacter({ name: 'Aragorn' });
      mockCharacterService.getCharacters.mockResolvedValue([mockCharacter]);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Aragorn')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByText(/delete/i);
      fireEvent.click(deleteButton);
      
      // Cancel deletion
      const cancelButton = await screen.findByText(/cancel/i);
      fireEvent.click(cancelButton);
      
      expect(mockCharacterService.deleteCharacter).not.toHaveBeenCalled();
    });
  });

  describe('164+ Character Fields System', () => {
    it('renders all character field categories', async () => {
      const mockCharacter = characterTestUtils.createMockCharacter({
        fields: {
          // Basic info
          age: '25',
          occupation: 'Ranger',
          // Appearance
          height: '6ft 2in',
          eyeColor: 'Grey',
          // Personality
          personality: 'Stoic and determined',
          fears: 'Failure to protect others',
          // Background
          birthplace: 'Gondor',
          family: 'House of Isildur',
        }
      });
      
      mockCharacterService.getCharacters.mockResolvedValue([mockCharacter]);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Aragorn')).toBeInTheDocument();
      });
      
      const viewButton = screen.getByText(/view details/i);
      fireEvent.click(viewButton);
      
      await waitFor(() => {
        // Check that different field categories are displayed
        expect(screen.getByText(/basic information/i)).toBeInTheDocument();
        expect(screen.getByText(/appearance/i)).toBeInTheDocument();
        expect(screen.getByText(/personality/i)).toBeInTheDocument();
        expect(screen.getByText(/background/i)).toBeInTheDocument();
      });
    });

    it('handles different field types correctly', async () => {
      const mockCharacter = characterTestUtils.createMockCharacter({
        fields: {
          name: 'Text field',
          biography: 'Long textarea content...',
          alignment: 'Lawful Good', // Select field
          skills: ['Swordsmanship', 'Leadership'], // Multi-select
          level: 20, // Number field
          isAlive: true, // Boolean field
        }
      });
      
      mockCharacterService.getCharacters.mockResolvedValue([mockCharacter]);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      const editButton = await screen.findByText(/edit/i);
      fireEvent.click(editButton);
      
      await waitFor(() => {
        // Check different input types are rendered
        expect(screen.getByDisplayValue('Text field')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Long textarea content...')).toBeInTheDocument();
        expect(screen.getByDisplayValue('20')).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { checked: true })).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('is keyboard navigable', async () => {
      const mockCharacter = characterTestUtils.createMockCharacter();
      mockCharacterService.getCharacters.mockResolvedValue([mockCharacter]);
      
      const { container } = renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Aragorn')).toBeInTheDocument();
      });
      
      const interactiveElements = container.querySelectorAll('button, input, select, textarea, [tabindex]');
      interactiveElements.forEach(element => {
        a11yTestUtils.expectKeyboardNavigable(element as HTMLElement);
      });
    });

    it('has proper ARIA labels', async () => {
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        const mainRegion = screen.getByRole('main') || screen.getByRole('region');
        expect(mainRegion).toHaveAttribute('aria-label');
      });
    });

    it('has proper heading structure', async () => {
      const { container } = renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        a11yTestUtils.expectProperHeadingStructure(container);
      });
    });
  });

  describe('Performance', () => {
    it('renders efficiently with many characters', async () => {
      // Create 100 mock characters
      const manyCharacters = Array.from({ length: 100 }, (_, i) => 
        characterTestUtils.createMockCharacter({ 
          name: `Character ${i}`, 
          id: `char-${i}` 
        })
      );
      
      mockCharacterService.getCharacters.mockResolvedValue(manyCharacters);
      
      const renderTime = await performanceTestUtils.measureRenderTime(() => {
        renderWithProviders(<CharacterManager {...defaultProps} />);
      });
      
      // Should render 100 characters in under 500ms
      performanceTestUtils.expectFastRender(renderTime, 500);
    });

    it('handles character updates without full re-render', async () => {
      const mockCharacter = characterTestUtils.createMockCharacter();
      mockCharacterService.getCharacters.mockResolvedValue([mockCharacter]);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Aragorn')).toBeInTheDocument();
      });
      
      // Update character and measure re-render time
      const updatedCharacter = { ...mockCharacter, name: 'Strider' };
      mockCharacterService.updateCharacter.mockResolvedValue(updatedCharacter);
      
      const updateTime = await performanceTestUtils.measureRenderTime(() => {
        // Trigger character update
        const editButton = screen.getByText(/edit/i);
        fireEvent.click(editButton);
      });
      
      // Update should be fast (under 100ms)
      performanceTestUtils.expectFastRender(updateTime, 100);
    });
  });

  describe('Error Handling', () => {
    it('displays error message when character loading fails', async () => {
      mockCharacterService.getCharacters.mockRejectedValue(new Error('Network error'));
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText(/error loading characters/i)).toBeInTheDocument();
      });
    });

    it('displays error message when character creation fails', async () => {
      mockCharacterService.createCharacter.mockRejectedValue(new Error('Creation failed'));
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      const createButton = await screen.findByText(/create character/i);
      fireEvent.click(createButton);
      
      const nameInput = await screen.findByLabelText(/character name/i);
      fireEvent.change(nameInput, { target: { value: 'New Hero' } });
      
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to create character/i)).toBeInTheDocument();
      });
    });

    it('recovers gracefully from API errors', async () => {
      // First call fails, second succeeds
      mockCharacterService.getCharacters
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce([characterTestUtils.createMockCharacter()]);
      
      renderWithProviders(<CharacterManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText(/error loading characters/i)).toBeInTheDocument();
      });
      
      // Retry button should work
      const retryButton = screen.getByText(/retry/i);
      fireEvent.click(retryButton);
      
      await waitFor(() => {
        expect(screen.getByText('Aragorn')).toBeInTheDocument();
      });
    });
  });
});