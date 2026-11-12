import React, {
  useCallback,
  useState,
} from 'react';
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

  it('should never show a value the ESCs do not have', async() => {
    // Common value 40 in the app, ESCs out of sync: as in CommonSettings, a
    // moved slider sets the common value of all ESCs, which are then in sync
    function App() {
      const [state, setState] = useState({
        inSync: false,
        value: 40,
      });

      const handleChange = useCallback((name, value) => setState({
        inSync: true,
        value,
      }), []);

      const handleWrite = useCallback(() => setState((current) => ({
        ...current,
        inSync: true,
      })), []);

      return (
        <>
          <Slider
            inSync={state.inSync}
            label="test"
            max={255}
            min={0}
            name="test"
            onChange={handleChange}
            value={state.value}
          />

          <button
            onClick={handleWrite}
            type="button"
          >
            write
          </button>

          <span data-testid="esc-value">
            {state.value}
          </span>
        </>
      );
    }

    render(<App />);

    const slider = screen.getByRole('slider');
    for(let i = 0; i < 5; i += 1) {
      fireEvent.keyDown(slider, { keyCode: 39 });
      fireEvent.keyUp(slider, { keyCode: 39 });
    }
    await act(() => new Promise((r) => setTimeout(r, 150)));

    // The ESCs are written and in sync again: the slider shows their value
    fireEvent.click(screen.getByRole('button', { name: 'write' }));
    const escValue = screen.getByTestId('esc-value').textContent;
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', escValue);
  });
});
