"use client";
import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function BoardWrite() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    writer: "",
    content: "",
  });

  // input / textarea 값 변경
  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 전송 (비동기 POST)
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 간단 검증
    if (!form.title || !form.writer || !form.content) {
      alert("제목 / 작성자 / 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      const res = await fetch("/api/list", {   // ✅ /api/board → /api/list 로 변경
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert("등록 실패: " + (data.message || "알 수 없는 오류"));
        return;
      }

      alert("글이 등록되었습니다.");
      // 글 목록 페이지로 이동 (경로는 프로젝트에 맞게 유지 or 수정)
      router.push("/boardList");
    } catch (err) {
      console.error(err);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1 className="create_list_title">게시글 작성</h1>

      <form onSubmit={onSubmit}>
        <div className="write_inbox">
          <label>
            <span>제목</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="제목을 입력하세요."
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
              onChange={onChange}
              placeholder="작성자를 입력하세요."
            />
          </label>
        </div>

        <div className="write_inbox">
          <label>
            <span>내용</span>
            <textarea
              name="content"
              value={form.content}
              onChange={onChange}
              placeholder="내용을 입력하세요."
            />
          </label>
        </div>

        <div className="cre_btnbox">
        <button
          type="submit"
          className="cre_btn"
        >
          CREATE
        </button>
        <Link href="/">Cancel</Link> 
        </div>
      </form>
    </div>
  );
}
