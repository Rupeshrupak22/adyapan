
import { test, expect } from '@playwright/test';

test('Adyapan.com full basic QA', async ({ page }) => {
  const jsErrors: string[] = [];
  const failedRequests: string[] = [];
  const httpErrors: string[] = [];

  page.on('pageerror', error => jsErrors.push(error.message));

  page.on('requestfailed', request => {
    failedRequests.push(
      `${request.method()} ${request.url()} - ${
        request.failure()?.errorText || 'Failed'
      }`
    );
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      httpErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  // 1. Homepage
  const start = Date.now();
  const response = await page.goto('https://adyapan.com/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  const navigationMs = Date.now() - start;

  expect(response).not.toBeNull();
  expect(response!.status()).toBeLessThan(400);
  await expect(page.locator('body')).toBeVisible();

  const title = await page.title();
  expect(title.trim()).not.toBe('');

  // 2. Images
  await page.waitForTimeout(2000);

  const brokenImages = await page.locator('img').evaluateAll(images =>
    images
      .filter(img => img.complete &&
        (img.naturalWidth === 0 || img.naturalHeight === 0))
      .map(img => img.currentSrc || img.src)
  );

  // 3. Links
  const links = await page.locator('a[href]').evaluateAll(anchors =>
    anchors.map(a => ({
      text: (a.textContent || '').trim().slice(0, 80),
      href: (a as HTMLAnchorElement).href,
    }))
  );

  // 4. Forms: inspect only, never submit
  const forms = await page.locator('form').evaluateAll(items =>
    items.map(form => ({
      method: form.getAttribute('method') || 'get',
      fields: Array.from(
        form.querySelectorAll('input, select, textarea')
      ).map(field => ({
        name: (field as HTMLInputElement).name,
        type: (field as HTMLInputElement).type,
        required: (field as HTMLInputElement).required,
        hasLabel: Boolean(
          (field as HTMLInputElement).labels?.length ||
          field.getAttribute('aria-label')
        ),
      })),
    }))
  );

  // 5. Desktop, tablet and mobile layout
  const layouts = [];

  for (const viewport of [
    { name: 'Desktop', width: 1365, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 390, height: 844 },
  ]) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    const layout = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      pageHeight: document.documentElement.scrollHeight,
    }));

    layouts.push({
      device: viewport.name,
      ...layout,
      overflow: layout.pageWidth > layout.viewportWidth + 1,
    });
  }

  // 6. Basic browser performance timings
  const performanceData = await page.evaluate(() => {
    const nav = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming | undefined;

    return {
      domContentLoadedMs: nav
        ? Math.round(nav.domContentLoadedEventEnd)
        : null,
      loadEventMs: nav && nav.loadEventEnd > 0
        ? Math.round(nav.loadEventEnd)
        : null,
      resourceCount: performance.getEntriesByType('resource').length,
    };
  });

  // 7. Print all results
  const report = {
    website: page.url(),
    title,
    homepageStatus: response!.status(),
    navigationMs,
    linkCount: links.length,
    forms,
    brokenImages,
    layouts,
    jsErrors,
    failedRequests,
    httpErrors,
    performanceData,
  };

  console.log('\n===== ADYAPAN QA REPORT =====');
  console.log(JSON.stringify(report, null, 2));

  await test.info().attach('adyapan-qa-report.json', {
    body: Buffer.from(JSON.stringify(report, null, 2)),
    contentType: 'application/json',
  });

  // Fail on important basic checks
  expect(brokenImages, 'Broken images found').toEqual([]);
  expect(
    layouts.filter(item => item.overflow),
    'Horizontal overflow found'
  ).toEqual([]);
  expect(jsErrors, 'JavaScript errors found').toEqual([]);
});
