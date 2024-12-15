export default function toEmailLink(email: string | null, subject?: string, body?: string) {
    return `mailto:${email || ''}${subject ? `?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}` : ''}`;
}
