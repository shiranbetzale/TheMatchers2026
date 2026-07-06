const toFirebasePhoneNumber = value => {
  const digits = String(value || '').replace(/\D/g, '');

  if (digits.startsWith('972')) {
    return `+${digits}`;
  }

  if (digits.startsWith('0')) {
    return `+972${digits.slice(1)}`;
  }

  return `+${digits}`;
};

module.exports = {
  toFirebasePhoneNumber,
};
