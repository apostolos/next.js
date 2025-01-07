import { noop as css } from '../../../helpers/noop-template'

const styles = css`
  .error-overlay-pagination {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: var(--size-1);
    gap: var(--size-2);
    background: var(--color-background-100);
    box-shadow: var(--shadow-sm);

    border: 1px solid var(--color-gray-400);
    border-radius: var(--rounded-full);
  }

  .error-overlay-pagination-count {
    color: var(--color-gray-900);
    text-align: center;
    font-size: var(--size-font-small);
    font-weight: 500;
    line-height: var(--size-4);
  }

  .error-overlay-pagination-button {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: var(--size-1);
    background: var(--color-gray-300);

    border: none;
    border-radius: var(--rounded-full);

    &:focus {
      outline: none;
    }

    &:not(:disabled):active {
      background: var(--color-gray-500);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .error-overlay-pagination-button-icon {
    color: var(--color-gray-1000);
  }
`

export { styles }
