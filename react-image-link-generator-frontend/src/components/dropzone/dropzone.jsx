import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function MyDropzone() {
  const [progressLoad, setProgressLoad] = useState(0);
  const [fileNumber, setFileNumber] = useState(0);
  const [fileUploading, setFileUploading] = useState(false);
  const apiKey = import.meta.env.VITE_IMAGE_HOST_API_KEY;

  const onDrop = useCallback(
    (files) => {
      const uploadFile = async (key) => {
        try {
          for (let i = 0; i < files.length; i++) {
            const imageFile = { image: files[i] };

            const res = await axios.post(
              `https://api.imgbb.com/1/upload?expiration=400&key=${key}`,
              imageFile,
              {
                headers: {
                  "content-type": "multipart/form-data",
                },
                onUploadProgress: (progress) => {
                  setFileNumber(i + 1);
                  setFileUploading(true);
                  const total = progress.total;
                  const percent = Math.round((progress.loaded * 100) / total);
                  setProgressLoad(percent);
                },
              }
            );
            setFileUploading(false);
            const imageURL = await res.data?.data?.display_url;
            console.log(imageURL);
          }
        } catch (error) {
          toast.error("An error occurred while uploading the image.", {
            description: Date.now(),
            action: {
              label: "Try again",
              onClick: () => console.log("Undo"),
            },
          });
          console.error(":", error);
        }
      };
      //   Using callback function
      uploadFile(apiKey);
    },
    [apiKey]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className="w-full h-screen cursor-pointer flex justify-center items-center text-2xl"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="w-screen h-screen flex justify-center items-center absolute top-0 left-0 bg-gray-200 bg-opacity-50 z-50">
        {isDragActive ? (
          <div className="w-full h-full flex justify-center items-center">
            {/* <div className="border border-gray-400 rounded-md absolute top-0 left-0 right-0 bottom-0 mx-4 my-4"></div> */}
            <div className="border-[8px] border-r-0 border-b-0 border-gray-400 rounded-md absolute top-10 left-10 w-28 h-28"></div>
            <div className="border-[8px] border-l-0 border-b-0 border-gray-400 rounded-md absolute top-10 right-10 w-28 h-28"></div>
            <div className="border-[8px] border-r-0 border-t-0 border-gray-400 rounded-md absolute bottom-10 left-10 w-28 h-28"></div>
            <div className="border-[8px] border-t-0 border-l-0 border-gray-400 rounded-md absolute bottom-10 right-10 w-28 h-28"></div>
            <div className="bg-white h-36 px-4 flex items-center rounded-lg shadow-lg">
              <p className="text-center">Drag files here.</p>
            </div>
          </div>
        ) : (
          // <p>Drag drop some files here, or click to select files</p>
          <div className="bg-white h-36 px-4 flex items-center rounded-lg shadow-lg">
            <p className="text-center">Click to drag or drop files here.</p>
          </div>
        )}
      </div>
      <div
        className={
          !fileUploading
            ? "hidden fixed"
            : "flex z-50 text-white justify-center items-center top-0 left-0 fixed w-full min-h-screen bg-black/70 "
        }
      >
        <div className="text-2xl font-semibold">
          file {fileNumber} Uploaded {progressLoad} %
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
