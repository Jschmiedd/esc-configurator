import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';

import Number from '../';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));

describe('Number', () => {
  it('should display a num', () => {
    const onChange = jest.fn();

    render(
      <Number
        label="test"
        name="test"
        onChange={onChange}
      />
    );

    expect(screen.getByText(/test/i)).toBeInTheDocument();

    fireEvent.change(screen.getByRole(/spinbutton/i), {
      target: {
        value: 1250,
        name: 'test',
      },
    });
    fireEvent.blur(screen.getByRole(/spinbutton/i));

    fireEvent.change(screen.getByRole(/spinbutton/i), {
      target: {
        value: -10,
        name: 'test',
      },
    });
    fireEvent.blur(screen.getByRole(/spinbutton/i));

    fireEvent.change(screen.getByRole(/spinbutton/i), {
      target: {
        value: 'Nan',
        name: 'test',
      },
    });
    fireEvent.blur(screen.getByRole(/spinbutton/i));
  });

  it('should handle out of sync', () => {
    const onChange = jest.fn();

    render(
      <Number
        inSync={false}
        label="test"
        name="test"
        onChange={onChange}
      />
    );

    expect(screen.getByText(/test/i)).toBeInTheDocument();

    fireEvent.change(screen.getByRole(/spinbutton/i), {
      target: {
        value: 1250,
        name: 'test',
      },
    });
    fireEvent.blur(screen.getByRole(/spinbutton/i));

    fireEvent.change(screen.getByRole(/spinbutton/i), {
      target: {
        value: -10,
        name: 'test',
      },
    });
    fireEvent.blur(screen.getByRole(/spinbutton/i));

    fireEvent.change(screen.getByRole(/spinbutton/i), {
      target: {
        value: 'Nan',
        name: 'test',
      },
    });
    fireEvent.blur(screen.getByRole(/spinbutton/i));
  });

  it('should show a value that arrives after it is displayed', () => {
    const onChange = jest.fn();

    // While the ESCs are read, the field is shown before the settings arrive
    const { rerender } = render(
      <Number
        label="test"
        name="test"
        onChange={onChange}
        value={0}
      />
    );

    rerender(
      <Number
        label="test"
        name="test"
        onChange={onChange}
        value={39}
      />
    );

    expect(screen.getByRole(/spinbutton/i)).toHaveValue(39);
  });

  it('should show a whole number when the display factor is not', () => {
    const onChange = jest.fn();

    // Bluejay "Startup power min": raw 51 is shown as 1025 by the slider
    render(
      <Number
        factor={1000 / 2047}
        label="test"
        max={1125}
        min={1000}
        name="test"
        offset={1000}
        onChange={onChange}
        value={51}
      />
    );

    expect(screen.getByRole(/spinbutton/i)).toHaveValue(1025);

    fireEvent.change(screen.getByRole(/spinbutton/i), {
      target: {
        value: 1025,
        name: 'test',
      },
    });
    fireEvent.blur(screen.getByRole(/spinbutton/i));

    expect(onChange).toHaveBeenCalledWith('test', 51);
    expect(screen.getByRole(/spinbutton/i)).toHaveValue(1025);
  });
});
