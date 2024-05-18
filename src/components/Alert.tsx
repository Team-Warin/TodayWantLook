'use client';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import style from '@/styles/Alert.module.css';

import { useAlert } from './context/Alert-Context';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import { useEffect } from 'react';

export default function Alert() {
  const { status, isShow, message, close } = useAlert();

  const statusInfo: { [key: string]: { color: string; icon: IconDefinition } } =
    {
      success: { color: style.success, icon: faCheck },
      warning: { color: style.warning, icon: faTriangleExclamation },
      error: { color: style.error, icon: faBug },
    };

  useEffect(() => {
    const TimeOut = setTimeout(close, 3000);

    return () => {
      clearTimeout(TimeOut);
    };
  }, [close, isShow]);

  if (!isShow) return <></>;

  return (
    <div className={`${style.alert} ${statusInfo[status!].color}`}>
      <FontAwesomeIcon icon={statusInfo[status!].icon} />
      <p>{message}</p>
    </div>
  );
}
