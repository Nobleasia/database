import cn from "classnames";
import Image from "next/image";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { MdDelete, MdOutlineCloudUpload } from "react-icons/md";

import { Button, Label } from "@/components";

import { getAddHomeLayout } from "@/features/home-management";

const Photos = () => {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext();

  const watchImages = useWatch({
    control,
    name: "images",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const controlledImages = fields.map((field, index) => {
    return {
      ...field,
      ...watchImages[index],
    };
  });

  const handlePreviewLinkImage = (file) => URL.createObjectURL(file);

  const handlePhotosChange = (event) => {
    const { files } = event.target;
    if (files) {
      let filteredArrayFiles = Array.from(files).filter(
        ({ type }) => type === "image/jpeg" || type === "image/png"
      );

      if (controlledImages.length + filteredArrayFiles.length > 10) {
        filteredArrayFiles = [...filteredArrayFiles].slice(
          0,
          filteredArrayFiles.length -
            (controlledImages.length + filteredArrayFiles.length - 10)
        );
      }

      filteredArrayFiles.forEach((file) => append({ file }));
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">
          Upload up to 10 photos ({controlledImages.length}/10)
        </h2>
        <p className="text-sm text-npa-neutral-500">
          Make sure the uploaded photo has the extension (.jpg / .png)
        </p>
      </div>
      <div>
        <div className="w-max rounded-md border-1 border-dashed border-neutral-600 py-6 px-11 text-npa-info-400">
          <Label
            htmlFor="images"
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center font-medium opacity-80 transition-all duration-200 hover:opacity-100",
              {
                "cursor-not-allowed opacity-25 hover:opacity-25":
                  controlledImages.length === 10 || isSubmitting,
              }
            )}
          >
            <MdOutlineCloudUpload className="h-8 w-8 opacity-80" />
            Upload photo
            <Controller
              control={control}
              name="images"
              render={({ field }) => {
                return (
                  <input
                    {...field}
                    value=""
                    type="file"
                    id="images"
                    placeholder="Enter rental price"
                    className="hidden"
                    disabled={controlledImages.length === 10 || isSubmitting}
                    accept="image/png, image/jpg, image/jpeg"
                    multiple
                    onChange={handlePhotosChange}
                  />
                );
              }}
            />
          </Label>
        </div>

        <div className="my-8 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {controlledImages &&
            controlledImages.map(({ id, file }, index) => {
              return (
                <figure
                  className="relative flex h-[200px] max-h-[200px] w-full items-center overflow-hidden xs:w-10/12 sm:w-full"
                  key={`image-${id}`}
                >
                  <Image
                    src={handlePreviewLinkImage(file)}
                    alt={`image-${id}`}
                    className="h-full w-full overflow-hidden bg-cover object-contain"
                    fill
                  />

                  <Button
                    type="button"
                    variant="custom"
                    className="absolute top-4 right-4 rounded-xl bg-npa-neutral-900/60 p-2 opacity-80 transition-all duration-300 hover:opacity-100"
                    disabled={isSubmitting}
                    onClick={() => remove(index)}
                  >
                    <MdDelete className="h-6 w-6 text-white" />
                  </Button>
                </figure>
              );
            })}
        </div>
      </div>
    </section>
  );
};

Photos.getLayout = getAddHomeLayout;

export default Photos;
