import { Await, useLoaderData } from "react-router";

import AlbumImages from "../../components/album/AlbumImages";
import apiInstance from "../../utils/axios";
import { Suspense } from "react";
import Loading from "../../components/Loading/Loading";
import { data } from "react-router";

const AlbumImagesPage = () => {
  const { albumImages } = useLoaderData();

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={albumImages}>
        {(isAlbumLoad) => (
          <AlbumImages
            albumImages={isAlbumLoad.images}
            album={isAlbumLoad.album}
            users={isAlbumLoad.users}
          />
        )}
      </Await>
    </Suspense>
  );
};

export default AlbumImagesPage;

const albumImages = async (albumId) => {
  try {
    const response = await apiInstance.get(`/albums/${albumId}/images`);

    return response.data;
  } catch (error) {
    // console.log(error.response?.data?.message);

    throw data(
      {
        message: error.response?.data?.message || "Failed to load album",
      },
      {
        status: error.response?.status || 500,
      },
    );
  }
};

export const loader = async ({ request, params }) => {
  const albumId = params.albumId;
  return {
    albumImages: albumImages(albumId),
  };
};
