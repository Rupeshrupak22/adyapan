import type { Metadata } from 'next';
import { ALL_PROGRAMS, findCourse } from '@/lib/courseData';
import { buildMetadata, courseSchema, breadcrumbSchema, BASE_URL } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import CoursePageClient from './CoursePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// â"€â"€ Static params for build-time generation â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export function generateStaticParams() {
  return ALL_PROGRAMS.map((course) => ({ slug: course.slug }));
}

// â"€â"€ Dynamic metadata per course â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = findCourse(slug);

  if (!course) {
    // Fallback for dynamically generated courses not in ALL_PROGRAMS
    const title = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return buildMetadata({
      title: `${title} Course - Live Classes & Placement Support`,
      description: `Master ${title} with Adyapan's live online course. Industry mentors, real projects, and placement support. Enroll for Rs. 3,000.`,
      path: `/courses/${slug}`,
      ogType: 'article',
    });
  }

  const t = course.title.toLowerCase();
  return buildMetadata({
    title: `${course.title} Course Online - Live Classes & Placement Support | Adyapan`,
    description: `Learn ${course.title} online with Adyapan. ${course.description || `Master ${course.title} with hands-on projects.`} Live classes, industry mentors, certification, and placement support. Enroll for ${course.price || 'Rs. 3,000'}.`,
    keywords: [
      t,
      `${t} course`,
      `${t} course online`,
      `${t} online course`,
      `${t} course in india`,
      `${t} training`,
      `${t} course with placement`,
      `${t} course fees`,
      `learn ${t}`,
      `best ${t} course`,
      `${t} certification`,
      (course.category || 'adyapan programs').toLowerCase(),
      'adyapan course', 'placement support', 'live classes', 'online course india',
    ],
    path: `/courses/${slug}`,
    ogImage: course.thumbnail ? `${BASE_URL}${course.thumbnail}` : undefined,
    ogType: 'article',
  });
}

// â"€â"€ Page component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = findCourse(slug);

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Programs', url: `${BASE_URL}/programs` },
    ...(course ? [{ name: course.category, url: `${BASE_URL}/programs` }] : []),
    {
      name: course ? `${course.title} Course` : slug,
      url: `${BASE_URL}/courses/${slug}`,
    },
  ]);

  const schema = course
    ? courseSchema({
        name: `${course.title} Course`,
        description: course.description || `Master ${course.title} with Adyapan.`,
        url: `${BASE_URL}/courses/${slug}`,
        image: course.thumbnail ? `${BASE_URL}${course.thumbnail}` : BASE_URL,
        duration: 'P2M',
        price: '3000',
        category: course.category || 'Adyapan Programs',
      })
    : null;

  return (
    <>
      <JsonLd schema={breadcrumb} />
      {schema && <JsonLd schema={schema} />}
      <CoursePageClient />
    </>
  );
}
