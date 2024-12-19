export function toStarboardStatsEmoji(stars: number) {
	if (stars === 0) return '';
	if (stars < 20) return '⭐';
	if (stars < 50) return '🌟';
	if (stars < 100) return '💫';
	if (stars < 250) return '✨';
	if (stars < 500) return '🌠';
	return '🌌';
}
