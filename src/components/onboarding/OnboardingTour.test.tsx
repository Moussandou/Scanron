// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { I18nProvider } from '../../lib/i18n/I18nContext';
import { OnboardingTour, type TourStep } from './OnboardingTour';

const steps: TourStep[] = [
  { anchor: 'add-code', title: 'Step one', body: 'First body' },
  { anchor: 'scan', title: 'Step two', body: 'Second body' },
];

function renderTour(step: number, onNext = vi.fn(), onSkip = vi.fn()) {
  render(
    <I18nProvider>
      <OnboardingTour steps={steps} step={step} onNext={onNext} onSkip={onSkip} />
    </I18nProvider>,
  );
  return { onNext, onSkip };
}

afterEach(cleanup);

describe('OnboardingTour', () => {
  it('renders the current step content and a Next button', () => {
    renderTour(0);
    expect(screen.getByText('Step one')).toBeDefined();
    expect(screen.getByText('First body')).toBeDefined();
    expect(screen.getByText('1 / 2')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDefined();
  });

  it('shows the finish label on the last step', () => {
    renderTour(1);
    expect(screen.getByText('Step two')).toBeDefined();
    expect(screen.getByRole('button', { name: /got it/i })).toBeDefined();
  });

  it('fires onNext and onSkip', () => {
    const { onNext, onSkip } = renderTour(0);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(onNext).toHaveBeenCalled();
    expect(onSkip).toHaveBeenCalled();
  });
});
