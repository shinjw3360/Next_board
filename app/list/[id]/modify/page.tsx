"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
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
          contents: data.content || "",
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

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정 (PUT)
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.writer || !form.contents) {
      alert("제목 / 작성자 / 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      // ✅ 수정도 /api/list 사용
      const res = await fetch(`/api/list/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert("수정 실패: " + (data.message || "알 수 없는 오류"));
        return;
      }

      alert("글이 수정되었습니다.");
      // ✅ 상세 페이지 라우트는 기존대로 사용 (프론트 URL)
      router.push(`/list/${id}`);
    } catch (err) {
      console.error(err);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>게시글 수정</h1>

      <form onSubmit={onSubmit}>
        <div className="write_inbox">
          <label>
            제목
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
            작성자
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
            내용
            <textarea
              name="content"
              value={form.contents}
              onChange={onChange}
              placeholder="내용을 입력하세요."
            />
          </label>
        </div>

        <button
          type="submit"
        >
          수정 완료
        </button>
      </form>
    </div>
  );
}
