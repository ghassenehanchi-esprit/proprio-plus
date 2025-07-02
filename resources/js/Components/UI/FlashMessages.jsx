import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import sweetAlert from '../../libs/sweetalert';

export default function FlashMessages() {
  const { flash = {} } = usePage().props;

  useEffect(() => {
    if (flash.success) {
      sweetAlert(flash.success, 'success');
    } else if (flash.error) {
      sweetAlert(flash.error, 'error');
    }
  }, [flash.success, flash.error]);

  return null;
}
