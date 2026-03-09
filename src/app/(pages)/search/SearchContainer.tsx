/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CardJobItem } from "@/app/components/card/CardJobItem";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SearchContainer = () => {
  const searchParams = useSearchParams();
  const language = searchParams.get("language") || "";
  const [jobList, setJobList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?language=${language}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setJobList(data.jobs);
      });
  }, [language]);

  return (
    <>
      <h2 className="font-[700] text-[28px] text-[#121212] mb-[30px]">
        {jobList.length} việc làm{" "}
        <span className="text-[#0088FF]">{language}</span>
      </h2>

      <div
        className="bg-white rounded-[8px] py-[10px] px-[20px] mb-[30px] flex flex-wrap gap-[12px]"
        style={{
          boxShadow: "0px 4px 20px 0px #0000000F",
        }}
      >
        <select
          name=""
          className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
        >
          <option value="">Cấp bậc</option>
          <option value="">Intern</option>
          <option value="">Fresher</option>
          <option value="">Junior</option>
          <option value="">Middle</option>
          <option value="">Senior</option>
          <option value="">Manager</option>
        </select>
        <select
          name=""
          className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
        >
          <option value="">Hình thức làm việc</option>
          <option value="">Tại văn phòng</option>
          <option value="">Làm từ xa</option>
          <option value="">Linh hoạt</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {jobList.map((item) => (
          <CardJobItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-[30px]">
        <select
          name=""
          className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042] outline-none"
        >
          <option value="">Trang 1</option>
          <option value="">Trang 2</option>
          <option value="">Trang 3</option>
        </select>
      </div>
    </>
  );
};
