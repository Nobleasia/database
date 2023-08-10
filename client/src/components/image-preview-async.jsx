/* eslint-disable camelcase, object-shorthand, no-plusplus, no-await-in-loop, no-restricted-syntax, no-loop-func */
import * as CheckboxRadix from "@radix-ui/react-checkbox";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { MdCheck } from "react-icons/md";

import { useAxiosPrivate } from "@/hooks";

import { Loader } from "./loader";

export const ImagePreviewAsync = memo(
  ({
    id = "",
    photo_url: photoUrl = "",
    photo_path: photoPath = "",
    onValueChange = () => {},
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
        getImageBlobUrl(photoUrl);
      } catch (error) {
        console.error(
          `Error when fetching blob image from ${photoUrl} with error: ${error}`
        );
      } finally {
        setIsImageLoaded(true);
      }
    }, [id]);

    return (
      <div className="flex gap-2">
        <CheckboxRadix.Root
          className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-npa-purple-400 outline-none ring-npa-purple-300/30 duration-200 focus:ring-[3px] focus:ring-npa-purple-400/50 data-[state=checked]:bg-npa-purple-400 data-[state=checked]:ring-4 active:ring-4 active:ring-npa-purple-400/30"
          onCheckedChange={(value) =>
            onValueChange(value, {
              id,
              photoUrl,
              photoPath,
            })
          }
        >
          <CheckboxRadix.Indicator>
            <MdCheck className="text-white" />
          </CheckboxRadix.Indicator>
        </CheckboxRadix.Root>
        <figure
          className="relative flex h-40 max-h-[150px] w-40 items-center overflow-hidden xl:h-56 xl:w-56"
          key={`image-${id}`}
        >
          {isImageLoaded && imageBlobUrl.length > 0 && (
            <Image
              src={imageBlobUrl}
              alt={`image-${id}`}
              className="overflow-hidden bg-cover object-contain"
              fill
            />
          )}

          {!isImageLoaded && imageBlobUrl.length <= 0 && (
            <div className="flex w-full items-center justify-center">
              <Loader />
            </div>
          )}
        </figure>
      </div>
    );
  }
);

ImagePreviewAsync.displayName = "ImagePreviewAsync";
