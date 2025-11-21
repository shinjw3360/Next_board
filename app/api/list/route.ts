// GET(전체 조회), POST(생성)

import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// 1. 전체 게시글 조회
export async function GET() {
    try {
        const[rows] = await db.query('SELECT * FROM list ORDER BY id DESC');
        return NextResponse.json(rows);
    } catch (e: any) {
        return NextResponse.json({error:e.message},{status: 500});
    }
}

// 2. 게시글 등록
export async function POST(req: NextRequest) {
    try {

        const { title, writer, contents } = await req.json();
        const [result] = await db.query(
            'INSERT INTO list(title, writer, contents) VALUES(?,?,?)',
            [title, writer, contents]
        );
        console.log(result);
        return NextResponse.json({message:'게시글 등록 성공!', result}, {status:200});
        
    } catch (e: any) {
        return NextResponse.json({error:e.message},{status: 500});
    }
};