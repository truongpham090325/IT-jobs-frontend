/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const CompanyList = () => {
  const searchParams = useSearchParams();
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const router = useRouter();
  const page = searchParams.get("page") || "";

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=3&page=${page}`,
      {
        method: "GET",
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setCompanyList(data.companyList);
        setTotalPage(data.totalPage);
      });
  }, [page]);

  const handlePagination = (event: any) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("page", value);
    } else {
      params.delete("page");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
        {companyList.map((item) => (
          <CardCompanyItem key={item.id} {...item} />
        ))}
      </div>

      <div className="mt-[30px]">
        <select
          onChange={handlePagination}
          className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042] outline-none"
        >
          {Array(totalPage)
            .fill("")
            .map((item, index) => (
              <option key={index} value={index + 1}>
                Trang {index + 1}
              </option>
            ))}
        </select>
      </div>
    </>
  );
};
