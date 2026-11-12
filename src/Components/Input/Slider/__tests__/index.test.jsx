import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import Slider from '../';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));

describe('Slider', () => {
  it('should display the slider', () => {
    const onChange = jest.fn();

    render(
      <Slider
        label="test"
        name="test"
        onChange={onChange}
      />
    );

    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });

  it('should display out of sync slider', () => {
    const onChange = jest.fn();

    render(
      <Slider
        inSync={false}
        label="test"
        name="test"
        onChange={onChange}
      />
    );

    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });

  it('should let an out of sync slider be moved and write the value shown', async() => {
    const onChange = jest.fn();

    // ESCs with different values: the slider shows its minimum
    render(
      <Slider
        inSync={false}
        label="test"
        max={255}
        min={0}
        name="test"
        onChange={onChange}
        value={40}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '0');

    // The user moves the slider one step to the right
    fireEvent.keyDown(slider, { keyCode: 39 });
    fireEvent.keyUp(slider, { keyCode: 39 });

    // The value written is the one shown
    await act(() => new Promise((r) => setTimeout(r, 150)));
    expect(onChange).toHaveBeenCalledWith('test', 1);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '1');
  });
});
