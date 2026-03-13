/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cvStatusList, positionList, workingFormList } from "@/config/variable";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCircleCheck,
  FaEnvelope,
  FaEye,
  FaPhone,
  FaUserTie,
} from "react-icons/fa6";
import { Toaster, toast } from "sonner";

export const CVList = () => {
  const [cvList, setCVList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [countUpdate, setCountUpdate] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/list?page=${page}`, {
      method: "GET",
      credentials: "include", // Gửi kèm theo cookie
    })
      .then((res) => res.json())
      .then((data) => {
        setCVList(data.cvs);
        setTotalPage(data.totalPage);
      });
  }, [page, countUpdate]);

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };

  const handleChangeStatus = (id: string, status: string) => {
    const dataFinal = {
      status: status,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/change-status/${id}`, {
      method: "PATCH",
      credentials: "include", // Gửi kèm theo cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFinal),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          toast.error(data.message);
        }

        if (data.code == "success") {
          toast.success(data.message);
          setCountUpdate(countUpdate + 1);
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {cvList.map((item) => {
          const position = positionList.find(
            (pos) => pos.value == item.jobPosition,
          );
          const workingForm = workingFormList.find(
            (work) => work.value == item.jobWorkingForm,
          );

          const status = cvStatusList.find(
            (status) => status.value == item.status,
          );

          return (
            <div
              key={item.id}
              className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
              style={{
                background:
                  "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
              }}
            >
              <img
                src="/assets/images/card-bg.svg"
                alt=""
                className="absolute top-[0px] left-[0px] w-[100%] h-auto"
              />
              <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
                {item.jobTitle}
              </h3>
              <div className="mt-[12px] text-center font-[400] text-[14px] text-black">
                Ứng viên: <span className="font-[700]">{item.fullName}</span>
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaEnvelope className="" /> {item.email}
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaPhone className="" /> {item.phone}
              </div>
              <div className="mt-[12px] text-center font-[600] text-[16px] text-[#0088FF]">
                {item.jobSalaryMin}$ - {item.jobSalaryMax}$
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaUserTie className="text-[16px]" /> {position?.label}
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaBriefcase className="text-[16px]" /> {workingForm?.label}
              </div>
              <div
                className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]"
                style={{
                  color: `${item.viewed ? "#121212" : "#FF0000"}`,
                }}
              >
                <FaEye className="text-[16px]" />{" "}
                {item.viewed ? "Đã xem" : "Chưa xem"}
              </div>
              <div
                className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]"
                style={{
                  color: status?.color,
                }}
              >
                <FaCircleCheck className="text-[16px]" /> {status?.label}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px]">
                <Link
                  href={`/company-manage/cv/detail/${item.id}`}
                  className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
                >
                  Xem
                </Link>
                {item.status != "approved" && (
                  <button
                    onClick={() => handleChangeStatus(item.id, "approved")}
                    className="bg-[#9FDB7C] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px]"
                  >
                    Duyệt
                  </button>
                )}
                {item.status != "rejected" && (
                  <button
                    onClick={() => handleChangeStatus(item.id, "rejected")}
                    className="bg-[#FF5100] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
                  >
                    Từ chối
                  </button>
                )}
                <Link
                  href="#"
                  className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
                >
                  Xóa
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-[30px]">
        <select
          onChange={handlePagination}
          className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
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
