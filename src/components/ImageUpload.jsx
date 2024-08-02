import { useEffect, useState } from 'react';
import IconifyIcon from './wrappers/IconifyIcon';
import httpClient from '@/helpers/httpClient';
import { useNotificationContext } from '@/context/useNotificationContext';
import { SERVER_URL } from '@/helpers/serverUrl';

const ImageUpload = ({ onSendPath, defaultImgSrc }) => {
    const [imageFile, setImageFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [imageSelected, setImageSelected] = useState(false);
    const { showNotification } = useNotificationContext();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImageSrc(reader.result); // Set the image source  
            };

            setImageFile(file); // Store the selected file  
            reader.readAsDataURL(file); // Read the file as a data URL  
            setImageSelected(true);
        }
    };
    useEffect(() => {
        setImageSrc(SERVER_URL + defaultImgSrc);
    }, []);
    useEffect(() => {
        if (imageSelected) {
            handleUpload();
            setImageSelected(false);
        }
    }, [imageFile]);
    const handleUpload = async () => {
        if (!imageFile) {
            alert("Please select an image first!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', imageFile); // Append the file to FormData  
            const res = await httpClient.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Indicate the type of content  
                },
            });
            if (res.data.success) {
                onSendPath(res.data.path);
                showNotification({
                    message: res.data.message,
                    variant: 'success'
                });
            }
            else {
                showNotification({
                    message: res.data.message,
                    variant: 'danger'
                });
            }
        } catch (error) {
            showNotification({
                message: error.response ? error.response.data : error.message,
                variant: 'danger'
            });
        }
    };

    return (
        <div>
            <div className="avatar-lg mb-3" style={{ margin: "auto" }}>
                <div className="avatar-title bg-body rounded-circle border border-3 border-dashed-light position-relative">
                    <label htmlFor="imageInput" className="position-absolute end-0 bottom-0">
                        <div className="avatar-xs cursor-pointer">
                            <span className="avatar-title bg-light text-dark rounded-circle">
                                <IconifyIcon icon="bx:camera" />
                            </span>
                        </div>
                    </label>
                    <input className="hidden" type="file" style={{ display: 'none' }} id="imageInput" accept="image/*" onChange={handleImageChange} />
                    {imageSrc && <img id="preview" src={imageSrc} alt="Preview Image" className="rounded-circle img-fluid" />}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload; 