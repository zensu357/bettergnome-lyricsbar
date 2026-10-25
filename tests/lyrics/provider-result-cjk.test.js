import { describe, expect, it } from 'vitest';
import { parseBestSyncedLrclibSearchResponse } from '../../src/domain/lyrics/provider-result.js';

describe('parseBestSyncedLrclibSearchResponse (CJK)', () => {
  const lrclibResults = [
    {
      id: 1,
      trackName: '碎碎念',
      artistName: '队长',
      albumName: '碎碎念',
      duration: 132,
      syncedLyrics: '[00:10.00]所以別再問那麼多問題\n[00:14.00]回憶全部都被你給佔據',
      plainLyrics: 'x',
    },
    {
      id: 2,
      trackName: '碎碎念',
      artistName: '队长',
      albumName: '碎碎念',
      duration: 212,
      syncedLyrics: '[00:10.00]另一版本',
      plainLyrics: 'x',
    },
    {
      id: 3,
      trackName: '碎碎念',
      artistName: '队长',
      albumName: 'talking - ep',
      duration: 133,
      syncedLyrics: '[00:10.00]EP版本歌詞',
      plainLyrics: 'x',
    },
  ];

  it('keeps CJK titles/artists comparable and prefers the closest duration', () => {
    const result = parseBestSyncedLrclibSearchResponse(lrclibResults, {
      artist: '队长',
      title: '碎碎念',
      album: '碎碎念 - Single',
      durationMs: 133000,
    });
    expect(result?.kind).toBe('synced');
    if (result?.kind === 'synced') {
      expect(result.track.durationMs).toBe(133000);
      expect(result.lines[0].text).toBe('EP版本歌詞');
    }
  });

  it('matches a CJK query against CJK candidates with a moderate duration gap', () => {
    const result = parseBestSyncedLrclibSearchResponse(lrclibResults, {
      artist: '队长',
      title: '碎碎念',
      album: '碎碎念',
      durationMs: 235000,
    });
    expect(result?.kind).toBe('synced');
    if (result?.kind === 'synced') {
      expect(result.track.durationMs).toBe(212000);
    }
  });

  it('still scores latin titles the same way as before', () => {
    const result = parseBestSyncedLrclibSearchResponse(
      [
        {
          trackName: 'Café',
          artistName: 'Chino & hollow',
          albumName: 'x',
          duration: 200,
          syncedLyrics: '[00:01.00]a',
        },
      ],
      { artist: 'Chino & hollow', title: 'Café', album: 'x', durationMs: 200000 },
    );
    expect(result?.kind).toBe('synced');
  });
});
