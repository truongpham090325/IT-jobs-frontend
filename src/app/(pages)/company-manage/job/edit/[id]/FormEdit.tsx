/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { EditorMCE } from "@/app/components/editor/EdittorMCE";
import { useEffect, useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
// Import the plugin code
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import JustValidate from "just-validate";
import { positionList, workingFormList } from "@/config/variable";
import { Toaster, toast } from "sonner";

// Register the plugin
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormEdit = (props: { id: string }) => {
  const editorRef = useRef(null);
  const [images, setImages] = useState<any>([]);
  const [jobDetail, setJobDetail] = useState<any>();
  const { id } = props;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/edit/${id}`, {
      method: "GET",
      credentials: "include", // Gửi kèm theo cookie
    })
      .then((res) => res.json())
      .then((data) => {
        setJobDetail(data.jobDetail);
      });
  }, [id]);

  useEffect(() => {
    if (jobDetail) {
      // Hiển thị images mặc định
      if (jobDetail.images && jobDetail.images.length > 0) {
        const listImage = jobDetail.images.map((image: string) => {
          return {
            source: image,
          };
        });
        setImages(listImage);
      }

      const validator = new JustValidate("#editForm");
      validator
        .addField("#title", [
          {
            rule: "required",
            errorMessage: "Vui lòng nhập tên công việc!",
          },
        ])
        .addField("#salaryMin", [
          {
            rule: "minNumber",
            value: 0,
            errorMessage: "Vui lòng nhập mức lương >= 0!",
          },
        ])
        .addField("#salaryMax", [
          {
            rule: "minNumber",
            value: 0,
            errorMessage: "Vui lòng nhập mức lương >= 0!",
          },
        ]);
    }
  }, [jobDetail]);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const title = event.target.title.value;
    const salaryMin = event.target.salaryMin.value;
    const salaryMax = event.target.salaryMax.value;
    const position = event.target.position.value;
    const workingForm = event.target.workingForm.value;
    const technologies = event.target.technologies.value;
    let description = "";
    if (editorRef.current) {
      description = (editorRef.current as any).getContent();
    }

    // Tạo Form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("salaryMin", salaryMin);
    formData.append("salaryMax", salaryMax);
    formData.append("position", position);
    formData.append("workingForm", workingForm);
    formData.append("technologies", technologies);
    formData.append("description", description);

    // Images
    if (images.length > 0) {
      for (const image of images) {
        formData.append("images", image.file);
      }
    }
    // End images

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/edit/${id}`, {
      method: "PATCH",
      body: formData,
      credentials: "include", // gửi kèm theo cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          toast.error(data.message);
        }

        if (data.code == "success") {
          toast.success(data.message);
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      {jobDetail && (
        <form
          id="editForm"
          action=""
          className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
          onSubmit={handleSubmit}
        >
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Tên công việc *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={jobDetail.title}
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="">
            <label
              htmlFor="salaryMin"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Mức lương tối thiểu ($)
            </label>
            <input
              type="number"
              name="salaryMin"
              id="salaryMin"
              defaultValue={jobDetail.salaryMin}
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="">
            <label
              htmlFor="salaryMax"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Mức lương tối đa ($)
            </label>
            <input
              type="number"
              name="salaryMax"
              id="salaryMax"
              defaultValue={jobDetail.salaryMax}
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="">
            <label
              htmlFor="position"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Cấp bậc
            </label>
            <select
              name="position"
              id="position"
              defaultValue={jobDetail.position}
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            >
              {positionList.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <label
              htmlFor="workingForm"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Hình thức làm việc
            </label>
            <select
              name="workingForm"
              id="workingForm"
              defaultValue={jobDetail.workingForm}
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            >
              {workingFormList.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="technologies"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Các công nghệ
            </label>
            <input
              type="text"
              name="technologies"
              id="technologies"
              defaultValue={jobDetail.technologies.join(", ")}
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="images"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Danh sách ảnh
            </label>
            <FilePond
              name="images"
              allowMultiple={true}
              allowRemove={true} // cho phép xóa ảnh
              maxFiles={8}
              labelIdle="+"
              acceptedFileTypes={["image/*"]}
              onupdatefiles={setImages}
              files={images}
              className="w-[25%]"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Mô tả chi tiết
            </label>
            <EditorMCE editorRef={editorRef} value={jobDetail.description} />
          </div>
          <div className="sm:col-span-2">
            <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
              Cập nhập
            </button>
          </div>
        </form>
      )}
    </>
  );
};
