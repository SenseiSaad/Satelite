import { ImageResponse } from 'next/og';

import { site } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${site.name}: satellite based crop risk indices`;

/**
 * Static Open Graph image.
 *
 * Rendered with the font bundled inside next/og so the build never depends on
 * an external font host. Swap this file for a designed PNG if you prefer full
 * control over the type.
 */
export default function OpengraphImage() {
  let host = site.url;
  try {
    host = new URL(site.url).host;
  } catch {
    host = site.url;
  }

  const ink = '#0b1613';
  const muted = '#56605b';
  const green = '#1f5e4a';
  const lime = '#a8c24a';
  const blue = '#3f74e8';
  const rule = '#d9ded5';
  const paper = '#fafaf7';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: paper,
        color: ink,
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
      }}
    >
      {/* top row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 22,
                height: 6,
                borderRadius: 3,
                backgroundColor: lime,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 30,
              letterSpacing: 6,
              color: ink,
            }}
          >
            NORTHGATE
          </div>
        </div>
        <div style={{ fontSize: 26, color: muted }}>{host}</div>
      </div>

      {/* headline block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 5,
            color: green,
            textTransform: 'uppercase',
          }}
        >
          Satellite based crop risk indices
        </div>
        <div
          style={{
            fontSize: 92,
            lineHeight: 1.02,
            maxWidth: 980,
            color: ink,
          }}
        >
          Field level risk, priced before the season turns.
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
          {[
            { w: 180, c: green },
            { w: 120, c: lime },
            { w: 240, c: blue },
            { w: 90, c: rule },
          ].map((bar) => (
            <div
              key={bar.c}
              style={{
                width: bar.w,
                height: 14,
                borderRadius: 7,
                backgroundColor: bar.c,
              }}
            />
          ))}
        </div>
      </div>

      {/* bottom row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `2px solid ${rule}`,
          paddingTop: 24,
        }}
      >
        <div style={{ fontSize: 26, color: muted }}>{site.tagline}</div>
        <div style={{ fontSize: 26, color: ink }}>Early access</div>
      </div>
    </div>,
    { ...size },
  );
}
