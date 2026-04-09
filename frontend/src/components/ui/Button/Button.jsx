import styles from './Button.module.scss';

export const Button = ({
  children,
  type = 'button',
  variant = 'secondary',
  isActive = false,
  disabled = false,
  onClick,
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    isActive ? styles.active : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      data-active={isActive ? 'true' : 'false'}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};
