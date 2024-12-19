export function toPrismaDate(date: Date | number) {
	const resolved = typeof date === 'number' ? new Date(date) : date;

	const datePart = [resolved.getFullYear(), resolved.getMonth() + 1, resolved.getDate()]
		.map((n, i) => n.toString().padStart(i === 0 ? 4 : 2, '0'))
		.join('-');
	const timePart = [resolved.getHours(), resolved.getMinutes(), resolved.getSeconds()].map((n) => n.toString().padStart(2, '0')).join(':');
	return `${datePart} ${timePart}`;
}
