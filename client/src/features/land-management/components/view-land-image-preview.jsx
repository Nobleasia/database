import Image from "next/image";

export const ViewLandImagePreview = ({ photoUrl = "" }) => {
  return (
    <figure className="relative h-56 w-56">
      <Image
        src={photoUrl}
        alt="View Land Image Preview"
        className="h-full w-full overflow-hidden bg-cover object-contain"
        fill
      />
    </figure>
  );
};
