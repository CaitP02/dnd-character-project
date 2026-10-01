import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiceTray from './DiceTray.jsx';
import { describePool, useDiceRoller } from '../../hooks/useDiceRoller.js';

// Returns the given face values in order for dice of any size.
const fixedRng = (faces, sides) => {
  let i = 0;
  return () => (faces[i++ % faces.length] - 0.5) / sides;
};

let roller;
const Harness = ({ rng }) => {
  roller = useDiceRoller(rng);
  return <DiceTray roller={roller} />;
};

describe('describePool', () => {
  it('groups dice and adds the modifier', () => {
    expect(describePool([6, 8, 6], 3)).toBe('d8 + 2d6 + 3');
    expect(describePool([20], -1)).toBe('d20 − 1');
    expect(describePool([4])).toBe('d4');
  });
});

describe('useDiceRoller', () => {
  it('rolls everything on the board and adds the modifier', () => {
    const { result } = renderHook(() => useDiceRoller(fixedRng([3, 5], 6)));
    act(() => {
      result.current.addDie(6);
      result.current.addDie(6);
      result.current.setModifier('2');
    });
    act(() => result.current.roll());
    expect(result.current.latest.result).toMatchObject({ total: 10, modifier: 2 });
    expect(result.current.latest.result.dice.map((d) => d.value)).toEqual([3, 5]);
    expect(result.current.latest.label).toBe('2d6 + 2');
  });

  it('applies advantage to a single d20 check set up from the sheet', () => {
    const { result } = renderHook(() => useDiceRoller(fixedRng([7, 15], 20)));
    act(() => {
      result.current.setMode('advantage');
      result.current.setupCheck('Athletics', 6);
    });
    act(() => result.current.roll());
    const { dice, total } = result.current.latest.result;
    expect(dice).toEqual([{ sides: 20, value: 7, kept: false }, { sides: 20, value: 15, kept: true }]);
    expect(total).toBe(21);
    expect(result.current.latest.label).toBe('Athletics');
  });

  it('clears the shown result when the dice on the board change', () => {
    const { result } = renderHook(() => useDiceRoller(fixedRng([4], 6)));
    act(() => result.current.addDie(6));
    act(() => result.current.roll());
    expect(result.current.latest).not.toBeNull();
    act(() => result.current.addDie(8));
    expect(result.current.latest).toBeNull();
    expect(result.current.pool).toEqual([6, 8]);
  });
});

describe('DiceTray', () => {
  it('adds dice by tapping, removes one by clicking it, and rolls', async () => {
    const user = userEvent.setup();
    render(<Harness rng={fixedRng([2], 4)} />);
    expect(screen.getByRole('button', { name: 'Roll' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Add a d4 to the board' }));
    await user.click(screen.getByRole('button', { name: 'Add a d4 to the board' }));
    await user.click(screen.getByRole('button', { name: 'Add a d8 to the board' }));
    expect(screen.getAllByRole('button', { name: /^Remove d/ })).toHaveLength(3);

    await user.click(screen.getByRole('button', { name: 'Remove d8' }));
    await user.click(screen.getByRole('button', { name: 'Roll' }));
    expect(screen.getByLabelText('Total 4')).toBeInTheDocument();
  });

  it('adds a die dragged onto the felt, but not one dropped elsewhere', () => {
    render(<Harness />);
    const board = screen.getByText(/Drag dice onto the felt/).parentElement;
    board.getBoundingClientRect = () => ({ left: 0, top: 0, right: 200, bottom: 200 });
    const d6 = screen.getByRole('button', { name: 'Add a d6 to the board' });

    // Dropped outside the board
    fireEvent.pointerDown(d6, { button: 0, clientX: 500, clientY: 500, pointerId: 1 });
    fireEvent.pointerMove(d6, { clientX: 450, clientY: 450, pointerId: 1 });
    fireEvent.pointerUp(d6, { clientX: 450, clientY: 450, pointerId: 1 });
    expect(roller.pool).toEqual([]);

    // Dragged onto the board
    fireEvent.pointerDown(d6, { button: 0, clientX: 500, clientY: 500, pointerId: 1 });
    fireEvent.pointerMove(d6, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(d6, { clientX: 100, clientY: 100, pointerId: 1 });
    expect(roller.pool).toEqual([6]);
  });

  it('can be used from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Harness rng={fixedRng([12], 20)} />);
    screen.getByRole('button', { name: 'Add a d20 to the board' }).focus();
    await user.keyboard('{Enter}');
    expect(roller.pool).toEqual([20]);
    screen.getByRole('button', { name: 'Roll' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByLabelText('Total 12')).toBeInTheDocument();
  });
});
