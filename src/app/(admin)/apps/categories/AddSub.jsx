import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import httpClient from '@/helpers/httpClient';
import { Modal, ModalBody, ModalFooter, ModalHeader, Pagination } from 'react-bootstrap';
import useToggle from '@/hooks/useToggle';
import TextFormInput from '@/components/form/TextFormInput';
import SelectFormInput from '@/components/form/SelectFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ImageUpload from '@/components/ImageUpload';

const statusOptions = [
    { value: 0, label: 'Disable' },
    { value: 1, label: 'Enable' },
];
const homepageOptions = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
];
const positionOptions = [
    { value: 0, label: 'Main' },
    { value: 1, label: 'More' },
];
const type1Options = [
    { value: 0, label: 'Default' },
    { value: 1, label: 'Trading' },
];
const type2Options = [
    { value: 0, label: 'News' },
    { value: 1, label: 'Article' },
];
const defaultAvatarPath = '/uploads/dummy-avatar.jpg';

const AddSub = ({ categories, tableRefresh, isUpdate, updateClicked, selectedItem }) => {
    const [avatarPath, setAvatarPath] = useState(defaultAvatarPath);
    const [isCreate, setIsCreate] = useState(true);
    const {
        showNotification
    } = useNotificationContext();

    const {
        isTrue,
        toggle
    } = useToggle();

    useEffect(() => {
        if (isUpdate) {
            setValue('name', selectedItem.name);
            setValue('status', selectedItem.status);
            setValue('position', selectedItem.position);
            setValue('type1', selectedItem.type1);
            setValue('type2', selectedItem.type2);
            setValue('homepage', selectedItem.homepage);
            setValue('parent_name', selectedItem.parent_name);
            setValue('sort_order', selectedItem.sort_order);
            setValue('data_query', selectedItem.data_query);

            setAvatarPath(selectedItem.avatar);

            setIsCreate(false);
            toggle();
        }
    }, [updateClicked]);
    const onCreate = () => {
        setIsCreate(true);
        setValue('name', '');
        setValue('status', -1);
        setValue('position', -1);
        setValue('type1', -1);
        setValue('type2', -1);
        setValue('homepage', -1);
        setValue('sort_order', undefined);
        setValue('parent_name', undefined);
        setValue('data_query', '');
        setAvatarPath(defaultAvatarPath);

        toggle();
    }
    const handleAvatarPath = (path) => {
        setAvatarPath(path);
    }
    const getMainCategories = (cats) => {
        let ret = [];
        if (!cats) return [];
        cats.map((cat) => {
            if (cat.kind == 1) {
                ret = [...ret, { value: cat.name, label: cat.name }]
            }
        });
        return ret;
    }
    const categorySchema = yup.object().shape({
        name: yup.string().required('Please enter category name'),
        status: yup.number().integer().required('Please select status'),
        position: yup.number().integer().required('Please select position'), // Corrected typo  
        type1: yup.number().integer().required('Please select type 1'),
        type2: yup.number().integer().required('Please select type 2'),
        homepage: yup.number().integer().required('Please select homepage'),
        sort_order: yup.number().integer().required('Please enter sort order number'),
        data_query: yup.string().required('Please enter data query'),
        parent_name: yup.string().required('Please enter data query'),
    });

    const {
        control,
        setValue,
        handleSubmit,
    } = useForm({
        resolver: yupResolver(categorySchema)
    });

    const onSubmit = async (req) => {
        if (isCreate) {
            try {
                req = { ...req, 'kind': 1, 'avatar': avatarPath };
                const res = await httpClient.post('/categories', req);
                if (res.data.success) {
                    showNotification({
                        message: res.data.message,
                        variant: 'success'
                    });
                    toggle();
                    tableRefresh();
                }
                else {
                    showNotification({
                        message: res.data.message,
                        variant: 'danger'
                    });
                }
            } catch (e) {
                if (e.response?.data?.error) {
                    showNotification({
                        message: e.response?.data?.error,
                        variant: 'danger'
                    });
                }
            }
        }
        else {
            try {
                req = { ...req, 'kind': 1, 'avatar': avatarPath };
                const res = await httpClient.put(`/categories/${selectedItem.id}`, req);
                if (res.data.success) {
                    showNotification({
                        message: res.data.message,
                        variant: 'success'
                    });
                    toggle();
                    tableRefresh();
                }
                else {
                    showNotification({
                        message: res.data.message,
                        variant: 'danger'
                    });
                }
            } catch (e) {
                if (e.response?.data?.error) {
                    showNotification({
                        message: e.response?.data?.error,
                        variant: 'danger'
                    });
                }
            }
            setIsCreate(true);
        }
    }
    return <>

        <Button variant="success" className="d-inline-flex align-items-center" onClick={onCreate}>
            <IconifyIcon icon="bx:plus" className="me-1" />
            Add Sub Category
        </Button>
        <Modal show={isTrue} className="fade" id="exampleModalScrollable" tabIndex={-1}>
            <ModalHeader>
                <h5 className="modal-title" id="exampleModalScrollableTitle">
                    Add Sub Category
                </h5>
                <button type="button" className="btn-close" onClick={toggle} />
            </ModalHeader>
            <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <Row>
                        <ImageUpload onSendPath={handleAvatarPath} defaultImgSrc={avatarPath} />
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <TextFormInput control={control} label="Category Name" name="name" placeholder="Enter name" containerClassName="mb-3" id="category-name" />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <label htmlFor="status" className="form-label">Main Category</label>
                            <SelectFormInput className="select2" required control={control} name="parent_name" options={getMainCategories(categories)} />
                        </Col>
                    </Row><br></br>
                    <Row>
                        <Col lg={6}>
                            <label htmlFor="status" className="form-label">Status</label>
                            <SelectFormInput className="select2" required control={control} name="status" options={statusOptions} />
                        </Col>
                        <Col lg={6}>
                            <label htmlFor="position" className="form-label" >Position</label>
                            <SelectFormInput className="select2" required control={control} name="position" options={positionOptions} />
                        </Col>
                    </Row><br></br>
                    <Row>
                        <Col lg={6}>
                            <label htmlFor="type1" className="form-label">Type1</label>
                            <SelectFormInput className="select2" required control={control} name="type1" options={type1Options} />
                        </Col>
                        <Col lg={6}>
                            <label htmlFor="type2" className="form-label" >Type2</label>
                            <SelectFormInput className="select2" required control={control} name="type2" options={type2Options} />
                        </Col>
                    </Row><br></br>
                    <Row>
                        <Col lg={6}>
                            <label htmlFor="homepage" className="form-label">Homepage</label>
                            <SelectFormInput className="select2" required control={control} name="homepage" options={homepageOptions} />
                        </Col>
                        <Col lg={6}>
                            <TextFormInput control={control} name="sort_order" label="Sort Order" placeholder="Sort Order" containerClassName="mb-3" />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <TextFormInput control={control} name="data_query" label="Data Query" placeholder="Data Query" containerClassName="mb-3" />
                        </Col>
                    </Row>

                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Add Main Category
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    </>
};
export default AddSub;