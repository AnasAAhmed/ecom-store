import { corsHeaders } from "@/lib/cors";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type GraphData = {
    name: string;
    totalSales: any;
    paidSales: any;
    codSales: any;
    canceledSales: any;
}[]


//monthly or one year data
const getSalesPerMonth = async (selectedMonthNumber: number = 6, yearBased: boolean) => {
    await connectToDB();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0–11

    // Compute the earliest month we care about
    const fromDate = new Date(currentYear, currentMonth - (selectedMonthNumber - 1), 1);

    const salesPerMonth = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: fromDate,
                    $lte: new Date(currentYear, 11, 31, 23, 59, 59),
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                totalSales: { $sum: "$totalAmount" },
                paidSales: {
                    $sum: { $cond: [{ $and: [{ $eq: ["$isPaid", true] }, { $ne: ["$status", "canceled"] }] }, "$totalAmount", 0] },
                },
                codSales: {
                    $sum: { $cond: [{ $and: [{ $eq: ["$isPaid", false] }, { $ne: ["$status", "canceled"] }] }, "$totalAmount", 0] },
                },
                canceledSales: {
                    $sum: { $cond: [{ $eq: ["$status", "canceled"] }, "$totalAmount", 0] },
                },
            },
        },
        { $sort: { "_id.month": 1 } },
    ]);


    // Build full 12-month array (Jan–Dec)
    const graphData = Array.from({ length: 12 }, (_, i) => {
        const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
            new Date(0, i)
        );
        const monthData = salesPerMonth.find((item) => item._id.month === i + 1);
        return {
            name: month,
            totalSales: monthData?.totalSales || 0,
            paidSales: monthData?.paidSales || 0,
            codSales: monthData?.codSales || 0,
            canceledSales: monthData?.canceledSales || 0,
        };
    });
    const months = yearBased && selectedMonthNumber === 12
        ? Array.from({ length: 12 }, (_, i) => i) // Jan (0) to Dec (11)
        : Array.from({ length: selectedMonthNumber }, (_, i) =>
            (currentMonth - (selectedMonthNumber - 1 - i) + 12) % 12
        );

    return months.map((m) => graphData[m]);
};

const getSalesPerDay = async (monthIndex: number, year?: number) => {
    // monthIndex = 0-based (0 = Jan, 6 = July, etc.)
    const now = new Date();
    const currentYear = year ? year : now.getFullYear();
    const startDate = new Date(currentYear, monthIndex, 1);
    const endDate = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59); // last day of month

    const salesPerDay = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: { day: { $dayOfMonth: "$createdAt" } },
                totalSales: { $sum: "$totalAmount" },
                paidSales: { $sum: { $cond: ["$isPaid", "$totalAmount", 0] } },
                codSales: { $sum: { $cond: [{ $not: ["$isPaid"] }, "$totalAmount", 0] } },
                canceledSales: {
                    $sum: { $cond: [{ $eq: ["$status", "canceled"] }, "$totalAmount", 0] },
                },
            },
        },
        { $sort: { "_id.day": 1 } },
    ]);

    // Pre-fill all days of the month
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const found = salesPerDay.find((d) => d._id.day === day);
        return {
            name: String(day),
            totalSales: found?.totalSales || 0,
            paidSales: found?.paidSales || 0,
            codSales: found?.codSales || 0,
            canceledSales: found?.canceledSales || 0,
        };
    });
};


export const GET = async (req: NextRequest) => {
    try {
        const token = req.cookies.get('authjs.admin-session')?.value
        if (!token) {
            return NextResponse.json("Token is missing", {
                status: 401,
                headers: corsHeaders,
                statusText: 'Admin Auth Token is missing'

            });
        }
        const decodedToken = await decode({ token, salt: process.env.ADMIN_SALT!, secret: process.env.AUTH_SECRET! })
        if (!decodedToken || decodedToken.role !== 'admin' || !decodedToken.isAdmin) {
            return NextResponse.json("Unauthorized", { status: 401, headers: corsHeaders, statusText: 'Unauthorized' });
        }
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken!.exp && decodedToken!.exp < now) {
            return NextResponse.json("Session expired. Please log in again.", {
                status: 401,
                headers: corsHeaders,
                statusText: 'Session expired. Please log in again.'
            });
        }

        const { searchParams } = new URL(req.url);
        const selectedMonths = Number(searchParams.get("selectedMonths")!);
        const yearBased = searchParams.get("yearBased")! === 'true';
        const singleMonthIndexParam = searchParams.get("singleMonthIndex");
        const singleMonthIndex = singleMonthIndexParam !== null && singleMonthIndexParam !== "undefined"
            ? Number(singleMonthIndexParam)
            : null;
        const singleMonthWithYear = Number(searchParams.get("singleMonthWithYear")!);

        await connectToDB()

        let graphData: GraphData = []
        if (singleMonthIndex !== null && !isNaN(singleMonthIndex) && !selectedMonths) {
            graphData = await getSalesPerDay(singleMonthIndex, singleMonthWithYear);
        } else {
            graphData = await getSalesPerMonth(selectedMonths || 6, yearBased);
        }

        return NextResponse.json({ graphData }, { status: 200, headers: corsHeaders })
    } catch (err) {
        console.log("[admin_graph_GET]", err)
        return NextResponse.json((err as Error).message, { status: 500, headers: corsHeaders, statusText: (err as Error).message, })
    }
}
