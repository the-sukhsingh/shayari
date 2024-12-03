import { NextResponse } from "next/server";
import connectToDatabase from "../db";
import Poem from "../schemas/poem";

export async function GET(request, { params }) {
    await connectToDatabase();
    const awaitedParams = await params;
    const poem = awaitedParams.poem;
    const getPoem = await Poem.findOne({ slug: poem });

    if (!getPoem) {
        return NextResponse.json({ error: "Poem not found" }, { status: 404 });
    }

    return NextResponse.json(getPoem);
}