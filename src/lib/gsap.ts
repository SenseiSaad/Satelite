/**
 * Shared GSAP loader.
 *
 * GSAP, ScrollTrigger and Lenis are only pulled in on the client, after
 * hydration, so the first paint stays small. Every consumer shares one module
 * instance and one registration of the plugin.
 */

type GsapModule = typeof import('gsap');
type ScrollTriggerModule = typeof import('gsap/ScrollTrigger');

export interface GsapBundle {
  gsap: GsapModule['gsap'];
  ScrollTrigger: ScrollTriggerModule['ScrollTrigger'];
}

let bundle: Promise<GsapBundle> | null = null;

export function loadGsap(): Promise<GsapBundle> {
  if (!bundle) {
    bundle = (async (): Promise<GsapBundle> => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    })();
  }
  return bundle;
}
