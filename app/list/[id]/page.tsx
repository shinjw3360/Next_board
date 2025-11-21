"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ListChange() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    title: "",
    writer: "",
    contents: "",
  });

  // 게시글 데이터 가져오기 (조회용)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/list/${id}`);
        if (!res.ok) {
          alert("게시글을 가져오는데 실패했습니다.");
          return;
        }
        const data = await res.json();
        setForm({
          title: data.title || "",
          writer: data.writer || "",
          contents: data.contents || "",
        });
      } catch (err) {
        console.error(err);
        alert("서버 통신 중 오류가 발생했습니다.");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // 삭제 (DELETE만 가능)
  const onDelete = async () => {
    const ok = confirm("정말 이 게시글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/list/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert("삭제 실패: " + (data.message || "알 수 없는 오류"));
        return;
      }

      alert("글이 삭제되었습니다.");
      router.push("/boardList"); // 목록으로 이동
    } catch (err) {
      console.error(err);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
        <div className="write_inbox">
          <label>
          <span>제목</span>
            <input
              type="text"
              name="writer"
              value={form.title}
              placeholder="제목을 입력하세요."
              readOnly
            />
          </label>
        </div>

        <div className="write_inbox">
          <label>
          <span>작성자</span>
            <input
              type="text"
              name="writer"
              value={form.writer}
              placeholder="작성자를 입력하세요."
              readOnly
            />
          </label>
        </div>


        <div className="write_inbox">
          <label>
          <span>내용</span>
          <textarea
              name="content"
              value={form.contents}
              placeholder="내용을 입력하세요."
              readOnly
            />
          </label>
        </div>

      <div className="modify_btn">
        <button
          type="button"
          onClick={onDelete}>
          Delete
        </button>

        <Link href={`/list/${id}/modify`}>Modify</Link>

        <button
          type="button"
          onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </div>
  );
}
