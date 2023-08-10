import cn from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { MdDelete, MdOutlineCloudUpload } from "react-icons/md";

import { useAxiosPrivate } from "@/hooks";

import { Button, Label, Loader } from "@/components";

import { getEditHomeLayout } from "@/features/home-management";

const ImagePreview = ({ id, src, disabledRemoveButton, index, onRemove }) => {
  return (
    <figure
      className="relative flex h-[200px] max-h-[200px] items-center overflow-hidden"
      key={`image-${id}`}
    >
      <Image
        src={src}
        alt={`image-${id}`}
        className="h-56 w-56 overflow-hidden bg-cover object-contain"
        fill
      />

      <Button
        type="button"
        variant="custom"
        className="absolute top-4 right-4 rounded-xl bg-npa-neutral-900/60 p-2 opacity-80 transition-all duration-300 hover:opacity-100"
        disabled={disabledRemoveButton}
        onClick={() => onRemove(index)}
      >
        <MdDelete className="h-6 w-6 text-white" />
      </Button>
    </figure>
  );
};

const ImagePreviewAsync = ({
  id,
  index,
  imageUrl,
  onRemove,
  disabledRemoveButton,
}) => {
  const instance = useAxiosPrivate();
  const [imageBlobUrl, setImageBlobUrl] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const fetchBlob = async (url) => {
      try {
        const { data } = await instance.get(url, {
          responseType: "blob",
        });

        return data;
      } catch (error) {
        console.error(
          `Error when fetching blob image from ${url} with error: ${error}`
        );
      }
    };

    const getImageBlobUrl = async (url) => {
      let blobUrl = "";

      try {
        const response = await fetchBlob(url);
        blobUrl = URL.createObjectURL(response);
      } catch (error) {
        console.error(
          `Error when creating blob url from ${url} with error: ${error}`
        );
      }

      setImageBlobUrl(blobUrl);
    };

    try {
      setIsImageLoaded(false);
      getImageBlobUrl(imageUrl);
    } catch (error) {
      console.error(
        `Error when fetching blob image from ${imageUrl} with error: ${error}`
      );
    } finally {
      setIsImageLoaded(true);
    }
  }, [id]);

  return (
    <figure
      className="relative flex h-[200px] max-h-[200px] items-center overflow-hidden"
      key={`image-${id}`}
    >
      {isImageLoaded && imageBlobUrl.length > 0 && (
        <Image
          src={imageBlobUrl}
          alt={`image-${id}`}
          className="h-56 w-56 overflow-hidden bg-cover object-contain"
          fill
        />
      )}

      {!isImageLoaded && imageBlobUrl.length <= 0 && (
        <div className="flex w-full items-center justify-center">
          <Loader />
        </div>
      )}

      <Button
        type="button"
        variant="custom"
        className="absolute top-4 right-4 rounded-xl bg-npa-neutral-900/60 p-2 opacity-80 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 hover:[&:not(:disabled)]:opacity-100"
        disabled={disabledRemoveButton || !isImageLoaded}
        onClick={() => onRemove(index)}
      >
        <MdDelete className="h-6 w-6 text-white" />
      </Button>
    </figure>
  );
};

const Photos = () => {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext();

  const [watchImages, watchPhotosIds] = useWatch({
    control,
    name: ["images", "photosIds"],
  });

  const {
    fields: imagesFields,
    append: imagesAppend,
    remove: imagesRemove,
  } = useFieldArray({
    control,
    name: "images",
  });

  const { fields: photosIdsFields, remove: photosIdsRemove } = useFieldArray({
    control,
    name: "photosIds",
  });

  const { append: deletedPhotosIdsAppend } = useFieldArray({
    control,
    name: "deleted_photo_ids",
  });

  const controlledImages = imagesFields.map((field, index) => {
    return {
      ...field,
      ...watchImages[index],
    };
  });

  const controlledPhotosIds = photosIdsFields.map((field, index) => {
    return {
      ...field,
      ...watchPhotosIds[index],
    };
  });

  const handlePreviewLinkImage = (file) => URL.createObjectURL(file);

  const handlePhotosChange = (event) => {
    const { files } = event.target;
    if (files) {
      let filteredArrayFiles = Array.from(files).filter(
        ({ type }) => type === "image/jpeg" || type === "image/png"
      );

      if (
        controlledImages.length +
          filteredArrayFiles.length +
          watchPhotosIds.length >
        10
      ) {
        filteredArrayFiles = [...filteredArrayFiles].slice(
          0,
          filteredArrayFiles.length -
            (controlledImages.length +
              filteredArrayFiles.length +
              watchPhotosIds.length -
              10)
        );
      }

      filteredArrayFiles.forEach((file) => imagesAppend({ file }));
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">
          Upload up to 10 photos (
          {controlledImages.length + watchPhotosIds.length}/10)
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
                  controlledImages.length + controlledPhotosIds.length === 10 ||
                  isSubmitting,
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

        <div className="my-8 grid auto-rows-auto grid-cols-3 gap-8">
          {controlledPhotosIds.length > 0 &&
            controlledPhotosIds.map(({ id, photo_url: photoUrl }, index) => (
              <ImagePreviewAsync
                key={`image-${id}`}
                id={id}
                index={index}
                imageUrl={photoUrl}
                disabledRemoveButton={isSubmitting}
                onRemove={(index) => {
                  const imageId = controlledPhotosIds[index].id;
                  deletedPhotosIdsAppend({ id: imageId, force_delete: true });
                  photosIdsRemove(index);
                }}
              />
            ))}

          {controlledImages.length > 0 &&
            controlledImages.map(({ id, file }, index) => (
              <ImagePreview
                key={`image-${id}`}
                id={id}
                index={index}
                src={handlePreviewLinkImage(file)}
                disabledRemoveButton={isSubmitting}
                onRemove={imagesRemove}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

Photos.getLayout = getEditHomeLayout;

export default Photos;
