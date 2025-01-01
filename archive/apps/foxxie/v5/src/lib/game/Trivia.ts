import { fetch } from '@foxxie/fetch';

export async function fetchData(category: number, type: string, difficulty: string) {
    return fetch(`https://opentdb.com/api.php`) //
        .query('amount', '1')
        .query('category', category.toString())
        .query('difficulty', difficulty)
        .query('type', type)
        .json<TriviaResponse>();
}

export interface TriviaResponse {
    response_code: 0 | 1 | 2 | 3 | 4;
    results: TriviaResult[];
}

export interface TriviaResult {
    category: string;
    type: 'boolean' | 'multiple';
    difficulty: QuestionDifficulty;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export const enum TriviaType {
    Boolean = 'boolean',
    Multiple = 'multiple'
}

export const enum QuestionDifficulty {
    Easy = 'easy',
    Medium = 'medium',
    Hard = 'hard'
}

export const categories = {
    general: 9,
    books: 10,
    film: 11,
    music: 12,
    theatres: 13,
    tv: 14,
    videogames: 15,
    boardgames: 16,
    nature: 17,
    computers: 18,
    maths: 19,
    mythology: 20,
    sports: 21,
    geography: 22,
    history: 23,
    politics: 24,
    art: 25,
    celebrities: 26,
    animals: 27,
    vehicles: 28,
    comics: 29,
    gadgets: 30,
    manga: 31,
    cartoon: 32
};
