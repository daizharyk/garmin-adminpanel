import axios from "axios";

const EditArticleForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const onSaveHandler = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("key", "16fb81e14a5584f9cd0d9ecb6d6150da");

      const response = await axios.post("https://api.imgbb.com/1/upload");
      const imageUrl = response.data.data.url;

      const articleData = { ...data, imageUrl };
      dispatch(addArticle(articleData));
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);
  return (
    <Backdrop open={true} onClick={onClose} sx={{ zIndex: 1000 }}>
      <Paper
        sx={{ p: 4, borderRadius: "0" }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSaveHandler)}>
          <Grid container spacing={4} justifyContent={"center"}>
            {previewImage && (
              <Grid item width={"100%"}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    width: "400px",
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                />
              </Grid>
            )}
            <Grid item width={"100%"}>
              <input
                type="file"
                id="fileInput"
                {...register("file")}
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item>
              <Button type={"submit"} variant="contained">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default EditArticleForm;
