/**
 * WebsiteTracker — mounts once in the root layout and records a first-party
 * `page_view` on initial load and on every Next.js App Router navigation.
 *
 * - Dedupes consecutive identical paths so client-side navigation does not
 *   create duplicate page-view events.
 * - Course detail pages (/courses/<slug>) additionally send a `course_view`
 *   with the slug as courseId.
 * - Does nothing when analytics consent is withheld (handled inside track()).
 * - Renders no DOM and never blocks rendering.
 */
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/tracker';

export default function WebsiteTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Dedupe: skip if the path has not actually changed.
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    track('page_view', pathname);

    // Course detail pages: also emit a course_view keyed by the slug.
    const courseMatch = pathname.match(/^\/courses\/([^/]+)\/?$/);
    if (courseMatch) {
      track('course_view', pathname, { courseId: courseMatch[1] });
    }
  }, [pathname]);

  return null;
}
