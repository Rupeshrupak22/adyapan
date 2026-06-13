/**
 * GET /api/user/dashboard
 * Returns: user info + enrolled courses + progress for each.
 * Auth: JWT cookie (authToken)
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRoute } from '@/lib/auth';
import AuthUser from '@/models/AuthUser';
import Enrollment from '@/models/Enrollment';
import Progress from '@/models/Progress';
import Course from '@/models/Course';
import Certificate from '@/models/Certificate';
import StudentLMSAccess from '@/models/StudentLMSAccess';
import { COURSE_CATALOGUE, withTotalLessons } from '@/lib/courseData';

export async function GET(req: NextRequest) {
  const auth = protectRoute(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    /* â”€â”€ Auth â”€â”€ */
    const user = await AuthUser.findById(auth.userId).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    /* â”€â”€ Enrollments â”€â”€ */
    const enrollments = await Enrollment.find({ userId: auth.userId }).lean();
    const lmsAccess = await StudentLMSAccess.findOne({ userId: auth.userId }).lean();

    /* â”€â”€ Progress for each enrollment â”€â”€ */
    const dashboardCourses = await Promise.all(
      enrollments.map(async (enr) => {
        /* Get or auto-seed course */
        let course = await Course.findOne({ slug: enr.courseSlug }).lean();
        if (!course) {
          const raw = COURSE_CATALOGUE.find(c => c.slug === enr.courseSlug);
          if (raw) {
            const data = withTotalLessons(raw);
            course = await Course.findOneAndUpdate(
              { slug: data.slug }, { $set: data }, { upsert: true, new: true }
            ).lean();
          }
        }

        /* Get or init progress */
        let progress = await Progress.findOne({
          userId: auth.userId,
          courseSlug: enr.courseSlug,
        }).lean();

        if (!progress) {
          const totalLessons = course?.totalLessons ?? 0;
          progress = await Progress.create({
            userId:           auth.userId,
            courseSlug:       enr.courseSlug,
            completedLessons: [],
            progressPercent:  0,
            totalLessons,
          });
        }

        const progressPercent = (progress as any).progressPercent ?? 0;
        const isComplete = progressPercent === 100;

        /* Get certificate if course is complete */
        let certificateData = null;
        if (isComplete) {
          const cert = await Certificate.findOne({
            userId: auth.userId,
            courseSlug: enr.courseSlug,
          }).lean();

          if (cert) {
            certificateData = {
              certificateId: (cert as any).certificateId,
              studentName:   (cert as any).studentName,
              courseName:    (cert as any).courseName,
              issuedAt:      (cert as any).issuedAt,
              status:        (cert as any).status,
              downloadUrl:   `/api/certificates/${enr.courseSlug}/download`,
            };
          }
        }

        return {
          enrollment: {
            id:         enr._id.toString(),
            courseSlug: enr.courseSlug,
            courseName: enr.courseName,
            planLabel:  enr.planLabel,
            amountPaid: enr.amountPaid,
            enrolledAt: enr.enrolledAt,
          },
          course: course
            ? {
                slug:         (course as any).slug,
                title:        (course as any).title,
                subtitle:     (course as any).subtitle,
                duration:     (course as any).duration,
                totalLessons: (course as any).totalLessons,
                thumbnail:    (course as any).thumbnail,
                category:     (course as any).category,
                level:        (course as any).level,
                modules:      (course as any).modules ?? [],
              }
            : null,
          progress: {
            completedLessons: (progress as any).completedLessons ?? [],
            progressPercent,
            totalLessons:     (progress as any).totalLessons ?? 0,
            lastLessonId:     (progress as any).lastLessonId ?? '',
            lastModuleId:     (progress as any).lastModuleId ?? '',
            completedAt:      (progress as any).completedAt ?? null,
            isComplete,
          },
          certificate: certificateData,
        };
      })
    );

    return NextResponse.json({
      success: true,
      user: {
        id:    user._id.toString(),
        name:  user.name,
        email: user.email,
        role:  user.role,
        avatar: user.avatar ?? null,
      },
      enrolledCount: enrollments.length,
      courses: dashboardCourses,
      lmsAccess: lmsAccess
        ? {
            id:                    (lmsAccess as any)._id.toString(),
            lmsProvider:           (lmsAccess as any).lmsProvider,
            lmsEmail:              (lmsAccess as any).lmsEmail,
            lmsPassword:           (lmsAccess as any).lmsPassword,
            lmsPortalLink:         (lmsAccess as any).lmsPortalLink,
            batchName:             (lmsAccess as any).batchName,
            mentorName:            (lmsAccess as any).mentorName,
            counselorName:         (lmsAccess as any).counselorName,
            supportContact:        (lmsAccess as any).supportContact,
            whatsappNumber:        (lmsAccess as any).whatsappNumber,
            certificationGuidance: (lmsAccess as any).certificationGuidance,
            assignedAt:            (lmsAccess as any).assignedAt,
          }
        : null,
    });
  } catch (err: any) {
    console.error('[Dashboard API]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
