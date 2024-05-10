import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

import { useOnClickOutside, useWindowScroll, useWindowResize } from '@/utils';

import styles from './Select.module.scss';

type RoundedType = 'full' | 'small';
type BorderType = 'solid' | 'none';
type BgColorType = 'primary' | 'secondary' | 'blue' | 'red' | 'white' | 'dark';

export interface ISelectProps {
  value?: string | null;
  updateValue?: (e: string) => void;
  placeholder?: string;
  options?: (string | { _id?: string; name: string; value: string })[];
  rounded?: RoundedType;
  border?: BorderType;
  bgcolor?: BgColorType;
  className?: string;
  disabled?: boolean;
  colorable?: boolean;
  colors?: { status: string; color: string }[];
}

export function Select({
  value = '',
  updateValue = () => { },
  placeholder = 'Select',
  options = [],
  rounded = 'small',
  border = 'solid',
  bgcolor = 'white',
  className = '',
  disabled = false,
  colorable = false,
  colors = [],
}: ISelectProps) {
  const [anchor, setAnchor] = useState<boolean>(false);
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    width?: number;
    height?: number;
  }>({
    left: 0,
    top: 0,
  });
  const currentName = useMemo(() => {
    if (disabled) return placeholder;
    const currentOption = options.find(item =>
      typeof item === 'object'
        ? item.value.toLowerCase() === value?.toLowerCase()
        : item.toLowerCase() === value?.toLowerCase(),
    );
    return !currentOption
      ? placeholder
      : typeof currentOption === 'object'
        ? currentOption.name
        : currentOption;
  }, [value]);

  const selectRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const colorClasses = () => {
    const currentColor = colors.find(
      (color: { status: string; color: string }) => color.status === value,
    );
    if (!currentColor) return {};
    return clsx([styles.colorable], {
      [styles.successSelectBox]: currentColor.color === 'success',
      [styles.warningSelectBox]: currentColor.color === 'warning',
      [styles.lightSelectBox]: currentColor.color === 'light',
      [styles.graySelectBox]: currentColor.color === 'gray',
    });
  };

  const classes = clsx(
    styles.root,
    rounded === 'full' ? styles.roundedFull : '',
    border === 'none' ? styles.borderNone : '',
    bgcolor === 'primary'
      ? styles.bgColorPrimary
      : bgcolor === 'secondary'
        ? styles.bgColorSecondary
        : bgcolor === 'blue'
          ? styles.bgColorBlue
          : bgcolor === 'red'
            ? styles.bgColorRed
            : bgcolor === 'dark'
              ? styles.bgColorDark
              : colorable === true
                ? colorClasses()
                : '',
    className,
  );

  const onSelectOption = (option: string) => {
    if (disabled) return;
    updateValue(option);
    setAnchor(false);
  };

  const onPositionFix = () => {
    if (!boxRef.current) return;
    const { left, top, width, height } = boxRef.current.getBoundingClientRect();
    setPosition({ left, top: top + height, width, height });
  };

  const onSelectBoxClick = () => {
    if (disabled) return;
    onPositionFix();
    setAnchor(!anchor);
  };

  useOnClickOutside(selectRef, () => setAnchor(false), 'mousedown');
  useWindowScroll(onPositionFix);
  useWindowResize(onPositionFix);

  useEffect(() => {
    onPositionFix();
  }, []);

  return (
    <div className={classes} ref={selectRef}>
      <div className={styles.selectBox} onClick={onSelectBoxClick} ref={boxRef}>
        <span className={clsx({ [styles.placeholder]: !value || disabled })}>
          {currentName}
        </span>
        {anchor ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {anchor && !disabled && options.length > 0 && (
        <div
          className={styles.viewBox}
          style={{
            width: (boxRef.current && boxRef.current.clientWidth) || 150,
            left: position.left,
            top: position.top,
          }}
        >
          {options.map(
            (
              option: string | { _id?: string; name: string; value: string },
              index: number,
            ) => (
              <span
                key={index}
                onClick={() =>
                  onSelectOption(
                    typeof option === 'object' ? option.value : option,
                  )
                }
                className={
                  option === value || (option as any).value === value
                    ? styles.activeItem
                    : ''
                }
              >
                {typeof option === 'object' ? option.name : option}
              </span>
            ),
          )}
        </div>
      )}
    </div>
  );
}
