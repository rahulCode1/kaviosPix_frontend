import AlbumForm from "../../components/album/AlbumForm";
import { redirect } from "react-router";
import axiosInstance from "../../utils/axios";

const AddAlbumPage = () => {
  return (
    <>
      <AlbumForm />
    </>
  );
};

export default AddAlbumPage;

export const action = async ({ request }) => {
  const formData = await request.formData();
  const token = localStorage.getItem("token");
  const ownerId = localStorage.getItem("userId");

  if (!token) {
    return redirect("/login");
  }

  const albumData = {
    name: formData.get("name"),
    description: formData.get("description"),
    ownerId,
  };

  console.log(albumData);

  try {
    const response = await axiosInstance.post(`/albums`, albumData);

    console.log(response);
  } catch (err) {
    console.log(err);
  }
};
