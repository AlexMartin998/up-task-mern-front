'use strict';

import { useState } from 'react';

export const useAlert = alertData => {
  const [alerta, setAlerta] = useState(alertData);

  return [alerta, setAlerta];
};
