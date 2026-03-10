/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";
import { useEffect, useState } from "react";

export const CompanyList = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=3`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setCompanyList(data.companyList);
      });
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
        {companyList.map((item) => (
          <CardCompanyItem key={item.id} {...item} />
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
