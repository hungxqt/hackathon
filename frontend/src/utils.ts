export type FormatCase = 'uppercase' | 'lowercase' | 'titlecase';

export function formatMessage(msg: string, format: FormatCase): string {
  switch (format) {
    case 'uppercase':
      return msg.toUpperCase();
    case 'lowercase':
      return msg.toLowerCase();
    case 'titlecase':
      return msg
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    default:
      return msg;
  }
}
