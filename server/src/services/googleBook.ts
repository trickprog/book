import Fuse from 'fuse.js';
import { config } from '../config';
import { GoogleRating, VolumeInfo, VolumesResponse } from './types';

const MAX_TRIES = 10;

function pickRating(data: VolumesResponse, title: string, author: string) {
    let best: GoogleRating | null = null;

    const rated = (data.items ?? [])
        .map((item) => item.volumeInfo)
        .filter(
            (info): info is VolumeInfo =>
                typeof info?.averageRating === 'number' && (info.ratingsCount ?? 0) > 0,
        );
    console.log('Rated items from Google Books API:', rated);
    if (!rated.length) return null;

    const fuse = new Fuse(rated, {
        keys: [
            { name: 'title', weight: 0.7 },
            { name: 'authors', weight: 0.7 },
        ],
        threshold: 0.8,
        ignoreLocation: true,
    });

    const matches = fuse.search({
        $and: [{ title }, ...(author ? [{ authors: author }] : [])],
    });


    for (const { item } of matches) {
        const count = item.ratingsCount ?? 0;
        if (!best || count > best.count) best = { average: Number(item.averageRating), count };
    }

    return best;
}


export async function getRating(
    title: string,
    author: string,
) {
    const url = new URL(config.googleBooksUrl);

    url.searchParams.set('q', `intitle:${title} inauthor:${author}`);
    url.searchParams.set(
        'fields',
        'items(volumeInfo(title,industryIdentifiers,averageRating,ratingsCount,authors))',
    );
        url.searchParams.set(
        'printType',
        'books',
    );
         url.searchParams.set(
        'maxResults',
        '20',
    );
    if (config.googleBookApiKey) url.searchParams.set('key', config.googleBookApiKey);

    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
            if (response.status === 503) continue;
            if (!response.ok) return null;

            const data = await response.json()
            console.log('Google Books API response:', data);
            const result = pickRating(data, title, author)

            return result;
        } catch {
            return null;
        }
    }

    return null;
}
