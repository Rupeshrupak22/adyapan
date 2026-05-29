import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import Payment from '@/models/Payment';
import Enrollment from '@/models/Enrollment';
import { ALL_PLANS } from '@/lib/planData';

export async function GET(request: NextRequest) {
  const auth = await protectRouteByRole(request, ['ADMIN', 'COMPANY']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    const enriched = await Promise.all(
      ALL_PLANS.map(async (plan) => {
        const [purchaseCount, revenueAgg] = await Promise.all([
          Enrollment.countDocuments({
            planLabel: { $regex: plan.label, $options: 'i' },
          }),
          Payment.aggregate([
            {
              $match: {
                planLabel: { $regex: plan.label, $options: 'i' },
                status: 'success',
              },
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
          ]),
        ]);

        return {
          id: plan.id,
          label: plan.label,
          price: plan.price,
          description: plan.tagline,
          duration: plan.duration,
          benefits: plan.benefits,
          purchaseCount,
          revenue: revenueAgg[0]?.total ?? 0,
          paymentCount: revenueAgg[0]?.count ?? 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      plans: enriched,
    });
  } catch (err: any) {
    console.error('[Admin Plans]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
