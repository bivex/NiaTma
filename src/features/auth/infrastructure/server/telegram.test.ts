import { createHmac } from 'node:crypto';
import { describe, expect, test } from 'bun:test';

import { verifyTelegramInitData } from './telegram';

function createTelegramHash(raw: string, botToken: string) {
  const params = new URLSearchParams(raw);
  const dataCheckString = [...params.entries()]
    .filter(([key]) => key !== 'hash')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();

  return createHmac('sha256', secret).update(dataCheckString).digest('hex');
}

describe('telegram auth verification', () => {
  test('verifies valid Telegram init data', () => {
    const botToken = '123456:ABCDEF';
    const params = new URLSearchParams({
      auth_date: '1710000000',
      query_id: 'AAHdF6IQAAAAAN0XohDhrOrc',
      user: JSON.stringify({ id: 42, first_name: 'Nia', username: 'nia' }),
    });

    params.set('hash', createTelegramHash(params.toString(), botToken));

    expect(
      verifyTelegramInitData(params.toString(), botToken, {
        nowMs: 1710000000 * 1000,
      }),
    ).toEqual({
      ok: true,
      data: {
        authDate: 1710000000,
        user: {
          id: '42',
          firstName: 'Nia',
          lastName: undefined,
          username: 'nia',
          languageCode: undefined,
        },
      },
    });
  });

  test('rejects invalid hashes', () => {
    expect(
      verifyTelegramInitData(
        'auth_date=1710000000&user=%7B%22id%22%3A1%7D&hash=deadbeef',
        '123456:ABCDEF',
        { nowMs: 1710000000 * 1000 },
      ),
    ).toEqual({ ok: false, reason: 'invalid_hash' });
  });
});