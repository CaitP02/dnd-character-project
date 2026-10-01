import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterSheetForm from './CharacterSheetForm.jsx';
import { emptySheet, setIn, toPayload } from '../../lib/sheet.js';

// Renders the sheet with real state so typing updates it, and exposes the latest payload.
const renderSheet = (initial = emptySheet()) => {
  const roll = vi.fn();
  let latest = initial;
  const Harness = () => {
    const [sheet, setSheet] = useState(initial);
    latest = sheet;
    return <CharacterSheetForm sheet={sheet} set={(path, value) => setSheet((s) => setIn(s, path, value))} roll={roll} />;
  };
  render(<Harness />);
  return { roll, user: userEvent.setup(), payload: () => toPayload(latest) };
};

describe('CharacterSheetForm', () => {
  it('stores what the player writes', async () => {
    const { user, payload } = renderSheet();
    await user.type(screen.getByLabelText('Character name'), 'Tock');
    await user.type(screen.getByLabelText('Level'), '3');
    await user.type(screen.getByLabelText('Armour class'), '16');
    await user.type(screen.getByLabelText('Equipment, features & notes'), 'Crossbow');

    expect(payload()).toMatchObject({ name: 'Tock', level: 3, armourClass: 16, notes: 'Crossbow' });
  });

  it('works out the ability modifier and sets up a check with it', async () => {
    const { user, roll } = renderSheet();
    await user.type(screen.getByLabelText('Strength score'), '17');
    expect(screen.getByLabelText('Strength modifier')).toHaveTextContent('+3');

    await user.click(screen.getByRole('button', { name: 'Put Strength check on the dice board' }));
    expect(roll).toHaveBeenCalledWith('Strength check', 3);
  });

  it('sets up skill and save checks with the bonus written on the sheet', async () => {
    const { user, roll } = renderSheet();
    await user.type(screen.getByLabelText('Stealth bonus'), '5');
    await user.click(screen.getByLabelText('Stealth proficient'));
    await user.click(screen.getByRole('button', { name: 'Put Stealth on the dice board' }));
    expect(roll).toHaveBeenCalledWith('Stealth', 5);

    await user.type(screen.getByLabelText('Strength save bonus'), '4');
    await user.click(screen.getByRole('button', { name: 'Put Strength save on the dice board' }));
    expect(roll).toHaveBeenCalledWith('Strength save', 4);
  });

  it('lets the player pick from the list or write in their own race', async () => {
    const { user, payload } = renderSheet();
    await user.selectOptions(screen.getByLabelText('Race'), 'Elf');
    expect(payload().race).toBe('Elf');

    await user.selectOptions(screen.getByLabelText('Race'), 'Other…');
    await user.type(screen.getByLabelText('Race (other)'), 'Warforged');
    expect(payload().race).toBe('Warforged');

    await user.click(screen.getByRole('button', { name: 'list' }));
    expect(screen.getByLabelText('Race').tagName).toBe('SELECT');
  });

  it('opens a saved custom class in write-in mode', () => {
    renderSheet({ ...emptySheet(), characterClass: 'Blood Hunter' });
    expect(screen.getByLabelText('Class (other)')).toHaveValue('Blood Hunter');
  });
});
