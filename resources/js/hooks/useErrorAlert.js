import { useEffect } from 'react';
import sweetAlert from '../libs/sweetalert';

export default function useErrorAlert(errors = {}) {
  useEffect(() => {
    const msgs = Object.values(errors).filter(Boolean);
    if (msgs.length > 0) {
      sweetAlert(msgs[0], 'error');
    }
  }, [JSON.stringify(errors)]);
}
