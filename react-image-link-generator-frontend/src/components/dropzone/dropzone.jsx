import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function MyDropzone() {
  const [progressLoad, setProgressLoad] = useState(0);
  const [fileNumber, setFileNumber] = useState(0);
  const [fileUploading, setFileUploading] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  const apiKey = import.meta.env.VITE_IMAGE_HOST_API_KEY;
  const serverURL = import.meta.env.VITE_SERVER_URL;

  const onDrop = useCallback(
    (files) => {
      let urls = [];
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
            setFileUploading(false); // Set file uploading to false
            const imageURL = await res.data?.data?.display_url;
            urls.push(imageURL);
          }
          if (urls.length === files.length) {
            await axios
              .post(`${serverURL}/upload-photo-url`, urls)
              .then(async (res) => {
                res &&
                  toast.success("Image Upload successful.", {
                    description: Date.now(),
                    action: {
                      label: "Grate!",
                      onClick: () => console.log("Undo"),
                    },
                  });
                const getImageUploadId = res.data?.insertedId;
                await axios
                  .get(`${serverURL}/upload-photos?id=${getImageUploadId}`)
                  .then((result) => {
                    setImageArray(result?.data?.images);
                    console.log(result?.data?.images);
                  });
              })
              .catch((err) => {
                err &&
                  toast.error("An error occurred while uploading the image.", {
                    description: Date.now(),
                    action: {
                      label: "Try again",
                      onClick: () => console.log("Undo"),
                    },
                  });
              });
          } else {
            toast.error("An error occurred while uploading the image.", {
              description: Date.now(),
              action: {
                label: "Try again",
                onClick: () => console.log("Undo"),
              },
            });
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
    [apiKey, serverURL]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <section className="container overflow-auto mx-auto md:flex p-4 flex-row-reverse justify-around items-center">
      <div
        className="flex justify-center my-10 items-center text-2xl"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex w-60 h-60 md:w-80 md:h-80 rounded-3xl shadow-lg justify-center items-center cursor-pointer bg-white">
          {isDragActive ? (
            <div className="w-full h-full flex justify-center items-center">
              {/* <div className="border border-gray-400 rounded-md absolute top-0 left-0 right-0 bottom-0 mx-4 my-4"></div> */}
              <div className="w-full h-screen text-gray-100 font-extrabold text-4xl absolute flex justify-center items-center top-0 left-0 bg-black/70">
                Drag files here
              </div>
              <div className="border-[8px] border-r-0 border-b-0 border-gray-100 rounded-md absolute top-10 left-10 w-10 h-10 lg:w-28 lg:h-28"></div>
              <div className="border-[8px] border-l-0 border-b-0 border-gray-100 rounded-md absolute top-10 right-10 w-10 h-10 lg:w-28 lg:h-28"></div>
              <div className="border-[8px] border-r-0 border-t-0 border-gray-100 rounded-md absolute bottom-10 left-10 w-10 h-10 lg:w-28 lg:h-28"></div>
              <div className="border-[8px] border-t-0 border-l-0 border-gray-100 rounded-md absolute bottom-10 right-10 w-10 h-10 lg:w-28 lg:h-28"></div>
              <div className="flex items-center font-extrabold text-white rounded-full text-center shadow-md bg-blue-500 px-8 py-4">
                Drag here
              </div>
            </div>
          ) : (
            // <p>Drag drop some files here, or click to select files</p>
            <div className="flex items-center font-extrabold text-white rounded-full text-center shadow-md bg-blue-500 px-8 py-4">
              Upload files
            </div>
          )}
        </div>
        <div
          className={
            !fileUploading
              ? "hidden fixed"
              : "flex text-white justify-center items-center top-0 left-0 fixed w-full min-h-screen bg-black/70 "
          }
        >
          <div className="text-2xl font-semibold">
            File {fileNumber} Uploaded {progressLoad} %
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
      <div
        className={`text-4xl p-10 font-extrabold text-gray-400 ${
          imageArray.length > 0
            ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            : "flex justify-center items-center"
        }`}
      >
        {imageArray.length === 0
          ? "Upload image to view"
          : imageArray.map((img, key) => (
              <img
                className="hover:brightness-75 transition"
                key={key}
                src={img}
              ></img>
            ))}
      </div>
    </section>
  );
}
