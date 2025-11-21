"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { boardType } from "@/app/type/boardType";

export default function BoardList() {
  const [board, setBoard] = useState<boardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch("/api/list"); // list 테이블을 조회하는 API
        if (!res.ok) {
          throw new Error("게시글을 불러오는데 실패했습니다.");
        }
        const data = await res.json();
        setBoard(data);
      } catch (err) {
        console.error(err);
        alert("서버 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, []);

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="p-4">
      <div className="list_writebox">
        <h2 className="text-2xl font-bold mb-4">List</h2>
        <Link href="/list/write">write</Link>
      </div>

      {board.length === 0 ? (
        <p>등록된 게시글이 없습니다.</p>
      ) : (
        <table className="w-full border-collapse list_table">
          <thead>
            <tr className="border-b">
              <th className="table_title">번호</th>
              <th className="table_number">제목</th>
              <th className="table_write">작성자</th>
              <th className="table_date">작성일</th>
            </tr>
          </thead>
          <tbody>
            {board.map((item, idx) => (
              <tr key={item.id}>
                <td className="">{idx + 1}</td>
                <td className="">
                  <Link
                    href={`/list/${item.id}`}
                  >
                    {item.title}
                  </Link>
                </td>
                <td className="">{item.writer}</td>
                <td className="">
                  {item.reg_date
                    ? new Date(item.reg_date).toLocaleDateString("ko-KR")
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
