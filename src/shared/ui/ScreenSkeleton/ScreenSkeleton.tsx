'use client';

import './ScreenSkeleton.css';

export function ScreenSkeleton() {
  return (
    <div className="screen-skeleton" aria-hidden="true">
      <div className="screen-skeleton__block screen-skeleton__block--hero" />
      <div className="screen-skeleton__section">
        <div className="screen-skeleton__line screen-skeleton__line--title" />
        <div className="screen-skeleton__line" />
        <div className="screen-skeleton__line screen-skeleton__line--short" />
      </div>
      <div className="screen-skeleton__section">
        <div className="screen-skeleton__line screen-skeleton__line--title" />
        <div className="screen-skeleton__line" />
        <div className="screen-skeleton__line" />
      </div>
    </div>
  );
}

export default ScreenSkeleton;