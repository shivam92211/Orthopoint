import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import InstrumentModel from "@/models/Instrument";

// GET single instrument by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const instrument = await InstrumentModel.findById(id).lean();

    if (!instrument) {
      return NextResponse.json(
        { success: false, error: "Instrument not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: instrument,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update instrument (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const body = await request.json();

    // Ensure mostSold is explicitly set when provided (boolean)
    const updateData: any = { ...body };
    if (Object.prototype.hasOwnProperty.call(body, "mostSold")) {
      updateData.mostSold = !!body.mostSold;
    }

    const instrument = await InstrumentModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!instrument) {
      return NextResponse.json(
        { success: false, error: "Instrument not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: instrument,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE instrument (protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const instrument = await InstrumentModel.findByIdAndDelete(id);

    if (!instrument) {
      return NextResponse.json(
        { success: false, error: "Instrument not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Instrument deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
