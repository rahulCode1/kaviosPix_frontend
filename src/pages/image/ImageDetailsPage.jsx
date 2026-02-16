import axiosInstance from "../../utils/axios";
import ImageDetails from "../../components/image/ImageDetails";
import { useLoaderData } from "react-router";
import Loading from "../../components/Loading/Loading";
import { Suspense } from "react";
import { Await } from "react-router";

const ImageDetailsPage = () => {
  const { image } = useLoaderData();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Await resolve={image}>
          {(isAlbumLoad) => (
            <ImageDetails
              imageDetails={isAlbumLoad.image}
              albumDetails={isAlbumLoad.album}
            />
          )}
        </Await>
      </Suspense>
    </>
  );
};

export default ImageDetailsPage;

const image = async (imageId, albumId) => {
  try {
    const response = await axiosInstance.get(
      `/albums/${albumId}/images/${imageId}/details`,
    );

    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error.response?.data?.message);
  }
};

export const loader = async ({ request, params }) => {
  const url = new URL(request.url);
  const imageId = params.imageId;
  const albumId = url.searchParams.get("albumId");

  return {
    image: image(imageId, albumId),
  };
};
