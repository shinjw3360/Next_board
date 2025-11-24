"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";

type FormState = {
  title: string;
  writer: string;
  content: string;
};

export default function ListChange() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<FormState>({
    title: "",
    writer: "",
    content: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/list/${id}`);
        if (!res.ok) {
          const text = await res.text();
          console.error("GET /api/list 실패:", res.status, text);
          alert("게시글을 가져오는데 실패했습니다.");
          return;
        }

        const data = await res.json();
        console.log("GET /api/list 응답:", data);

        setForm({
          title: data.title || "",
          writer: data.writer || "",
          // 백엔드가 content 로 보내는 걸 기준으로, 혹시 contents 면도 대비
          content: data.content ?? data.contents ?? "",
        });
      } catch (err) {
        console.error("GET /api/list 에러:", err);
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
      [name]: value, // name 이 title / writer / content 여야 함
    }));
  };

  // 수정 (PUT)
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.writer || !form.content) {
      alert("제목 / 작성자 / 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      const res = await fetch(`/api/list/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // { title, writer, content }
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("PUT /api/list 실패:", res.status, text);

        let msg = "알 수 없는 오류";
        try {
          const data = JSON.parse(text);
          msg = data.message || data.error || msg;
        } catch {}

        alert("수정 실패: " + msg);
        return;
      }

      alert("글이 수정되었습니다.");
      router.push(`/list/${id}`);
    } catch (err) {
      console.error("PUT /api/list 에러:", err);
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
              value={form.content}
              onChange={onChange}
              placeholder="내용을 입력하세요."
            />
          </label>
        </div>

        <div className="submit_btn">
          <button type="submit">수정 완료</button>
        </div>
      </form>
    </div>
  );
}
